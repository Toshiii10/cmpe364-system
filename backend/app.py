import os
from flask import Flask, request, session
from sqlalchemy import select
from werkzeug.security import check_password_hash, generate_password_hash
from database import Base, SessionLocal, engine
from models import Record
from validation import validate_record

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-only-change-me")

DEMO_USER = {
    "username": "demo",
    "password_hash": generate_password_hash("change-me"),
}

Base.metadata.create_all(engine)


def record_to_dict(record):
    return {
        "id": record.id,
        "title": record.title,
        "requester_name": record.requester_name,
        "concern": record.concern,
        "description": record.description,
        "status": record.status,
    }


def require_login():
    """Authorization check helper for protected endpoints."""
    if "username" not in session:
        return {"error": "Login required"}, 401
    return None


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/records")
def list_records():
    with SessionLocal() as db:
        items = db.scalars(select(Record).order_by(Record.id)).all()
        return [record_to_dict(item) for item in items]


@app.post("/api/records")
def create_record():
    data = request.get_json(silent=True) or {}
    errors, cleaned = validate_record(data)
    if errors:
        return {"errors": errors}, 400

    item = Record(**cleaned)
    with SessionLocal() as db:
        db.add(item)
        db.commit()
        db.refresh(item)
        return record_to_dict(item), 201


@app.put("/api/records/<int:record_id>")
def update_record(record_id):
    denied = require_login()
    if denied:
        return denied

    data = request.get_json(silent=True) or {}
    errors, cleaned = validate_record(data)
    if errors:
        return {"errors": errors}, 400

    with SessionLocal() as db:
        item = db.get(Record, record_id)
        if item is None:
            return {"error": "Record not found"}, 404
        item.title = cleaned["title"]
        item.requester_name = cleaned["requester_name"]
        item.concern = cleaned["concern"]
        item.description = cleaned["description"]
        item.status = cleaned["status"]
        db.commit()
        db.refresh(item)
        return record_to_dict(item)


@app.delete("/api/records/<int:record_id>")
def delete_record(record_id):
    denied = require_login()
    if denied:
        return denied

    with SessionLocal() as db:
        item = db.get(Record, record_id)
        if item is None:
            return {"error": "Record not found"}, 404
        db.delete(item)
        db.commit()
        return {"ok": True}


@app.post("/api/login")
def login():
    data = request.get_json(silent=True) or {}
    username = str(data.get("username", "")).strip()
    password = str(data.get("password", ""))

    if username != DEMO_USER["username"] or not check_password_hash(
        DEMO_USER["password_hash"], password
    ):
        return {"error": "Invalid credentials"}, 401

    session["username"] = username
    return {"username": username}


@app.get("/api/session")
def session_status():
    return {"username": session.get("username")}


@app.post("/api/logout")
def logout():
    session.clear()
    return {"ok": True}


if __name__ == "__main__":
    app.run(debug=True)
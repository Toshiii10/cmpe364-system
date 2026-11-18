import os
from flask import Flask, request, session
from sqlalchemy import select
from werkzeug.security import check_password_hash, generate_password_hash
from database import Base, SessionLocal, engine
from models import Record
from validation import validate_record

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-only-change-me")

Base.metadata.create_all(engine)

DEMO_USERS = {
    "demo": generate_password_hash("change-me"),
}

def record_to_dict(record):
    return {
        "id": record.id,
        "title": record.title,
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

@app.post("/api/login")
def login():
    data = request.get_json(silent=True) or {}
    username = str(data.get("username", "")).strip()
    password = str(data.get("password", ""))

    stored_hash = DEMO_USERS.get(username)
    if not stored_hash or not check_password_hash(stored_hash, password):
        return {"error": "Invalid username or password"}, 401

    session["username"] = username
    return {"username": username}

@app.get("/api/session")
def session_status():
    return {"username": session.get("username")}

@app.post("/api/logout")
def logout():
    session.clear()
    return {"ok": True}

@app.get("/api/records")
def list_records():
    with SessionLocal() as db:
        items = db.scalars(select(Record).order_by(Record.id)).all()
        return [record_to_dict(item) for item in items]

@app.post("/api/records")
def create_record():
    data = request.get_json(silent=True) or {}
    errors, title, status = validate_record(data)
    if errors:
        return {"errors": errors}, 400

    item = Record(title=title, status=status)
    with SessionLocal() as db:
        db.add(item)
        db.commit()
        db.refresh(item)
        return record_to_dict(item), 201

if __name__ == "__main__":
    app.run(debug=True)
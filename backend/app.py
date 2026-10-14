import os
from flask import Flask, request, send_from_directory
from sqlalchemy import select
from database import Base, SessionLocal, engine
from models import Record

app = Flask(__name__, static_folder="../web/dist")

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

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/records")
def list_records():
    with SessionLocal() as db:
        items = db.scalars(select(Record).order_by(Record.id.desc())).all()
        return [record_to_dict(item) for item in items]

@app.post("/api/records")
def create_record():
    data = request.get_json(silent=True) or {}
    title = str(data.get("title", "")).strip()
    
    if not title:
        return {"error": "title is required"}, 400
        
    requester_name = str(data.get("requester_name", "")).strip() or "Anonymous"
    concern = str(data.get("concern", "General")).strip() or "General"
    description = str(data.get("description", "")).strip()
    status = str(data.get("status", "open")).strip() or "open"

    item = Record(
        title=title,
        requester_name=requester_name,
        concern=concern,
        description=description,
        status=status,
    )
    
    with SessionLocal() as db:
        db.add(item)
        db.commit()
        db.refresh(item)
        return record_to_dict(item), 201

@app.put("/api/records/<int:record_id>")
def update_record(record_id):
    data = request.get_json(silent=True) or {}
    with SessionLocal() as db:
        item = db.get(Record, record_id)
        if not item:
            return {"error": "Record not found"}, 404

        if "title" in data:
            title = str(data["title"]).strip()
            if not title:
                return {"error": "title cannot be empty"}, 400
            item.title = title
        if "requester_name" in data:
            item.requester_name = str(data["requester_name"]).strip() or "Anonymous"
        if "concern" in data:
            item.concern = str(data["concern"]).strip() or "General"
        if "description" in data:
            item.description = str(data["description"]).strip()
        if "status" in data:
            item.status = str(data["status"]).strip() or "open"

        db.commit()
        db.refresh(item)
        return record_to_dict(item), 200

@app.delete("/api/records/<int:record_id>")
def delete_record(record_id):
    with SessionLocal() as db:
        item = db.get(Record, record_id)
        if not item:
            return {"error": "Record not found"}, 404
        db.delete(item)
        db.commit()
        return {"message": "Record deleted"}, 200

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

if __name__ == '__main__':
    app.run(debug=True)
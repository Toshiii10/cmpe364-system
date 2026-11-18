ALLOWED_STATUSES = {"open", "closed"}


def validate_record(data):
    """Inspects incoming JSON payload and returns (errors_dict, cleaned_fields)."""
    errors = {}
    data = data or {}

    title = str(data.get("title", "")).strip()
    status = str(data.get("status", "open")).strip().lower()
    requester_name = str(data.get("requester_name", "")).strip() or "Anonymous"
    concern = str(data.get("concern", "")).strip() or "General Inquiry"
    description = str(data.get("description", "")).strip()

    if not title:
        errors["title"] = "Title is required."
    if status not in ALLOWED_STATUSES:
        errors["status"] = "Status must be 'open' or 'closed'."

    cleaned = {
        "title": title,
        "requester_name": requester_name,
        "concern": concern,
        "description": description,
        "status": status,
    }
    return errors, cleaned
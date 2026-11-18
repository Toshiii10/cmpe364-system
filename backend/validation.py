ALLOWED_STATUSES = {"open", "closed"}

def validate_record(data):
    """Inspects incoming JSON payload and returns (errors_dict, title, status)."""
    errors = {}
    data = data or {}
    title = str(data.get("title", "")).strip()
    status = str(data.get("status", "open")).strip().lower()

    if not title:
        errors["title"] = "Title is required."
    if status not in ALLOWED_STATUSES:
        errors["status"] = "Status must be 'open' or 'closed'."

    return errors, title, status
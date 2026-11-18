import { useState } from "react";

export default function RecordCard({
  record,
  canModify,
  onToggleStatus,
  onUpdate,
  onDelete,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(record.title);
  const [editName, setEditName] = useState(record.requester_name || "");
  const [editConcern, setEditConcern] = useState(record.concern || "General Inquiry");
  const [editDesc, setEditDesc] = useState(record.description || "");
  const [editStatus, setEditStatus] = useState(record.status);

  const isClosed = record.status === "closed";

  async function handleSave(e) {
    e.preventDefault();
    if (!onUpdate) return;

    const ok = await onUpdate(record.id, {
      title: editTitle.trim(),
      requester_name: editName.trim() || "Anonymous",
      concern: editConcern,
      description: editDesc.trim(),
      status: editStatus,
    });
    if (ok) {
      setIsEditing(false);
    }
  }

  function handleCancel() {
    setEditTitle(record.title);
    setEditName(record.requester_name || "");
    setEditConcern(record.concern || "General Inquiry");
    setEditDesc(record.description || "");
    setEditStatus(record.status);
    setIsEditing(false);
  }

  function handleToggle() {
    if (onToggleStatus) {
      onToggleStatus(record);
    } else if (onUpdate) {
      onUpdate(record.id, {
        title: record.title,
        status: isClosed ? "open" : "closed",
      });
    }
  }

  if (isEditing) {
    return (
      <article className="record-card card-editing">
        <form onSubmit={handleSave} className="edit-form">
          <div className="card-top">
            <span className="record-id">Editing #{record.id}</span>
          </div>

          <label className="edit-label">
            Subject / Title
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </label>

          <div className="edit-row">
            <label className="edit-label">
              Requester Name
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </label>

            <label className="edit-label">
              Concern
              <select value={editConcern} onChange={(e) => setEditConcern(e.target.value)}>
                <option value="Technical Issue">Technical Issue</option>
                <option value="Account & Access">Account & Access</option>
                <option value="Hardware / Lab">Hardware / Lab</option>
                <option value="Feature Request">Feature Request</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </label>
          </div>

          <label className="edit-label">
            Status
            <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </label>

          <label className="edit-label">
            Description
            <textarea
              rows={3}
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
            />
          </label>

          <div className="card-actions">
            <button type="submit" className="btn-save" disabled={!canModify}>
              Save
            </button>
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </article>
    );
  }

  return (
    <article className={`record-card ${isClosed ? "card-closed" : ""}`}>
      <div className="card-top">
        <div className="badge-group">
          <span className="record-id">#{record.id}</span>
          <span className="concern-tag">{record.concern || "General"}</span>
        </div>
        <span className={`status-badge ${isClosed ? "badge-closed" : "badge-open"}`}>
          {record.status}
        </span>
      </div>

      <h2 className="record-title">{record.title}</h2>

      {record.description && <p className="record-desc">{record.description}</p>}

      <div className="record-meta">
        <span>
          <strong>{record.requester_name || "Anonymous"}</strong>
        </span>
      </div>

      <div className="card-actions">
        {onUpdate && (
          <button
            type="button"
            className="btn-secondary"
            disabled={!canModify}
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        )}
        <button
          type="button"
          className="btn-secondary"
          disabled={!canModify}
          onClick={handleToggle}
        >
          {isClosed ? "Reopen" : "Resolve"}
        </button>
        <button
          type="button"
          className="btn-danger"
          disabled={!canModify}
          onClick={() => onDelete(record.id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
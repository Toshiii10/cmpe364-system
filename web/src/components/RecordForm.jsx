import { useState } from "react";

export default function RecordForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [concern, setConcern] = useState("Technical Issue");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");

  function handleSubmit(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    onAdd({
      title: cleanTitle,
      requester_name: requesterName.trim() || "Anonymous",
      concern,
      description: description.trim(),
      status,
    });

    setTitle("");
    setRequesterName("");
    setConcern("Technical Issue");
    setDescription("");
    setStatus("open");
  }

  return (
    <form className="enterprise-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <span className="form-title">Create New Record</span>
        <span className="char-counter">{title.length}/120</span>
      </div>

      <div className="form-grid">
        <div className="input-group">
          <label htmlFor="req-name">Name</label>
          <input
            id="req-name"
            type="text"
            placeholder="e.g., Juan Dela Cruz"
            value={requesterName}
            onChange={(e) => setRequesterName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="req-concern">Concern Category</label>
          <select
            id="req-concern"
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
          >
            <option value="Technical Issue"> Technical Issue</option>
            <option value="Account & Access"> Account & Access</option>
            <option value="Hardware / Lab"> Hardware / Lab</option>
            <option value="Feature Request"> Feature Request</option>
            <option value="General Inquiry"> General Inquiry</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="record-status">Initial Status</label>
          <select
            id="record-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="open"> Open</option>
            <option value="closed"> Closed</option>
          </select>
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="record-title">Subject / Title </label>
        <input
          id="record-title"
          type="text"
          maxLength={120}
          required
          placeholder="Brief summary of the issue or record..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label htmlFor="record-desc">Detailed Description</label>
        <textarea
          id="record-desc"
          rows={3}
          placeholder="Provide additional context, steps to reproduce, or notes..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-footer">
        <button type="submit" className="btn-primary" disabled={!title.trim()}>
           Submit Record
        </button>
      </div>
    </form>
  );
}
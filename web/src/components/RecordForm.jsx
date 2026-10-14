import { useState } from "react";

export default function RecordForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("open");

  function handleSubmit(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    onAdd({ title: cleanTitle, status });
    setTitle("");
    setStatus("open");
  }

  return (
    <form className="enterprise-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <span className="form-title">Create New Record</span>
        <span className="char-counter">{title.length}/120</span>
      </div>
      <div className="form-row">
        <div className="input-wrapper">
          <label htmlFor="record-title" className="sr-only">Title</label>
          <input
            id="record-title"
            type="text"
            maxLength={120}
            placeholder="Enter record title or task description..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="select-wrapper">
          <label htmlFor="record-status" className="sr-only">Status</label>
          <select
            id="record-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <button type="submit" className="btn-primary" disabled={!title.trim()}>
          Add Record
        </button>
      </div>
    </form>
  );
}
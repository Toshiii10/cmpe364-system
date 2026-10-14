import { useState } from "react";

export default function RecordForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("open");

  function handleSubmit(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    
    if (!cleanTitle) {
      return;
    }
    
    const recordData = {
      title: cleanTitle,
      status: status,
    };
    
    onAdd(recordData);
    setTitle("");
    setStatus("open");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title
        <input value={title} onChange={(event) => setTitle(event.target.value)} />
      </label>
      <label>
        Status
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </label>
      <button type="submit">Add Record</button>
    </form>
  );
}
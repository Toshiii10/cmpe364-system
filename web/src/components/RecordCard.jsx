export default function RecordCard({ record, onDelete, onToggleStatus }) {
  const isClosed = record.status === "closed";

  return (
    <article className={`record-card ${isClosed ? "card-closed" : ""}`}>
      <div className="card-top">
        <span className="record-id">#{record.id}</span>
        <span className={`status-badge ${isClosed ? "badge-closed" : "badge-open"}`}>
          {record.status}
        </span>
      </div>
      <h2 className="record-title">{record.title}</h2>
      <div className="card-actions">
        {onToggleStatus && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onToggleStatus(record.id)}
          >
            Mark {isClosed ? "Open" : "Closed"}
          </button>
        )}
        <button
          type="button"
          className="btn-danger"
          onClick={() => onDelete(record.id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
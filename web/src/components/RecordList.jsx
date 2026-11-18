import RecordCard from "./RecordCard.jsx";

export default function RecordList({
  records,
  canModify,
  onToggleStatus,
  onUpdate,
  onDelete,
}) {
  if (records.length === 0) {
    return (
      <div className="empty-state">
        <p>No matching records found.</p>
      </div>
    );
  }

  return (
    <section className="record-grid">
      {records.map((record) => (
        <RecordCard
          key={record.id}
          record={record}
          canModify={canModify}
          onToggleStatus={onToggleStatus}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}
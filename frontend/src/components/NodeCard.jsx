const NoteCard = ({
  note,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="note-card">
      <h2>{note.title}</h2>

      <p>{note.description}</p>

      <small>
        Created At:{" "}
        {new Date(
          note.createdAt
        ).toLocaleDateString()}
      </small>

      <div className="card-buttons">
        <button
          className="view-btn"
          onClick={() =>
            alert(
              `Title: ${note.title}\n\nDescription: ${note.description}`
            )
          }
        >
          View
        </button>

        <button
          className="edit-btn"
          onClick={() => onEdit(note)}
        >
          Edit
        </button>

        <button
          className="delete-btn"
          onClick={() =>
            onDelete(note._id)
          }
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
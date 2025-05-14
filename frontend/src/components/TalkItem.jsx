export default function TalkItem({ talk, onEdit, onDelete }) {
	return (
		<li className="talk-item">
			<div>
				<strong>{talk.title}</strong> — {talk.subject} ({talk.level})<br />
				{talk.duration} min — {talk.description}
			</div>
			<div className="actions">
				<button onClick={onEdit}>✏️</button>
				<button onClick={onDelete}>🗑️</button>
			</div>
		</li>
	);
}

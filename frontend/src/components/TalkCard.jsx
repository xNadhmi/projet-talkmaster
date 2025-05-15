export default function TalkCard({ talk }) {
	return (
		<div className="talk-card">
			{talk.status && <span className={`status ${talk.status.replace(" ", "-")}`}>{talk.status}</span>}
			<h3>{talk.title}</h3>
			<p>{talk.subject} — {talk.level}</p>
			<p>{talk.description}</p>
			<p><strong>{talk.date}</strong> à <strong>{talk.time}</strong> — {talk.room}</p>
		</div>
	);
}

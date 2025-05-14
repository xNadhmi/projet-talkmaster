export default function TalkCard({ talk }) {
	return (
		<div className="talk-card">
			<h3>{talk.title}</h3>
			<p>{talk.subject} — {talk.level}</p>
			<p><strong>{talk.day}</strong> à <strong>{talk.time}</strong> — {talk.room}</p>
			<p>{talk.description}</p>
		</div>
	);
}

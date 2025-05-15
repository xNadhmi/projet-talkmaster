import { useState } from "react";

export default function TalkManagerCard({ talk, onStatusChange, onAssign }) {
	const [room, setRoom] = useState(talk.room || "Salle 1");
	const [date, setDate] = useState(talk.date || "");
	const [time, setTime] = useState(talk.time || "09:00");

	const handleAssign = (e) => {
		e.preventDefault();
		onAssign(talk.id, room, date, time);
	};

	return (
		<div className="talk-card-manage">
			<h3>{talk.title}</h3>
			<p className="description">{talk.description}</p>
			<p><strong>Conférencier :</strong> {talk.speaker?.name || "—"}</p>

			<p className={`status ${talk.status}`}>Statut : {talk.status}</p>

			{talk.status === "en attente" && (
				<div className="actions">
					<button onClick={() => onStatusChange(talk.id, "accepté")}>✅ Accepter</button>
					<button onClick={() => onStatusChange(talk.id, "refusé")}>❌ Refuser</button>
				</div>
			)}

			{talk.room && talk.date && talk.time && (
				<p><strong>📍</strong> {talk.room} — {talk.date} à {talk.time}</p>
			)}

			{talk.status === "accepté" && (
				<form className="assign-form" onSubmit={handleAssign}>
					<select value={room} onChange={(e) => setRoom(e.target.value)}>
						{[1, 2, 3, 4, 5].map((r) => (
							<option key={r} value={`Salle ${r}`}>Salle {r}</option>
						))}
					</select>
					<input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
					<input type="time" min="09:00" max="19:00" value={time} onChange={(e) => setTime(e.target.value)} />
					<button type="submit">📅 Assigner</button>
				</form>
			)}
		</div>
	);
}

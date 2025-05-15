import { useState } from "react";

export default function TalkAssignmentForm({ talk, onAssign }) {
	const [room, setRoom] = useState(talk.room || "Salle 1");
	const [date, setDate] = useState(talk.date || "");
	const [time, setTime] = useState(talk.time || "09:00");

	const handleSubmit = (e) => {
		e.preventDefault();

		const hour = parseInt(time.split(":")[0]);
		if (hour < 9 || hour >= 19) {
			alert("Heure invalide. Doit être entre 9h et 19h.");
			return;
		}

		onAssign(room, date, time);
	};

	return (
		<form onSubmit={handleSubmit} className="assign-form">
			<select value={room} onChange={(e) => setRoom(e.target.value)}>
				<option value="Salle 1">Salle 1</option>
				<option value="Salle 2">Salle 2</option>
				<option value="Salle 3">Salle 3</option>
				<option value="Salle 4">Salle 4</option>
				<option value="Salle 5">Salle 5</option>
			</select>
			<input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
			<input type="time" min="09:00" max="19:00" value={time} onChange={(e) => setTime(e.target.value)} required />
			<button type="submit">📅 Assigner</button>
		</form>
	);
}

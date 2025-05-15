import { useState } from "react";
import { submitTalkRequest } from "../services/talkService";

export default function TalkSubmissionForm({ setTalks }) {
	const [form, setForm] = useState({
		title: "",
		description: "",
		room: "1",
		date: "",
		time: "09:00",
		level: "beginner"
	});	
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		const hour = parseInt(form.time.split(":")[0]);
		if (hour < 9 || hour >= 19) {
			setError("Les créneaux doivent être entre 9h et 19h.");
			return;
		}

		const newTalk = {
			title: form.title,
			description: form.description,
			room: `Salle ${form.room}`,
			date: form.date,
			time: form.time,
			level: form.level
		};		

		try {
			const savedTalk = await submitTalkRequest(newTalk);
			setTalks((prev) => [...prev, savedTalk]);
			setSuccess("Talk soumis avec succès !");
			setForm({
				title: "",
				description: "",
				room: "1",
				date: "",
				time: "09:00",
				level: "beginner"
			});			
		} catch (err) {
			setError(err.response?.data?.message || "Erreur serveur.");
		}
	};

	return (
		<form className="talk-form" onSubmit={handleSubmit}>
			<input
				type="text"
				name="title"
				placeholder="Titre"
				value={form.title}
				onChange={handleChange}
				required
			/>
			<textarea
				name="description"
				placeholder="Description"
				value={form.description}
				onChange={handleChange}
				required
			/>
			<div className="row">
				<select name="room" value={form.room} onChange={handleChange}>
					<option value="1">Salle 1</option>
					<option value="2">Salle 2</option>
					<option value="3">Salle 3</option>
					<option value="4">Salle 4</option>
					<option value="5">Salle 5</option>
				</select>
				<select name="level" value={form.level} onChange={handleChange}>
					<option value="beginner">Débutant</option>
					<option value="intermediate">Intermédiaire</option>
					<option value="advanced">Avancé</option>
				</select>
			</div>
			<div className="row">
				<input
					type="date"
					name="date"
					value={form.date}
					onChange={handleChange}
					required
				/>
				<input
					type="time"
					name="time"
					value={form.time}
					onChange={handleChange}
					required
					min="09:00"
					max="18:59"
				/>
			</div>

			{error && <p className="error">{error}</p>}
			{success && <p className="success">{success}</p>}

			<button type="submit">Soumettre</button>
		</form>
	);
}

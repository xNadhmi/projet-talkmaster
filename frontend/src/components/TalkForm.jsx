import { useEffect, useState } from "react";

const initialTalk = {
	title: "",
	subject: "",
	description: "",
	duration: 30,
	level: "beginner"
};

export default function TalkForm({ onSubmit, editingTalk }) {
	const [talk, setTalk] = useState(initialTalk);

	useEffect(() => {
		if (editingTalk) {
			setTalk(editingTalk);
		}
	}, [editingTalk]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setTalk({ ...talk, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit({ ...talk });
		setTalk(initialTalk);
	};

	return (
		<form className="talk-form" onSubmit={handleSubmit}>
			<input name="title" placeholder="Titre" value={talk.title} onChange={handleChange} required />
			<input name="subject" placeholder="Sujet" value={talk.subject} onChange={handleChange} required />
			<textarea name="description" placeholder="Description" value={talk.description} onChange={handleChange} required />
			<input name="duration" type="number" placeholder="Durée (min)" value={talk.duration} onChange={handleChange} min="5" required />
			<select name="level" value={talk.level} onChange={handleChange}>
				<option value="beginner">Débutant</option>
				<option value="intermediate">Intermédiaire</option>
				<option value="advanced">Avancé</option>
			</select>
			<button type="submit">
				{editingTalk ? "Modifier le talk" : "Soumettre le talk"}
			</button>
		</form>
	);
}

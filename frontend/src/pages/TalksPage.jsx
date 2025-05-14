import { useState } from "react";
import TalkForm from "../components/TalkForm";
import TalkList from "../components/TalkList";

export default function TalksPage() {
	const [talks, setTalks] = useState([]);
	const [editingTalk, setEditingTalk] = useState(null);

	const handleCreateOrUpdate = (talk) => {
		if (talk.id) {
			setTalks((prev) =>
				prev.map((t) => (t.id === talk.id ? talk : t))
			);
		} else {
			talk.id = Date.now();
			setTalks((prev) => [...prev, talk]);
		}
		setEditingTalk(null);
	};

	const handleEdit = (talk) => {
		setEditingTalk(talk);
	};

	const handleDelete = (id) => {
		setTalks((prev) => prev.filter((t) => t.id !== id));
	};

	return (
		<div className="talks-page">
			<h2>Mes Talks</h2>
			<TalkForm onSubmit={handleCreateOrUpdate} editingTalk={editingTalk} />
			<TalkList talks={talks} onEdit={handleEdit} onDelete={handleDelete} />
		</div>
	);
}

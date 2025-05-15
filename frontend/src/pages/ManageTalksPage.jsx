import { useEffect, useState } from "react";
import { fetchAllTalks, updateTalkStatus, assignTalkSchedule } from "../services/talkService";
import TalkManagerCard from "../components/TalkManagerCard";

const mockTalks = [
	{
		id: 1,
		title: "Introduction à React",
		status: "en attente",
		room: "",
		date: "",
		time: "",
		speaker: { name: "Alice Dupont" }
	},
	{
		id: 2,
		title: "Sécurité Node.js",
		status: "accepté",
		room: "Salle 3",
		date: "2025-05-22",
		time: "10:00",
		speaker: { name: "Bob Martin" }
	},
	{
		id: 3,
		title: "Optimisation MySQL",
		status: "refusé",
		room: "",
		date: "",
		time: "",
		speaker: { name: "Chloé Besson" }
	}
];

export default function ManageTalksPage() {
	const [talks, setTalks] = useState([]);

	useEffect(() => {
		loadTalks();
	}, []);

	const loadTalks = async () => {
		try {
			const data = await fetchAllTalks();
			setTalks(Array.isArray(data) && data.length ? data : mockTalks);
		} catch {
			setTalks(mockTalks);
		}
	};

	const handleStatusChange = async (id, status) => {
		try {
			await updateTalkStatus(id, status);
			await loadTalks();
		} catch {
			setTalks((prev) =>
				prev.map((t) => (t.id === id ? { ...t, status } : t))
			);
		}
	};

	const handleAssignment = async (id, room, date, time) => {
		try {
			await assignTalkSchedule(id, { room, date, time });
			await loadTalks();
		} catch {
			setTalks((prev) =>
				prev.map((t) =>
					t.id === id ? { ...t, room, date, time } : t
				)
			);
		}
	};

	return (
		<div className="manage-talks-page">
			<h1>Gestion des Propositions</h1>
			<div className="talk-card-grid">
				{talks.map((talk) => (
					<TalkManagerCard
						key={talk.id}
						talk={talk}
						onStatusChange={handleStatusChange}
						onAssign={handleAssignment}
					/>
				))}
			</div>
		</div>
	);
}

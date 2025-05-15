import { useState, useEffect } from "react";
import TalkSubmissionForm from "../components/TalkSubmissionForm";
import TalkList from "../components/TalkList";

const mockTalks = [
	{
		id: 1,
		title: "React Magic",
		description: "Advanced topics in React",
		room: "Salle 1",
		date: "2025-05-18",
		time: "10:00",
		status: "en attente"
	},
	{
		id: 2,
		title: "NodeJS Performance",
		description: "Best practices",
		room: "Salle 3",
		date: "2025-05-19",
		time: "13:00",
		status: "accepté"
	},
	{
		id: 3,
		title: "Prisma ORM Tips",
		subject: "Databases",
		description: "How to master Prisma with MySQL",
		room: "Salle 3",
		date: "2025-05-19",
		time: "13:00",
		status: "refusé"
	}
];

export default function TalksPage() {
	const [talks, setTalks] = useState([]);
	const [filter, setFilter] = useState("all");

	useEffect(() => {
		// Replace with API call later
		setTalks(mockTalks);
	}, []);

	const filteredTalks = talks.filter((talk) => {
		if (filter === "all") return true;
		return talk.status === filter;
	});

	return (
		<div className="talks-page">
			<h1>Mes Talk</h1>
			<details className="accordion">
				<summary>Soumettre un nouveau talk</summary>
				<div className="content">
					<TalkSubmissionForm setTalks={setTalks} />
				</div>
			</details>

			<div className="filters">
				<button className="filter" onClick={() => setFilter("all")} selected={filter === "all" ? "true" : undefined}>Tous</button>
				<button className="filter" onClick={() => setFilter("en attente")} selected={filter === "en attente" ? "true" : undefined}>En attente</button>
				<button className="filter" onClick={() => setFilter("accepté")} selected={filter === "accepté" ? "true" : undefined}>Acceptés</button>
				<button className="filter" onClick={() => setFilter("refusé")} selected={filter === "refusé" ? "true" : undefined}>Refusés</button>
			</div>

			<TalkList talks={filteredTalks} />
		</div>
	);
}

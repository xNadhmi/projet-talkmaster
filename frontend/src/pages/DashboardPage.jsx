import { useEffect, useState } from "react";
import PlanningFilters from "../components/PlanningFilters";
import TalkList from "../components/TalkList";
import { fetchAllTalks } from "../services/talkService";

const mockTalks = [
	{
		id: 1,
		title: "React Advanced Patterns",
		subject: "React",
		description: "Hooks, Context and beyond",
		level: "Avancé",
		room: "Salle 1",
		date: "2025-05-18",
		time: "10:00"
	},
	{
		id: 2,
		title: "Intro à Node.js",
		subject: "Node.js",
		description: "Backend JS fundamentals",
		level: "Débutant",
		room: "Salle 2",
		date: "2025-05-19",
		time: "09:30"
	},
	{
		id: 3,
		title: "Prisma ORM Tips",
		subject: "Databases",
		description: "How to master Prisma with MySQL",
		level: "Intermédiaire",
		room: "Salle 1",
		date: "2025-05-19",
		time: "13:00"
	}
];

export default function DashboardPage() {
	const [talks, setTalks] = useState([]);
	const [filters, setFilters] = useState({ date: "", room: "", level: "" });

	useEffect(() => {
		async function loadTalks() {
			try {
				const data = await fetchAllTalks();
				setTalks(Array.isArray(data) && data.length > 0 ? data : mockTalks);
			} catch (err) {
				console.error("API failed, using mock talks.", err);
				setTalks(mockTalks);
			}
		}

		loadTalks();
	}, []);

	const handleFilterChange = (field, value) => {
		setFilters({ ...filters, [field]: value });
	};

	const filteredTalks = talks.filter((talk) => {
		return (
			(filters.date ? talk.date === filters.date : true) &&
			(filters.room ? talk.room === filters.room : true) &&
			(filters.level ? talk.level === filters.level : true)
		);
	});

	return (
		<div className="planning-page">
			<h1>Planning des Talks</h1>
			<PlanningFilters filters={filters} onChange={handleFilterChange} talks={talks} />
			<TalkList talks={filteredTalks} />
		</div>
	);
}

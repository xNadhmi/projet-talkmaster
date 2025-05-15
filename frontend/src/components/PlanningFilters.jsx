export default function PlanningFilters({ filters, onChange, talks }) {
	// Dynamically extract filter values from current talks
	const uniqueDates = [...new Set(talks.map((t) => t.date))].sort();
	const uniqueRooms = [...new Set(talks.map((t) => t.room))].sort();
	const uniqueLevels = [...new Set(talks.map((t) => t.level))].sort();

	return (
		<div className="filters">
			<select value={filters.date} onChange={(e) => onChange("date", e.target.value)}>
				<option value="">Toutes les dates</option>
				{uniqueDates.map((date) => (
					<option key={date || `empty-date-${Math.random()}`} value={date}>{date || "(date vide)"}</option>
				))}

			</select>

			<select value={filters.room} onChange={(e) => onChange("room", e.target.value)}>
				<option value="">Toutes les salles</option>
				{uniqueRooms.map((room) => (
					<option key={room || `empty-room-${Math.random()}`} value={room}>{room || "(inconnu)"}</option>
				))}
			</select>

			<select value={filters.level} onChange={(e) => onChange("level", e.target.value)}>
				<option value="">Tous niveaux</option>
				{uniqueLevels.map((level) => (
					<option key={level || `empty-level-${Math.random()}`} value={level}>{level || "(non défini)"}</option>
				))}
			</select>
		</div>
	);
}

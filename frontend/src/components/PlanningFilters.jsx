export default function PlanningFilters({ filters, onChange }) {
	return (
		<div className="filters">
			<select value={filters.day} onChange={(e) => onChange("day", e.target.value)}>
				<option value="">Tous les jours</option>
				<option value="Jour 1">Jour 1</option>
				<option value="Jour 2">Jour 2</option>
			</select>

			<select value={filters.room} onChange={(e) => onChange("room", e.target.value)}>
				<option value="">Toutes les salles</option>
				<option value="Salle 1">Salle 1</option>
				<option value="Salle 2">Salle 2</option>
			</select>

			<select value={filters.level} onChange={(e) => onChange("level", e.target.value)}>
				<option value="">Tous niveaux</option>
				<option value="beginner">Débutant</option>
				<option value="intermediate">Intermédiaire</option>
				<option value="advanced">Avancé</option>
			</select>
		</div>
	);
}

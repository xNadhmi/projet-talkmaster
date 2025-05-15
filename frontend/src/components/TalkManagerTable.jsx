import TalkAssignmentForm from "./TalkManagerTable";

export default function TalkManagerTable({ talks, onStatusChange, onAssign }) {
	return (
		<table className="talk-manager-table">
			<thead>
				<tr>
					<th>Titre</th>
					<th>Status</th>
					<th>Conférencier</th>
					<th>Assignation</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
			{Array.isArray(talks) && talks.length > 0 ? (
				talks.map((talk) => (
					<tr key={talk.id}>
						<td>{talk.title}</td>
						<td>{talk.status}</td>
						<td>{talk.speaker?.name || "—"}</td>
						<td>
							{talk.status === "accepté" && (
								<TalkAssignmentForm
									talk={talk}
									onAssign={(room, date, time) => onAssign(talk.id, room, date, time)}
								/>
							)}
						</td>
						<td>
							{talk.status === "en attente" && (
								<>
									<button onClick={() => onStatusChange(talk.id, "accepté")}>✅ Accepter</button>
									<button onClick={() => onStatusChange(talk.id, "refusé")}>❌ Refuser</button>
								</>
							)}
						</td>
					</tr>
				))
			) : (
				<tr>
					<td colSpan="5">Aucun talk trouvé.</td>
				</tr>
			)}
			</tbody>
		</table>
	);
}

import TalkItem from "./TalkItem";

export default function TalkList({ talks, onEdit, onDelete }) {
	if (talks.length === 0) return <p>Vous n'avez pas encore de talks.</p>;

	return (
		<ul className="talk-list">
			{talks.map((talk) => (
				<TalkItem
					key={talk.id}
					talk={talk}
					onEdit={() => onEdit(talk)}
					onDelete={() => onDelete(talk.id)}
				/>
			))}
		</ul>
	);
}

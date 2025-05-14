import TalkCard from "./TalkCard";

export default function TalkSchedule({ talks }) {
	if (talks.length === 0) {
		return <p>Aucun talk ne correspond à vos filtres.</p>;
	}

	return (
		<div className="talk-schedule">
			{talks.map((talk) => (
				<TalkCard key={talk.id} talk={talk} />
			))}
		</div>
	);
}

import { useAuth } from "../store/AuthContext";

export default function LoginPage() {
	const { login } = useAuth();

	return (
		<div style={{ padding: "2rem" }}>
			<h2>Login</h2>
			<p>Select a role:</p>
			<button onClick={() => login("speaker")}>Login as Speaker</button>
			<button onClick={() => login("organizer")} style={{ marginLeft: "1rem" }}>
				Login as Organizer
			</button>
		</div>
	);
}

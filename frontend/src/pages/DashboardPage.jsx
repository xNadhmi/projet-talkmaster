// src/pages/DashboardPage.jsx
import { useAuth } from "../store/AuthContext";

export default function DashboardPage() {
	const { user, logout } = useAuth();

	return (
		<div style={{ padding: "2rem" }}>
			<h2>Dashboard</h2>
			<p>Welcome, {user?.name} ({user?.role})</p>
			<button onClick={logout}>Logout</button>
		</div>
	);
}

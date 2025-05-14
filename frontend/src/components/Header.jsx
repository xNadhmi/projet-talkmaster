import { Link } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

export default function Header() {
	const { user, logout } = useAuth();

	return (
		<header className="header">
			<nav>
				<Link to="/dashboard">Planning</Link>

				{user?.role === "speaker" && (
					<Link to="/dashboard/talks" style={{ marginLeft: "1rem" }}>
						Gérer mes talks
					</Link>
				)}
			</nav>

			{user && (
				<button onClick={logout} style={{ marginLeft: "auto" }}>
					Se déconnecter
				</button>
			)}
		</header>
	);
}

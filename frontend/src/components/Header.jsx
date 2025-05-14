import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

export default function Header() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/dashboard");
	};

	return (
		<header className="header">
			<nav>
				<Link to="/dashboard">Planning</Link>

				{user?.role === "speaker" && (
					<Link to="/dashboard/talks" style={{ marginLeft: "1rem" }}>
						Mes Talks
					</Link>
				)}
			</nav>

			<div className="auth-buttons">
				{user ? (
					<button onClick={handleLogout}>Se déconnecter</button>
				) : (
					<>
						<Link className="button" to="/login">Connexion</Link>
						<Link className="button" to="/register">Inscription</Link>
					</>
				)}
			</div>
		</header>
	);
}

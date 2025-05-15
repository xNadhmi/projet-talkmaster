import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerRequest } from "../services/authService";

export default function RegisterPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("speaker");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!name || !email || !password) {
			setError("Tous les champs sont requis.");
			return;
		}

		try {
			await registerRequest({ name, email, password, role });
			navigate("/login");
		} catch (err) {
			setError(err.toString());
		}
	};

	return (
		<div className="login-page">
			<div className="login-card">
				<h1>Inscription</h1>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						placeholder="Nom"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						type="password"
						placeholder="Mot de passe"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<select value={role} onChange={(e) => setRole(e.target.value)}>
						<option value="speaker">Conférencier</option>
						<option value="organizer">Organisateur</option>
					</select>
					<button type="submit">Créer un compte</button>
				</form>


				{error && (
					<div className="error-message">
						<h4>{error}</h4>
					</div>
				)}
			</div>
		</div>
	);
}

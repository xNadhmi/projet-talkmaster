import { useState } from "react";
import { useAuth } from "../store/AuthContext";

const SHOW_DEV_BUTTONS = true;

export default function LoginPage() {
	const { login, loginDev } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
	
		if (!email || !password) {
			setError("Merci de remplir tous les champs.");
			return;
		}
	
		try {
			await login(email, password);
		} catch (err) {
			setError(err.toString());
		}
	};
	

	return (
		<div className="login-page">
			<div className="login-card">
				<h1>Connexion</h1>
				<form onSubmit={handleSubmit}>
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
					<button type="submit">Se connecter</button>
				</form>

				{SHOW_DEV_BUTTONS && (
					<div className="dev-buttons">
						<p>⛭ Dev testing only:</p>
						<button onClick={() => loginDev("speaker")}>
							Login as Speaker
						</button>
						<button onClick={() => loginDev("organizer")}>
							Login as Organizer
						</button>
					</div>
				)}

				{error && (
					<div className="error-message">
						<h4>{error}</h4>
					</div>
				)}
			</div>
		</div>
	);
}

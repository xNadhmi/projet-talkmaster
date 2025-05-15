import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
	}, []);

	const login = async (email, password) => {
		const { token, user } = await loginRequest(email, password);
		localStorage.setItem("user", JSON.stringify(user));
		localStorage.setItem("token", token);
		setUser(user);
		navigate("/dashboard");
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
		localStorage.removeItem("token");
		navigate("/dashboard");
	};
	
	const loginDev = (role) => {
		const userData = {
			name: "Dev User",
			role,
			email: `${role}@example.com`
		};
		localStorage.setItem("user", JSON.stringify(userData));
		localStorage.setItem("token", "dev-token");
		setUser(userData);
		navigate("/dashboard");
	};
	

	return (
		<AuthContext.Provider value={{ user, login, loginDev, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}

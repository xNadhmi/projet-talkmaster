import { Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

export default function PrivateRoute({ children, roles = [] }) {
	const { user } = useAuth();

	if (!user) return <Navigate to="/login" />;
	if (roles.length > 0 && !roles.includes(user.role)) {
		return <Navigate to="/" />;
	}

	return children;
}

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PublicSchedulePage from "./pages/PublicSchedulePage";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<PublicSchedulePage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/dashboard" element={<DashboardPage />} />
			</Routes>
		</Router>
	);
}

export default App;

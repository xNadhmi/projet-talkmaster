import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./store/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TalksPage from "./pages/TalksPage";
import PrivateLayout from "./layouts/PrivateLayout";
import VantaBackground from "./components/VantaBackground";


function App() {
	return (
		<Router>
			<VantaBackground />

			<AuthProvider>
				<Routes>
					<Route path="/" element={<Navigate to="/dashboard" />} />
					<Route path="/login" element={<LoginPage />} />
					<Route
						path="/dashboard"
						element={
							<PrivateLayout>
								<DashboardPage />
							</PrivateLayout>
						}
					/>
					<Route
						path="/dashboard/talks"
						element={
							<PrivateRoute roles={["speaker"]}>
								<PrivateLayout>
									<TalksPage />
								</PrivateLayout>
							</PrivateRoute>
						}
					/>
				</Routes>
			</AuthProvider>
		</Router>
	);
}

export default App;

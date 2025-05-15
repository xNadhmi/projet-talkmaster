import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./store/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import TalksPage from "./pages/TalksPage";
import ManageTalksPage from "./pages/ManageTalksPage";
import PrivateLayout from "./layouts/PrivateLayout";
import VantaBackground from "./components/VantaBackground";


function App() {
	return (
		<Router>
			<VantaBackground />

			<AuthProvider>
				<Routes>
					<Route path="/" element={<Navigate to="/dashboard" />} />
					<Route path="/login" element={
							<PrivateLayout>
								<LoginPage />
							</PrivateLayout>
						}
					/>
					<Route path="/register" element={
							<PrivateLayout>
								<RegisterPage />
							</PrivateLayout>
						}
					/>
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
					<Route
						path="/dashboard/manage"
						element={
							<PrivateRoute roles={["organizer"]}>
								<PrivateLayout>
									<ManageTalksPage />
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

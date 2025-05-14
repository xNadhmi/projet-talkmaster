import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./store/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PublicSchedulePage from "./pages/DashboardPage";
import TalksPage from "./pages/TalksPage";
import PrivateLayout from "./layouts/PrivateLayout";


function App() {
	return (
		<Router>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<PublicSchedulePage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route
						path="/dashboard"
						element={
							<PrivateRoute>
								<PrivateLayout>
									<DashboardPage />
								</PrivateLayout>
							</PrivateRoute>
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

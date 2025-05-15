import axios from "axios";

const API_URL = "http://localhost:3000/api";

export async function loginRequest(email, password) {
	try {
		const response = await axios.post(`${API_URL}/login`, { email, password });
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "Erreur serveur.";
	}
}

export async function registerRequest(payload) {
	try {
		const response = await axios.post(`${API_URL}/register`, payload);
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "Erreur lors de l'inscription.";
	}
}

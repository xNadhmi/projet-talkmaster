import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function loginRequest(email, password) {
	try {
		const response = await axios.post(`${API_URL}/auth/login`, { email, password });
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "Erreur serveur.";
	}
}

export async function registerRequest(payload) {
	try {
		const response = await axios.post(`${API_URL}/auth/register`, payload);
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "Erreur lors de l'inscription.";
	}
}

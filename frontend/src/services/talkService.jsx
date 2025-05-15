import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function submitTalkRequest(talkData) {
	const token = localStorage.getItem("token");

	const response = await axios.post(`${API_URL}/talks`, talkData, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	return response.data;
}

export async function fetchAllTalks() {
	const response = await axios.get(`${API_URL}/talks`);
	return response.data;
}
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
	return Array.isArray(response.data) ? response.data : [];
}

export async function updateTalkStatus(id, status) {
	const token = localStorage.getItem("token");
	return await axios.patch(`${API_URL}/talks/${id}/status`, { status }, {
		headers: { Authorization: `Bearer ${token}` }
	});
}

export async function assignTalkSchedule(id, { room, date, time }) {
	const token = localStorage.getItem("token");
	return await axios.patch(`${API_URL}/talks/${id}/schedule`, { room, date, time }, {
		headers: { Authorization: `Bearer ${token}` }
	});
}

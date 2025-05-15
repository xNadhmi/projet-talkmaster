import axios from "axios";

const API_URL = "http://localhost:3000/api";

export async function submitTalkRequest(talkData) {
	const token = localStorage.getItem("token");

	const response = await axios.post(`${API_URL}/talks`, talkData, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	return response.data;
}
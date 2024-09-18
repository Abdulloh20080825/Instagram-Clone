import axios from 'axios';

export const axiosdata = axios.create({
	baseURL: 'http://localhost:4040/api/',
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

axiosdata.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) config.headers.Authorization = `Bearer ${token}`;

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

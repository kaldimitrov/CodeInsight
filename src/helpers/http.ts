import axios from 'axios';
import { environment } from '../configuration/environment';
import { token } from '$lib/userStore';

const http = axios.create({
	baseURL: environment.apiUrl
});

http.interceptors.request.use(
	(config) => {
		config.headers.Authorization = `Bearer ${token.value}`;

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default http;

import axios from 'axios';
import { environment } from '../configuration/environment';
import { refreshToken, token } from '$lib/stores/userStore';
import { isTokenValid } from './token.helper';
import { refreshUser } from './requests/auth.requests';

const http = axios.create({
	baseURL: environment.apiUrl
});

http.interceptors.request.use(
	async (config) => {
		if (
			!isTokenValid(token.value) &&
			isTokenValid(refreshToken.value) &&
			config.url != 'users/refresh' 
		) {
			await refreshUser({ refresh_token: refreshToken.value });
		}
		config.headers.Authorization = `Bearer ${token.value}`;

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default http;

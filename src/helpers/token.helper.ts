import { jwtDecode } from 'jwt-decode';

export function decodeToken(token: string) {
	return jwtDecode(token);
}

export function isTokenValid(token: string) {
	if (!token) {
		return false;
	}

	const decodedToken = decodeToken(token);
	if (!decodedToken) {
		return false;
	}

	const currentTime = Date.now() / 1000;

	return Number(decodedToken.exp) > currentTime;
}

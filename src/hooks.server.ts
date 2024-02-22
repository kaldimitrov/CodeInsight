import { refreshToken, token } from '$lib/stores/userStore';
import { refreshUser } from './helpers/requests/auth.requests';
import { isTokenValid } from './helpers/token.helper';

const protectedRoutes = ['/user', '/editor', '/history'];
export async function handle({ event, resolve }: { event: any; resolve: any }) {
	const url = event.request.url;

	if (!isTokenValid(token.value) && isTokenValid(refreshToken.value)) {
		await refreshUser({ refresh_token: refreshToken.value });
	}

	if (protectedRoutes.some((route) => url.includes(route)) && !isTokenValid(token.value)) {
		return new Response('Unauthorized', { status: 303, headers: { location: '/' } });
	}

	return resolve(event);
}

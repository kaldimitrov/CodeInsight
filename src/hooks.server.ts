import { token } from '$lib/stores/userStore';
import { isTokenValid } from './helpers/token.helper';

const protectedRoutes = ['/user'];
export async function handle({ event, resolve }: { event: any; resolve: any }) {
	const url = event.request.url;

	if (protectedRoutes.some((route) => url.includes(route)) && !isTokenValid(token.value)) {
		return new Response('Unauthorized', { status: 303, headers: { location: '/' } });
	}

	return resolve(event);
}

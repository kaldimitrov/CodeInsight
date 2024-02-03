import { token } from '$lib/stores/userStore';
import { isTokenValid } from './helpers/token.helper';
import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';
import en from './configuration/translations/en.json';

addMessages('en', en);
init({
	fallbackLocale: 'en',
	initialLocale: getLocaleFromNavigator()
});

const protectedRoutes = ['/user'];
export async function handle({ event, resolve }) {
	const url = event.request.url;

	if (protectedRoutes.some((route) => url.includes(route)) && !isTokenValid(token.value)) {
		return new Response('Unauthorized', { status: 303, headers: { location: '/' } });
	}

	return resolve(event);
}

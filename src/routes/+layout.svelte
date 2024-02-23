<script lang="ts">
	import { onMount } from 'svelte';
	import Notification from '$lib/components/notifications/Notification.svelte';
	import { theme } from '$lib/theme/themeStore';
	import { Themes } from '$lib/theme/enums/themes';
	import { refreshToken, setRefreshToken, setToken, token } from '$lib/stores/userStore';
	import '../app.css';
	import { addMessages, getLocaleFromNavigator, init } from 'svelte-i18n';
	import en from '../configuration/translations/en.json';
	import bg from '../configuration/translations/bg.json';
	import Cookies from 'js-cookie';

	let loaded = false;

	onMount(async () => {
		setToken(Cookies.get('token') as string);
		token.subscribe((newToken: string) => {
			Cookies.set('token', newToken);
		});

		setRefreshToken(Cookies.get('refreshToken') as string);
		refreshToken.subscribe((newRefreshToken: string) => {
			Cookies.set('refreshToken', newRefreshToken);
		});

		theme.value = (localStorage.getItem('theme') as Themes) || Themes.LIGHT;
		theme.subscribe((value: Themes) => {
			document.documentElement.setAttribute('data-theme', value);
			localStorage.setItem('theme', value);
		});

		addMessages('en', en);
		addMessages('bg', bg);
		init({
			fallbackLocale: 'en',
			initialLocale: getLocaleFromNavigator()
		});
		loaded = true;
	});
</script>

{#if loaded}
	<Notification />
	<slot />
{/if}

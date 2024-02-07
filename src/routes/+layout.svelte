<script lang="ts">
	import { onMount } from 'svelte';
	import Notification from '$lib/components/notifications/Notification.svelte';
	import { theme } from '$lib/theme/themeStore';
	import type { Themes } from '$lib/theme/enums/themes';
	import { connectSocket } from '../helpers/socket.helper';
	import { setToken, token } from '$lib/stores/userStore';
	import '../app.css';
	import { addMessages, getLocaleFromNavigator, init } from 'svelte-i18n';
	import en from '../configuration/translations/en.json';

	let loaded = false;

	onMount(async () => {
		setToken(localStorage.getItem('token') as string);
		token.subscribe((newToken: string) => {
			localStorage.setItem('token', newToken);
		});

		theme.subscribe((value: Themes) => {
			document.documentElement.setAttribute('data-theme', value);
		});

		addMessages('en', en);
		init({
			fallbackLocale: 'en',
			initialLocale: getLocaleFromNavigator()
		});
		loaded = true;
		connectSocket();
	});
</script>

<Notification />
{#if loaded}
	<slot />
{/if}

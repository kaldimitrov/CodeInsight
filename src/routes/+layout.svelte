<script lang="ts">
	import { onMount } from 'svelte';
	import { Notification } from '$lib/components/Notifications/notificationStore';
	import { theme } from '$lib/theme/themeStore';
	import type { Themes } from '$lib/theme/enums/themes';
	import '../app.css';

	onMount(() => {
		theme.subscribe((value: Themes) => {
			document.documentElement.setAttribute('data-theme', value);
		});
	});
</script>

<slot />

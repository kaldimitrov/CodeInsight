<script lang="ts">
	import { notifications, removeNotification } from '$lib/stores/notificationStore';
	import SuccessIcon from '../../../assets/icons/Success.svelte';
	import ErrorIcon from '../../../assets/icons/Error.svelte';
	import WarningIcon from '../../../assets/icons/Warning.svelte';
	import InfoIcon from '../../../assets/icons/Info.svelte';
	import { AlertLevels } from './enums/alertLevels';
	import { t } from 'svelte-i18n';
	import { onMount } from 'svelte';

	const timers = new Map();

	function getIconComponent(level: AlertLevels) {
		switch (level) {
			case AlertLevels.SUCCESS:
				return SuccessIcon;
			case AlertLevels.ERROR:
				return ErrorIcon;
			case AlertLevels.WARNING:
				return WarningIcon;
			case AlertLevels.INFO:
				return InfoIcon;
			default:
				return InfoIcon;
		}
	}

	onMount(() => {
		notifications.subscribe((value) => {
			for (const notification of value) {
				if (!timers.get(notification.id)) {
					const timer = setTimeout(() => {
						fadeOutNotification(notification.id);
						timers.delete(notification.id);
					}, 5000);

					timers.set(notification.id, timer);
				}
			}
		});
	});

	function fadeOutNotification(id: number) {
		const element = document.getElementById(`notification-${id}`);
		if (element) {
			element.style.opacity = '0';
		}
	}
</script>

<div class="toast toast-top toast-end z-50">
	{#each $notifications as notification (notification.id)}
		<button
			id={`notification-${notification.id}`}
			class={`alert alert-${notification.level} transition-opacity duration-1000`}
			on:transitionend={() => removeNotification(notification.id)}
			on:click={() => fadeOutNotification(notification.id)}
		>
			<svelte:component this={getIconComponent(notification.level)} />
			<span>{$t(notification.text)}</span>
		</button>
	{/each}
</div>

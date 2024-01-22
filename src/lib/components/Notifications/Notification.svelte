<script lang="ts">
	import { notifications } from './notificationStore';
	import Success from '../../../assets/icons/Success.svelte';
	import Error from '../../../assets/icons/Error.svelte';
	import Warning from '../../../assets/icons/Warning.svelte';
	import Info from '../../../assets/icons/Info.svelte';
	import { AlertLevels } from './enums/alertLevels';

	function getIconComponent(level: AlertLevels) {
		switch (level) {
			case AlertLevels.SUCCESS:
				return Success;
			case AlertLevels.ERROR:
				return Error;
			case AlertLevels.WARNING:
				return Warning;
			case AlertLevels.INFO:
				return Info;
			default:
				return Info;
		}
	}
</script>

<div class="toast toast-top toast-end z-50">
	{#each $notifications as notification (notification.id)}
		<div
			id={`notification-${notification.id}`}
			class={`alert alert-${notification.level} transition-opacity duration-1000`}
		>
			<svelte:component this={getIconComponent(notification.level)} />
			<span>{notification.text}</span>
		</div>
	{/each}
</div>

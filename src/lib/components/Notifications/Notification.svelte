<script lang="ts">
	import { notifications } from './notificationStore';
	import SuccessIcon from '../../../assets/icons/Success.svelte';
	import ErrorIcon from '../../../assets/icons/Error.svelte';
	import WarningIcon from '../../../assets/icons/Warning.svelte';
	import InfoIcon from '../../../assets/icons/Info.svelte';
	import { AlertLevels } from './enums/alertLevels';

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

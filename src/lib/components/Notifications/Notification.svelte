<script lang="ts">
	import { notifications } from './notificationStore';
	import Success from '../../../assets/icons/Success.svelte';
	import Error from '../../../assets/icons/Error.svelte';
	import Warning from '../../../assets/icons/Warning.svelte';
	import Info from '../../../assets/icons/Info.svelte';
	import { AlertLevels } from './enums/alertLevels';
</script>

<div class="toast toast-top toast-end z-50">
	{#each $notifications as notification (notification.id)}
		<div
			id={`notification-${notification.id}`}
			class={`alert alert-${notification.level} transition-opacity duration-1000`}
		>
			{#if notification.level == AlertLevels.SUCCESS}
				<Success />
			{:else if notification.level == AlertLevels.ERROR}
				<Error />
			{:else if notification.level == AlertLevels.WARNING}
				<Warning />
			{:else if notification.level == AlertLevels.INFO}
				<Info />
			{/if}

			<span>{notification.text}</span>
		</div>
	{/each}
</div>

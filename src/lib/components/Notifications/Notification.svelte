<script>
	import { notifications } from './notificationStore';
</script>

<div class="toast toast-top toast-end z-50">
	{#each $notifications as notification (notification.id)}
		<div
			id={`notification-${notification.id}`}
			class={`alert alert-${notification.level} transition-opacity duration-1000`}
		>
			<span>{notification.text}</span>
		</div>
	{/each}
</div>

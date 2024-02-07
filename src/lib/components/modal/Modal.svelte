<!-- Modal.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';

	export let title = 'Modal';
	export let inputValue = '';
	const dispatch = createEventDispatcher();

	function submit() {
		dispatch('submit', inputValue);
	}
</script>

<div class="modal modal-open">
	<div class="modal-box">
		<h3 class="font-bold text-lg">{title}</h3>
		<input type="text" bind:value={inputValue} class="input input-bordered w-full max-w-xs mt-4" />
		<div class="modal-action">
			<button class="btn" on:click={submit}>Submit</button>
		</div>
	</div>
</div>

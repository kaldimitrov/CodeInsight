<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let text: string = '';
	export let classList = '';
	export let maxlength: number = Infinity;
	let editing = false;
	let inputElement: HTMLInputElement;

	const dispatch = createEventDispatcher();

	function handleDoubleClick() {
		editing = true;
		onMount(() => {
			inputElement.focus();
		});
	}

	function saveChanges() {
		editing = false;
		dispatch('change', { newText: text });
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			saveChanges();
		}
	}

	function handleBlur() {
		saveChanges();
	}
</script>

{#if editing}
	<input
		bind:this={inputElement}
		class={`outline-none ${classList}`}
		type="text"
		maxlength={maxlength}
		bind:value={text}
		on:blur={handleBlur}
		on:keydown={handleKeyDown}
	/>
{:else}
	<span
		class={`cursor-pointer ${classList}`}
		role="button"
		tabindex="0"
		on:dblclick={handleDoubleClick}>{text}</span
	>
{/if}

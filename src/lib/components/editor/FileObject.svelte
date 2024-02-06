<script lang="ts">
	import FileIcon from '../../../assets/icons/File.svelte';
	import FolderIcon from '../../../assets/icons/Folder.svelte';
	import TrashIcon from '../../../assets/icons/Trash.svelte';
	import { currentFile, fileSystem, setCurrentFile, storeCurrentState } from '$lib/stores/editorStore';
	import { FileTypes } from './enums/fileTypes.js';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let file: any;

	let isHovering = false;
	let editingLabel = false;
	let newLabel = file.label;

	function handleDoubleClick() {
		editingLabel = true;
	}

	function handleBlur() {
		file.label = newLabel;
		editingLabel = false;
		storeCurrentState();
	}

	function handleKeyDown(event: any) {
		if (event.key === 'Enter') {
			handleBlur();
		}
	}
</script>

{#if file.type === FileTypes.FOLDER}
	<li>
		<details open>
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<summary on:mouseenter={() => (isHovering = true)} on:mouseleave={() => (isHovering = false)}  class="text-base flex flex-row justify-between items-center px-5" on:dblclick={handleDoubleClick}>
				<div class="flex flex-row items-center">
					<FolderIcon />
					{#if editingLabel}
						<!-- svelte-ignore a11y-autofocus -->
						<input
							class="outline-none"
							type="text"
							bind:value={newLabel}
							on:blur={handleBlur}
							on:keydown={handleKeyDown}
							autofocus
						/>
					{:else}
						<span class="ml-1">{file.label}</span>
					{/if}
				</div>
				{#if isHovering}
					<button class="flex-none grow-on-hover" on:click={() => dispatch('delete', file)}>
						<TrashIcon />
					</button>
				{/if}
			</summary>
			<ul>
				{#each file.children as child}
					<svelte:self on:delete file={child} />
				{/each}
			</ul>
		</details>
	</li>
{:else if file.type === FileTypes.FILE}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<li on:mouseenter={() => (isHovering = true)} on:mouseleave={() => (isHovering = false)}>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<summary
			class={`text-base flex flex-row justify-between items-center px-5 ${
				file.uuid == $currentFile ? 'text-primary' : ''
			}`}
			on:dblclick={handleDoubleClick}
			on:click={() => setCurrentFile(file.uuid)}
		>
			<div class="flex-grow flex items-center">
				<FileIcon />
				{#if editingLabel}
					<!-- svelte-ignore a11y-autofocus -->
					<input
						class="outline-none flex-grow"
						type="text"
						bind:value={newLabel}
						on:blur={handleBlur}
						on:keydown={handleKeyDown}
						autofocus
					/>
				{:else}
					<span class="ml-1">{file.label}</span>
				{/if}
			</div>
			{#if isHovering}
				<button class="flex-none grow-on-hover" on:click={() => dispatch('delete', file)}>
					<TrashIcon />
				</button>
			{/if}
		</summary>
	</li>
{/if}

<style>
	summary::after {
		position: absolute;
		left: 0;
	}

	.grow-on-hover {
		transition: transform 0.2s ease;
	}

	.grow-on-hover:hover {
		transform: scale(1.25);
	}
</style>

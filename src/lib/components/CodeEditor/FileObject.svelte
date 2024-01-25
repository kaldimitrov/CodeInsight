<script lang="ts">
	import FileIcon from '../../../assets/icons/File.svelte';
	import FolderIcon from '../../../assets/icons/Folder.svelte';
	import { currentFile, setCurrentFile, storeCurrentState } from './editorStore.js';
	import { FileTypes } from './enums/fileTypes.js';

	export let file: any;

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
			<summary class="text-base flex flex-row" on:dblclick={handleDoubleClick}>
				<FolderIcon />
				{#if editingLabel}
					<input
						class="outline-none"
						type="text"
						bind:value={newLabel}
						on:blur={handleBlur}
						on:keydown={handleKeyDown}
						autofocus
					/>
				{:else}
					{file.label}
				{/if}
			</summary>
			<ul>
				{#each file.children as child}
					<svelte:self file={child} />
				{/each}
			</ul>
		</details>
	</li>
{:else if file.type === FileTypes.FILE}
	<li>
		<summary
			class={`text-base flex flex-row ${file.uuid == $currentFile ? 'text-primary' : ''}`}
			on:dblclick={handleDoubleClick}
			on:click={() => setCurrentFile(file.uuid)}
		>
			<FileIcon />
			{#if editingLabel}
				<input
					class="outline-none"
					type="text"
					bind:value={newLabel}
					on:blur={handleBlur}
					on:keydown={handleKeyDown}
					autofocus
				/>
			{:else}
				{file.label}
			{/if}
		</summary>
	</li>
{/if}

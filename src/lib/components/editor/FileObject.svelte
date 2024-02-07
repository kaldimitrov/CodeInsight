<script lang="ts">
	import FileIcon from '../../../assets/icons/File.svelte';
	import FolderIcon from '../../../assets/icons/Folder.svelte';
	import TrashIcon from '../../../assets/icons/Trash.svelte';
	import {
		currentFile,
		fileSystem,
		setCurrentFile,
		storeCurrentState
	} from '$lib/stores/editorStore';
	import { FileTypes } from './enums/fileTypes.js';
	import { createEventDispatcher } from 'svelte';
	import FolderCreate from '../../../assets/icons/FolderCreate.svelte';
	import FileCreate from '../../../assets/icons/FileCreate.svelte';
	import Modal from '../modal/Modal.svelte';
	const dispatch = createEventDispatcher();

	export let file: any;
	export let path: string;

	let isHovering = false;
	let editingLabel = false;
	let newLabel = file.label;
	const modal = {
		title: '',
		input: '',
		show: false,
		type: FileTypes.FILE
	};

	function openModal(fileType: FileTypes) {
		modal.type = fileType;
		modal.title = `Create New ${fileType === FileTypes.FOLDER ? 'Folder' : 'File'}`;
		modal.input = path;
		modal.show = true;
	}

	function handleModalSubmit(event: CustomEvent<any>) {
		const inputValue = event.detail;
		dispatch('create', {
			type: modal.type,
			name: inputValue
		});
		modal.show = false;
	}

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

{#if modal.show}
	<Modal title={modal.title} inputValue={modal.input} on:submit={handleModalSubmit} />
{/if}

{#if file.type === FileTypes.FOLDER}
	<li>
		<details open>
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<summary
				on:mouseenter={() => (isHovering = true)}
				on:mouseleave={() => (isHovering = false)}
				class="text-base flex flex-row justify-between items-center px-5"
				on:dblclick={handleDoubleClick}
			>
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
					<div class="flex gap-x-2">
						<button class="icon" on:click={() => openModal(FileTypes.FOLDER)}>
							<FolderCreate />
						</button>
						<button class="icon" on:click={() => openModal(FileTypes.FILE)}>
							<FileCreate />
						</button>
						<button class="icon" on:click={() => dispatch('delete', file)}>
							<TrashIcon />
						</button>
					</div>
				{/if}
			</summary>
			<ul>
				{#each file.children as child}
					<svelte:self on:delete on:create file={child} path={`${path}/${child.label}`} />
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
</style>

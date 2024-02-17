<script lang="ts">
	import FileIcon from '../../../assets/icons/File.svelte';
	import FolderIcon from '../../../assets/icons/Folder.svelte';
	import TrashIcon from '../../../assets/icons/Trash.svelte';
	import { currentFile, setCurrentFile, storeCurrentState } from '$lib/stores/editorStore';
	import { FileTypes } from './enums/fileTypes';
	import { createEventDispatcher } from 'svelte';
	import FolderCreate from '../../../assets/icons/FolderCreate.svelte';
	import FileCreate from '../../../assets/icons/FileCreate.svelte';
	import Modal from '../modal/Modal.svelte';
	import EditableText from '../editableText/EditableText.svelte';
	const dispatch = createEventDispatcher();

	export let file: any;
	export let path: string;

	let isHovering = false;
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

	function handleTextChange(event: CustomEvent<any>) {
		file.label = event.detail.newText;
		storeCurrentState();
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
			>
				<div class="flex flex-row items-center">
					<FolderIcon />
					<EditableText classList="ml-1" text={file.label} on:change={handleTextChange} />
				</div>
				{#if isHovering}
					<div class="flex gap-x-2">
						<button class="icon" on:click={() => openModal(FileTypes.FOLDER)}>
							<FolderCreate />
						</button>
						<button class="icon" on:click={() => openModal(FileTypes.FILE)}>
							<FileCreate />
						</button>
						{#if !file.readonly}
							<button class="icon" on:click={() => dispatch('delete', file)}>
								<TrashIcon />
							</button>
						{/if}
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
			on:click={() => setCurrentFile(file.uuid)}
		>
			<div class="flex-grow flex items-center">
				<FileIcon />
				<EditableText classList="ml-1" text={file.label} on:change={handleTextChange} />
			</div>
			{#if isHovering && !file.readonly}
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

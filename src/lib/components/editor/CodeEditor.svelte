<script lang="ts">
	import { onMount } from 'svelte';
	import FileObject from './FileObject.svelte';
	import {
		currentFile,
		fileSystem,
		setCurrentFile,
		setFileSystem,
		storeCurrentState
	} from '$lib/stores/editorStore';
	import { v4 as uuidv4 } from 'uuid';
	import { FileTypes } from './enums/fileTypes';
	import type { FileModel } from '$lib/models/file.model';
	import { pushNotification } from '$lib/stores/notificationStore';
	import { AlertLevels } from '../notifications/enums/alertLevels';
	import FolderCreate from '../../../assets/icons/FolderCreate.svelte';
	import FileCreate from '../../../assets/icons/FileCreate.svelte';
	import EditableText from '../editableText/EditableText.svelte';
	import Modal from '../modal/Modal.svelte';
	import type { FileDto } from '../../../helpers/requests/dto/code.dto';
	import { t } from 'svelte-i18n';
	import { mapFilesToDto } from '../../../helpers/entity.helper';

	let fileMap: any;
	let projectName: string = 'Project Name';
	const modal = {
		title: '',
		input: '',
		show: false,
		type: FileTypes.FILE
	};

	onMount(() => {
		setFileSystem(JSON.parse(localStorage.getItem('fileSystem') || '[]'));
		fileMap = buildPathMap($fileSystem);
	});

	function buildPathMap(items: FileModel[], map: any = {}) {
		items.forEach((item: any) => {
			if (item.uuid) {
				map[item.uuid as string] = item;
			}
			if (item.children && Array.isArray(item.children)) {
				buildPathMap(item.children, map);
			}
		});
		return map;
	}

	function handleCreate(event: CustomEvent<any>) {
		createPath(event.detail.name, event.detail.type);
		setFileSystem($fileSystem);
		storeCurrentState();
		fileMap = buildPathMap($fileSystem);
	}

	function handleDeleteEvent(event: CustomEvent<any>) {
		setCurrentFile('');
		deleteItemByUuid($fileSystem, event.detail.uuid);
		setFileSystem($fileSystem);
		storeCurrentState();
		fileMap = buildPathMap($fileSystem);
	}

	function deleteItemByUuid(items: any, uuidToDelete: string) {
		const index = items.findIndex((item: any) => item.uuid === uuidToDelete);

		if (index !== -1) {
			items.splice(index, 1);
			return;
		}

		for (const item of items) {
			if (item.type == FileTypes.FOLDER && item.children) {
				deleteItemByUuid(item.children, uuidToDelete);
			}
		}
	}

	function createPath(path: string, type: FileTypes) {
		const parts = path.split('/').filter(Boolean);
		let currentLevel: FileModel[] = $fileSystem;

		parts.forEach((part, index) => {
			let found = currentLevel.find((item) => item.label === part);

			if (!found) {
				const isFolder = index < parts.length - 1 || type === FileTypes.FOLDER;
				const newItem: FileModel = {
					uuid: uuidv4(),
					label: part,
					type: isFolder ? FileTypes.FOLDER : FileTypes.FILE,
					...(isFolder && { children: [] })
				};

				currentLevel.push(newItem);

				if (isFolder) {
					currentLevel = newItem.children!;
				}
			} else if (found.type === FileTypes.FOLDER) {
				currentLevel = found.children!;
			} else {
				pushNotification('errors.invalid_file_path', AlertLevels.ERROR);
			}
		});
	}

	function openModal(fileType: FileTypes) {
		modal.type = fileType;
		modal.title = `Create New ${fileType === FileTypes.FOLDER ? 'Folder' : 'File'}`;
		modal.input = '';
		modal.show = true;
	}

	function handleModalSubmit(event: CustomEvent<any>) {
		const inputValue = event.detail;
		createPath(inputValue, modal.type);
		modal.show = false;

		setFileSystem($fileSystem);
		storeCurrentState();
		fileMap = buildPathMap($fileSystem);
	}

	function handleTextChange(event: CustomEvent<any>) {
		projectName = event.detail.newText;
	}

	function handleCodeSubmit() {
		const fileDtos: FileDto[] = mapFilesToDto($fileSystem);
		console.log(fileDtos);
	}
</script>

{#if modal.show}
	<Modal title={modal.title} inputValue={modal.input} on:submit={handleModalSubmit} />
{/if}

<div class="flex border rounded-lg overflow-hidden container min-h-96 min-w-full">
	{#key fileMap}
		<ul class="menu menu-xs bg-base-200 rounded-lg flex-none w-full max-w-xs">
			<header class="h-8 flex justify-between">
				<EditableText
					classList="ml-1 text-lg"
					text={projectName}
					maxlength={20}
					on:change={handleTextChange}
				/>
				<div class="flex gap-x-2">
					<button class="icon" on:click={() => openModal(FileTypes.FOLDER)}>
						<FolderCreate classList="w-6 h-6" />
					</button>
					<button class="icon" on:click={() => openModal(FileTypes.FILE)}>
						<FileCreate classList="w-6 h-6" />
					</button>
				</div>
			</header>
			{#each $fileSystem as file}
				<FileObject
					on:delete={handleDeleteEvent}
					on:create={handleCreate}
					{file}
					path={file.label}
				/>
			{/each}
		</ul>
	{/key}
	{#if $currentFile && fileMap[$currentFile]}
		<textarea
			class="textarea flex-1 resize-none"
			bind:value={fileMap[$currentFile].content}
			on:input={() => storeCurrentState()}
		/>
	{/if}
</div>
<button class="btn btn-md btn-primary" on:click={handleCodeSubmit}>{$t('editor.submit')}</button>

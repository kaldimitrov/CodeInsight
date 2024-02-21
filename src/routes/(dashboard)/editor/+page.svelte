<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import FileObject from '$lib/components/fileObject/FileObject.svelte';
	import {
		currentFile,
		fileSystem,
		setCurrentFile,
		setFileSystem,
		storeCurrentState
	} from '$lib/stores/editorStore';
	import { v4 as uuidv4 } from 'uuid';
	import { FileTypes } from '../../../lib/components/fileObject/enums/fileTypes';
	import type { FileModel } from '$lib/models/file.model';
	import { pushNotification } from '$lib/stores/notificationStore';
	import { AlertLevels } from '$lib/components/notifications/enums/alertLevels';
	import FolderCreate from '../../../assets/icons/FolderCreate.svelte';
	import FileCreate from '../../../assets/icons/FileCreate.svelte';
	import EditableText from '$lib/components/editableText/EditableText.svelte';
	import Modal from '$lib/components/modal/Modal.svelte';
	import type { FileDto } from '../../../helpers/requests/dto/code.dto';
	import { t } from 'svelte-i18n';
	import { mapFilesToDto } from '../../../helpers/entity.helper';
	import { getLanguages, submitCode } from '../../../helpers/requests/code.requests';
	import { addSocketListener } from '../../../helpers/socket.helper';
	import { goto } from '$app/navigation';
	import { MAX_FILE_DEPTH } from '$lib/constants';

	let fileMap: any;
	let projectName: string = 'Project Name';
	const modal = {
		title: '',
		input: '',
		show: false,
		type: FileTypes.FILE
	};
	let languages: any[] = [];
	let currentLanguage: any;
	let tabSize = 4;
	let logs = '';
	let buffer = '';

	onMount(async () => {
		const res = await getLanguages();
		languages = res?.data.languages;
		let savedLang = JSON.parse(localStorage.getItem('codingLanguage') || 'null');
		currentLanguage = languages.find((lang) => lang.key === savedLang?.key) || languages[0];

		setFileSystem(JSON.parse(localStorage.getItem('fileSystem') || '[]'));
		fileMap = buildPathMap($fileSystem);
		setCurrentFile(fileSystem.value[0]?.uuid);

		addSocketListener('newLog', (data) => {
			buffer += data.log;
		});
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

	function deleteItemByUuid(items: FileModel[], uuidToDelete: string) {
		const index = items.findIndex((item: FileModel) => item.uuid === uuidToDelete);

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
		if (parts.length >= MAX_FILE_DEPTH) {
			pushNotification('errors.max_file_depth', AlertLevels.ERROR);
			return;
		}
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

	async function handleCodeSubmit() {
		const fileDtos: FileDto[] = mapFilesToDto($fileSystem);
		const interval = setInterval(() => {
			logs = buffer;
		}, 2500);
		const res = await submitCode({
			name: projectName,
			files: fileDtos,
			language: currentLanguage.key
		});
		clearInterval(interval);
		const statusCode = res?.status || 0;
		if (statusCode >= 200 && statusCode < 300) {
			pushNotification('editor.successful_execution', AlertLevels.INFO);
		}
		goto(`/history/${res?.data.id}`);
	}

	function updateLanguage() {
		localStorage.setItem('codingLanguage', JSON.stringify(currentLanguage));
		setFileSystem([]);
		createPath(currentLanguage.fileName, FileTypes.FILE);
		fileSystem.value[0].readonly = true;
		fileMap = buildPathMap($fileSystem);
		setCurrentFile($fileSystem[0].uuid);
		storeCurrentState();
	}

	function handleTab(event: any) {
		if (event.key != 'Tab') return;

		event.preventDefault();

		const textarea = event.target;
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const spaces = ' '.repeat(tabSize);

		fileMap[$currentFile].content =
			fileMap[$currentFile].content.substring(0, start) +
			spaces +
			fileMap[$currentFile].content.substring(end);

		setTimeout(() => {
			textarea.selectionStart = textarea.selectionEnd = start + tabSize;
		}, 0);
		storeCurrentState();
	}
</script>

{#if modal.show}
	<Modal title={modal.title} inputValue={modal.input} on:submit={handleModalSubmit} />
{/if}

<div class="card bg-base-100 m-4 shadow-xl">
	<div class="collapse collapse-arrow">
		<input type="checkbox" checked />
		<div class="collapse-title text-2xl font-bold flex items-center justify-center">
			<strong>
				{$t('editor.title')}
			</strong>
		</div>
		<div class="collapse-content pt-0 max-w-full overflow-x-auto">
			<div
				class="flex border rounded-lg overflow-hidden container min-h-[40rem] min-w-full overflow-x-auto shadow-md"
			>
				{#key fileMap}
					<ul
						class="menu menu-xs bg-base-300 rounded-lg rounded-r-none flex-none w-full max-w-xs border-r"
					>
						<header class="h-8 flex justify-between items-center mb-4">
							<EditableText
								classList="ml-1 text-lg font-bold"
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
				<div class="flex flex-col w-full rounded-tr-lg">
					<div class="flex justify-end items-center bg-base-300 border-b pr-2 py-1 rounded-tr-lg">
						<select
							bind:value={currentLanguage}
							on:change={updateLanguage}
							class="select select-bordered"
						>
							{#each languages as lang}
								<option value={lang}>{lang.name}</option>
							{/each}
						</select>
					</div>

					{#if $currentFile && fileMap && fileMap[$currentFile]}
						<textarea
							class="textarea flex-1 resize-none border shadow-inner bg-base-200 rounded-l-none rounded-tr-none"
							bind:value={fileMap[$currentFile].content}
							on:input={() => storeCurrentState()}
							on:keydown={handleTab}
						/>
					{/if}
				</div>
			</div>
			<div class="flex justify-end gap-4">
				<button class="btn btn-md btn-error mt-4" on:click={updateLanguage}
					>{$t('editor.reset')}</button
				>
				<button class="btn btn-md btn-success mt-4" on:click={handleCodeSubmit}
					>{$t('editor.submit')}</button
				>
			</div>
		</div>
	</div>
</div>
{#if logs}
	<div class="card bg-base-100 m-4 shadow-xl">
		<div class="collapse collapse-arrow">
			<input type="checkbox" checked />
			<div class="collapse-title text-2xl font-medium flex items-center justify-center">
				<strong>
					{$t('details.logs_title')}
				</strong>
			</div>
			<div class="collapse-content pt-0">
				<textarea
					class="textarea flex-1 min-w-full shadow-inner rounded-md bg-base-300 h-64"
					bind:value={logs}
					readonly
				/>
			</div>
		</div>
	</div>
{/if}

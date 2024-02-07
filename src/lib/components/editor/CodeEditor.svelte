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

	let fileMap: any;

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
</script>

{#key fileMap}
	<div class="flex border rounded-lg overflow-hidden container min-h-96">
		<ul class="menu menu-xs bg-base-200 rounded-lg flex-none w-full max-w-xs">
			{#each $fileSystem as file}
				<FileObject on:delete={handleDeleteEvent} {file} />
			{/each}
		</ul>
		{#if $currentFile && fileMap[$currentFile]}
			<textarea
				class="textarea flex-1 resize-none"
				bind:value={fileMap[$currentFile].content}
				on:input={() => storeCurrentState()}
			/>
		{/if}
	</div>
{/key}

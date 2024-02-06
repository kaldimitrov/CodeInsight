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
	import { FileModel } from '$lib/models/file.model';

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
		const parts = path.split('/').filter(p => p);
		let currentLevel = $fileSystem;

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			let found = currentLevel.find((item: FileModel) => item.label === part);

			if (!found) {
				if (i < parts.length - 1 || type === FileTypes.FOLDER) {
					const newFolder: FileModel = {
						uuid: crypto.randomUUID(),
						label: part,
						type: FileTypes.FOLDER,
						children: [],
					};
					currentLevel.push(newFolder);
					currentLevel = newFolder.children!;
				} else {
					const newFile: FileModel = {
						uuid: crypto.randomUUID(),
						label: part,
						type: FileTypes.FILE,
						content: '',
					};
					currentLevel.push(newFile);
				}
			} else {
				if (found.type === FileTypes.FOLDER) {
					currentLevel = found.children!;
				} else {
					throw new Error('Path leads to a file before the end of the provided path.');
				}
			}
		}
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
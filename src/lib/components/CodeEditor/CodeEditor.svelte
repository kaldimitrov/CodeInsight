<script lang="ts">
	import { onMount } from 'svelte';
	import FileObject from './FileObject.svelte';
	import { currentFile, fileSystem, setFileSystem, storeCurrentState } from './editorStore';
	import { v4 as uuidv4 } from 'uuid';
	import { FileTypes } from './enums/fileTypes';

	let fileMap: any;

	onMount(() => {
		setFileSystem(JSON.parse(localStorage.getItem('fileSystem') || '[]'));
		fileMap = buildPathMap($fileSystem);
	});

	function buildPathMap(items: any, map: any = {}) {
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
</script>

<div class="flex border rounded-lg overflow-hidden container min-h-96">
	<ul class="menu menu-xs bg-base-200 rounded-lg flex-none w-full max-w-xs">
		{#each $fileSystem as file}
			<FileObject {file} />
		{/each}
	</ul>
	{#if $currentFile}
		<textarea
			class="textarea flex-1 resize-none"
			bind:value={fileMap[$currentFile].content}
			on:input={() => storeCurrentState()}
		/>
	{/if}
</div>

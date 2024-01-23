<script lang='ts'>
	import { onMount } from 'svelte';
	import FileObject from './FileObject.svelte';
	import { currentFile } from './editorStore';
	import { FileTypes } from './enums/fileTypes';
	import { v4 as uuidv4 } from 'uuid';

	onMount(() => {
		itemMap = buildPathMap(menuItems);
	})

	let itemMap: any;
	let menuItems = [
				{
					uuid: uuidv4(),
					label: 'index.js',
					type: FileTypes.FILE,
					content: 'console.log("test");\nconsole.log("test");\nconsole.log("test");'
				},
				{
					label: 'folder',
					type: FileTypes.FOLDER,
					children: [
						{
							uuid: uuidv4(),
							label: 'sub.js',
							type: FileTypes.FILE,
							content: 'Content for Chapter 2.'
						},
						{
							uuid: uuidv4(),
							label: 'sub.js',
							type: FileTypes.FILE,
							content: 'Content for Chapter 2.'
						},
						{
							label: 'subfolder',
							type: FileTypes.FOLDER,
							children: [
								{
									uuid: uuidv4(),
									label: 'sub.js',
									type: FileTypes.FILE,
									content: 'Content for Chapter 2.'
								},
								{
									uuid: uuidv4(),
									label: 'sub.js',
									type: FileTypes.FILE,
									content: 'Content for Chapter 2.'
								},
								{
									uuid: uuidv4(),
									label: 'subjs',
									type: FileTypes.FILE,
									content: 'Content for Chapter 2.'
								}
							]
						}
					]
				},
	];

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
	  {#each menuItems as item}
		<FileObject {item} />
	  {/each}
	</ul>
	{#if $currentFile}
		<textarea class="textarea flex-1 resize-none" bind:value={itemMap[$currentFile].content}/>
	{/if}
</div>
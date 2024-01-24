<script lang='ts'>
	import { onMount } from 'svelte';
	import FileObject from './FileObject.svelte';
	import { currentFile } from './editorStore';

	let itemMap: any;
	let menuItems: any = [];

	onMount(() => {
		menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
		itemMap = buildPathMap(menuItems);
	})

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

	function storeCurrentState() {
		localStorage.setItem('menuItems', JSON.stringify(menuItems));
	}
</script>

<div class="flex border rounded-lg overflow-hidden container min-h-96">
	<ul class="menu menu-xs bg-base-200 rounded-lg flex-none w-full max-w-xs">
	  {#each menuItems as item}
		<FileObject {item} />
	  {/each}
	</ul>
	{#if $currentFile}
		<textarea 
			class="textarea flex-1 resize-none" 
			bind:value={itemMap[$currentFile].content}
			on:input={() => storeCurrentState()}
		/>
	{/if}
</div>
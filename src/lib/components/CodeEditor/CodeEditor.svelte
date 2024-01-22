<script>
	import FileObject from './FileObject.svelte';
	import { currentCode } from './editorStore';
	import { FileTypes } from './enums/fileTypes';

	let menuItems = [
				{
					label: 'index.js',
					type: FileTypes.FILE,
					content: 'This is the content of Chapter 1.'
				},
				{
					label: 'folder',
					type: FileTypes.FOLDER,
					children: [
						{
							label: 'sub.js',
							type: FileTypes.FILE,
							content: 'Content for Chapter 2.'
						},
						{
							label: 'sub.js',
							type: FileTypes.FILE,
							content: 'Content for Chapter 2.'
						},
						{
							label: 'subfolder',
							type: FileTypes.FOLDER,
							children: [
								{
									label: 'sub.js',
									type: FileTypes.FILE,
									content: 'Content for Chapter 2.'
								},
								{
									label: 'sub.js',
									type: FileTypes.FILE,
									content: 'Content for Chapter 2.'
								},
								{
									label: 'subjs',
									type: FileTypes.FILE,
									content: 'Content for Chapter 2.'
								}
							]
						}
					]
				}
	];
</script>

<div class="flex border rounded-lg overflow-hidden container min-h-96">
	<ul class="menu menu-xs bg-base-200 rounded-lg flex-none w-full max-w-xs">
	  {#each menuItems as item}
		<FileObject {item} />
	  {/each}
	</ul>
	<textarea class="textarea flex-1 resize-none" value={$currentCode} />
</div>
<script>
    import FileObject from './FileObject.svelte';
    import { FileTypes } from './enums/fileTypes';

    let menuItems = [
      {
        label: 'Root',
        type: FileTypes.FOLDER,
        children: [
          {
            label: 'Chapter 1',
            type: FileTypes.FILE,
            content: 'This is the content of Chapter 1.',
          },
          {
            label: 'Subfolder',
            type: FileTypes.FOLDER,
            children: [
              {
                label: 'Chapter 2',
                type: FileTypes.FILE,
                content: 'Content for Chapter 2.',
              },
            ],
          },
        ],
      },
    ];
  </script>
  
  <ul class="menu menu-xs bg-base-200 rounded-lg max-w-xs w-full">
    {#each menuItems as item}
      <FileObject {item} />
    {/each}
  </ul>
  
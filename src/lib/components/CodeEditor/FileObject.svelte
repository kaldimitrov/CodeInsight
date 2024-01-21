<script lang='ts'>
    import { FileTypes } from "./enums/fileTypes.js";
    export let item: any;
    
    function handleClick(item: any) {
    if (item.type === FileTypes.FILE) {
      console.log(item.content);
    }
  }
  </script>
  
  {#if item.type === FileTypes.FOLDER}
  <li>
    <details open>
      <summary class='text-base'>
        {item.label}
      </summary>
      <ul>
        {#each item.children as child}
          <svelte:self item={child} />
        {/each}
      </ul>
    </details>
  </li>
{:else if item.type === FileTypes.FILE}
  <li on:click={() => handleClick(item)}>
    {item.label}
  </li>
{/if}
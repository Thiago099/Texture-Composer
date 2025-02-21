<script>
    import { ContextMenuManager } from "../modules/contextMenuManager.svelte";
  import { Folder } from "../modules/folder.svelte";

    const contextMenuManager = ContextMenuManager.GetSingleton()

</script>

<div class="context-menu" bind:this={contextMenuManager.element}>
    <ul>
      {#each contextMenuManager.options as option (option)}
        {#if option instanceof Folder}
          <li class="separator">{option.name}</li>
          {:else}
          <li class="option" onclick={contextMenuManager.PickEvent(option)}>{option}</li>
        {/if}
      {/each}
    </ul>
  </div>
<style>

.context-menu {
  position: absolute;
  background-color: var(--secondary-color);
  left: 0;
  top:0;
  border-radius: 4px;
  display: none;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10000;
  width: 300px;
}

.context-menu ul {
  margin: 0;
  padding: 0;
  list-style: none;
  width: 100%;
}

.context-menu ul li.option {
  padding: 10px 20px;
  cursor: pointer;
}

.context-menu ul li.option:hover {
  background-color: var(--overlay-color);
}

.separator{
    list-style: none;
    text-align: center;
    margin: 5px 0;
    padding: 5px;
    box-shadow: inset 0px 0px 16px rgba(0, 0, 0, 0.3);
}
  </style>
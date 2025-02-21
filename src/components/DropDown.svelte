<script>
import { onMount } from "svelte";
  import { Folder } from "../modules/folder.svelte";

let { children, options } = $props()

let button;
let isOpen = $state(false)
onMount(()=>{
  document.addEventListener("click",e=>{
        if (!button?.contains(e.target)) {
          isOpen = false
        } 
      })
})
</script>

<div class="dropdown">
    <button bind:this={button} onclick={()=> isOpen = true} class="dropdown-button">
      {@render children?.()}
    </button>
    <div class="dropdown-content {isOpen ? "open" : ""}">
      {#each options as option (option)}
        {#if option instanceof Folder}
          <div class="separator">{option.name}</div>
        {:else}
        <div class="link" onclick={()=>option.action()}><i class={option.icon}></i> {option.name}</div>
        {/if}
      {/each}
    </div>
</div>


<style>
.dropdown {
    position: relative;
    display: inline-flex;
    justify-content: center;
}

.dropdown-button {
    background-color: var(--background-color); /* Green */
    color: var(--text-color);
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    margin-right: 10px;
}

.dropdown-button:hover {
    background-color: var(--ternary-color);
}

.dropdown-content {
    display: none;
    position: fixed;
    background-color: var(--background-color);
    min-width: 300px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    border-radius: 4px;
    overflow: hidden;
    top:50px;
    box-shadow: 10px 8px 16px rgba(0, 0, 0, 0.2); 
 
}
.dropdown-content.open{
  display: block;
}


.link{
  cursor: pointer;
  padding: 10px;
}

.link:hover {
    background-color: var(--overlay-color);
}
.separator{
  text-align: center;
  margin:5px 0;
  padding: 5px;
  box-shadow:inset  0px 0px 16px rgba(0, 0, 0, 0.3); 
}
</style>

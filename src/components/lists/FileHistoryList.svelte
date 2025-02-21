<script>
  import { ListData, ListIO, ListRendering } from "../../modules/listManager.svelte.js";
  import {ImageFile, Composition, Manager} from "../../modules/manager.svelte.js"
  import List from "../List.svelte";
  const manager = Manager.GetSingleton()
  const io = new ListIO()

</script>

{#snippet renderFunction(item, index)}
<div class="row">
    <div class="center flex1">
      {#if item.thumbnail}
        <img class="thumb h-margin"  src={item.thumbnail} alt="thumb"/>
      {:else}
        <i class="fa-solid fa-layer-group h-margin"  style="font-size: 1.5em;"></i>
      {/if}
    {item.name}
    </div>
</div>
{/snippet}

{#snippet optionsRenderFunction(item, index)}
<!-- svelte-ignore a11y_consider_explicit_label -->
<button 
class="button"
style="margin-left: 10px;"
onclick={e=>io.removeLayer(index)}>
<i class="fa-solid fa-times icon"></i>
</button>
{/snippet}
{#key manager.selectedFileHistory}
  <List 
    list={ new ListData(manager, "selectedFileHistory", "selectedFileHistoryItem" , "file-history", "tab-list", false)}
    io={io}
    rendering={new ListRendering(renderFunction, optionsRenderFunction)}
  />
{/key}


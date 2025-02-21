<script>
  import {ImageFile, Composition, Layer, Manager} from "../../modules/manager.svelte.js"

  const manager = Manager.GetSingleton()

  import List from "../List.svelte";
  import { ListData, ListIO, ListRendering } from "../../modules/listManager.svelte.js";
  const io = new ListIO()

  import {ConfirmModalManager} from "../../modules/confirmModalManager.svelte.js"
  import { rgbToHex } from "../../lib/color.js";
  import { RenderManager } from "../../modules/renderManager.svelte.js";
  import Button from "../inputs/Button.svelte";
  const confirmModalManager = ConfirmModalManager.GetSingleton()

  function allowDrop(data){
    return data.menuSource == "file";
  }
  function drop(index, data){
    if(data.menuSource == "file"){
      if(data.item.Contains(manager.selectedFile)){
        return;
      }
      manager.selectedFile.AddLayer(index, data.item)
      manager.updateScreen()
      manager.pushHistory("add layer")
    }
  }

  function reorderEvent(index){
    manager.updateScreen()
  }

  function removeLayer(index){
    confirmModalManager.Prompt("Are you sure you want to delete this layer?", ()=>{
      const file = manager.selectedFile

      const wasSelected = file.getSelectedLayerIndex() == index

      io.removeLayer(index);


      if(wasSelected){
        if(file.layers.length == 0){
          file.selectedLayer = null
        }
        else{
          file.selectedLayer = file.layers[0]
        }
      }

      manager.updateScreen()
      manager.pushHistory("remove layer")
    })
  }


  io.allowDropEvent = allowDrop
  io.dropEvent = drop
  io.reorderEvent = reorderEvent
  io.selectEvent = index => {

  }

const renderManager = RenderManager.GetSingleton()

</script>

<div class="column flex-1">
  {#key renderManager.outputs}
  <div class="flex-1 column">
        {#snippet renderFunction(item, index)}
        <div class="row">

            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="center flex1">
              <!-- svelte-ignore a11y_click_events_have_key_events -->
              {#if item.thumbnail}
                <img class="thumb h-margin" src={item.thumbnail} alt="thumb"/>
              {:else}
                <i class="fa-solid fa-layer-group h-margin" style="font-size: 3em;"></i>
              {/if}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
            {item.name}
            {#if item.maskGroup}
            <div class="color-option" style="background-color: #{rgbToHex(...item.maskGroup)};"></div>
            {/if} 
            {#if item.file instanceof Composition}
              {#if item.name != item.file.name}
                ({item.file.name})
              {/if}
            {/if}
            </div>
        </div>
         
        {/snippet}

        {#snippet optionsRenderFunction(output, index)}
         <button class="button" onclick={renderManager.OpenContentModalEvent(output)}><i class="fa-solid fa-pen-to-square icon"></i></button>
         <button class="button" onclick={()=>{output.enabled = !output.enabled}}>
          {#if output.enabled}
            <i class="fa-solid fa-check icon"></i>
          {:else} 
            <i class="fa-solid fa-xmark icon"></i>
          {/if}
         </button>
         <button class="button" onclick={renderManager.CopyEvent(output)}><i class="fa-solid fa-copy icon"></i></button>
         <button class="button" onclick={()=>confirmModalManager.Prompt("Are you sure you want to remove this output",()=>renderManager.RemoveOutput(output))}><i class="fa-solid fa-trash icon"></i></button>
         <button class="button" onclick={()=>confirmModalManager.Prompt("Are you sure you want to reset this output",()=>output.Load())}><i class="fa-solid fa-broom icon"></i></button>
         <button class="button" onclick={()=>output.UpdatePreview()}><i class="fa-solid fa-arrows-rotate icon"></i></button>
        {/snippet}
        {#key renderManager.outputs}
        <List 
        list={new ListData(renderManager, "outputs", "selectedOutput", "layer", "vertical-list")}
        io={io}
        rendering={new ListRendering(renderFunction, optionsRenderFunction)}
        />
      {/key}
  </div>
  {/key}
</div>

<style>

.color-option{
        width: 30px;
        height: 30px;
        display: block;
        margin:0 10px ;
    }

</style>
<script>
  import {ImageFile, Composition, Layer, Manager} from "../../modules/manager.svelte.js"

  const manager = Manager.GetSingleton()

  import List from "../List.svelte";
  import { ListData, ListIO, ListRendering } from "../../modules/listManager.svelte.js";
  const io = new ListIO()

  import {ConfirmModalManager} from "../../modules/confirmModalManager.svelte.js"
  import { rgbToHex } from "../../lib/color.js";
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
    })
  }


  io.allowDropEvent = allowDrop
  io.dropEvent = drop
  io.reorderEvent = reorderEvent
  io.selectEvent = index => {

  }
</script>

<div class="column flex-1">
  {#key manager.selectedFile}
  {#if manager.selectedFile instanceof Composition}
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

        {#snippet optionsRenderFunction(item, index)}
         <button class="button" onclick={()=>{item.visible = !item.visible; manager.updateScreen()}}>
          {#if item.visible}
            <i class="fa-solid fa-eye icon"></i>
          {:else} 
            <i class="fa-solid fa-eye-slash icon"></i>
          {/if}
         </button>
         <!-- svelte-ignore a11y_consider_explicit_label -->
         <button 
         class="button"
         style="margin-left: auto;"
         onclick={e=>{manager.selectedFile.CopyLayer(index)}}>
         <i class="fa-solid fa-copy icon"></i>
       </button>
            <!-- svelte-ignore a11y_consider_explicit_label -->
          <button 
            class="button"
            style="margin-left: auto;"
            onclick={()=>removeLayer(index)}>
            <i class="fa-solid fa-trash icon"></i>
          </button>
        {/snippet}

      {#key manager.selectedFile.layers}
        <List 
        list={new ListData(manager.selectedFile, "layers", "selectedLayer", "layer", "vertical-list")}
        io={io}
        rendering={new ListRendering(renderFunction, optionsRenderFunction)}
        />
      {/key}
  </div>
  {/if}
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
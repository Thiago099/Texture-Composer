<script>
  import {Composition, Manager} from "../../modules/manager.svelte.js"
  const manager = Manager.GetSingleton()
  
  import List from "../List.svelte";
  import { ListIO, ListRendering, ListData } from "../../modules/listManager.svelte.js";

  import {ConfirmModalManager} from "../../modules/confirmModalManager.svelte.js"
  import { Folder } from "../../modules/folder.svelte.js";
  import { Pattern } from "../../modules/pattern.svelte.js";
  import { RenderManager } from "../../modules/renderManager.svelte.js";

  const renderManager = RenderManager.GetSingleton();
  const confirmModalManager = ConfirmModalManager.GetSingleton()
  const io = ListIO.GetFileListSingleton();

  io.selectEvent = file => {

    if(file instanceof Composition && file.selectedLayer == null && file.layers.length > 0){
      file.selectedLayer = file.layers[0]
    }
    if(!manager.selectedFileHistory.includes(file)){
          manager.selectedFileHistory.push(file)
      }

      if(manager.selectedFile instanceof Composition){
          if(manager.selectedFile.layers.length > 0){
              manager.selectedFile.selectedLayer = manager.selectedFile.layers[0]
          }
      }

      manager.updateScreen()
  }


  function removeItem(index){
  confirmModalManager.Prompt("Are you sure you want to remove this file?",()=>{
    const wasSelected = manager.getSelectedFileIndex() == index

    manager.cleanReferences(index)
    renderManager.cleanReferences(index)
    manager.removeFromTabs(index)


    io.removeLayer(index);

    if(wasSelected){
      if(manager.files.length == 0){
        manager.selectedFile = null
      }
      else{
        manager.selectedFile = manager.files[0]
      }
      manager.updateScreen()
    }
  })
}

function doRenderFunction(item, index){
  const folder = manager.getFolder(index)
  if(folder){
    return folder.open
  }
  return true;
}

</script>

<div class="column flex-1">
      <div class="separator" style="margin-bottom: 10px;"></div>
    <div class="flex-1 column">
        {#snippet renderFunction(item, index)}
        <div class="row">
            <div class="center flex1 { manager.getFolder(index) ? 'folder-item' : ''}">
              {#if item.thumbnail}
                <img class="thumb  h-margin" src={item.thumbnail} alt="thumb"/>
              {:else if item instanceof Folder}
                <i class="fa-solid fa-folder icon"></i>
              {:else}
                <i class="fa-solid fa-file icon"></i>
              {/if}
              {item.name}
            </div>
        </div>
        {/snippet}
        {#snippet optionsRenderFunction(item, index)}
            <!-- svelte-ignore a11y_consider_explicit_label -->
            {#if item instanceof Composition || item instanceof Pattern }
              <button 
              class="button"
              style="margin-left: auto;"
              onclick={e=>manager.CopyComposition(index)}>
              <i class="fa-solid fa-copy icon"></i>
              </button>
            {:else if item instanceof Folder}
              <button 
              class="button"
              style="margin-left: auto;"
              onclick={e=>item.open = !item.open}>
              <i class="icon fa-solid {item.open?"fa-angle-left":"fa-angle-down"}"></i>
              </button>
            {/if}
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button 
            class="button"
            style="margin-left: auto;"
            onclick={e=> removeItem(index)}>
            <i class="fa-solid fa-trash icon"></i>
          </button>
        {/snippet}
        {#key manager.files}
        <List list={new ListData(manager, "files", "selectedFile", "file", "vertical-list")} rendering={new ListRendering(renderFunction, optionsRenderFunction,doRenderFunction)} io={io}/>
        {/key}
    </div>
</div>

<style>
.folder-item{
  padding-left: 25px;
}
</style>
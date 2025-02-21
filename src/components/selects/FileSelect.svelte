<script>
    let { value=$bindable(), oninput=()=>{}, filter= () => true }= $props()
    
      import {Data} from "../../modules/dragManager.svelte"
  import {ImageFile, Composition, Manager, Layer} from "../../modules/manager.svelte.js"
  import Select from "../inputs/Select.svelte";

  const manager = Manager.GetSingleton()

  function isAllowedToDrop(){
    if(Data.dragData == null){
      return false;
    }
    return "file" == Data.dragData.menuSource
  }
  function handleDragOver(event, index) {

    if(!isAllowedToDrop()){
      return
    }

    event.preventDefault();
  }


  function handleDrop(event) {
    event.preventDefault();

    if(!isAllowedToDrop()){
      return
    }

    if(!manager.isCompositionActive()){
      return
    }

    if(Data.dragData.item.Contains(manager.selectedFile)){
      return
    }
    
    value = Data.dragData.item
    oninput(value)
    Data.dragData = null
}

  </script>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="range-container"
    ondragover={handleDragOver}
    ondrop={handleDrop}
    >
    {#snippet renderFunction(option)}
    <div class="v-center">
      {#if option.thumbnail}
      <img class="thumb  h-margin" src={option.thumbnail} alt="thumb"/> 
      {:else}
      <i class="fa-solid fa-file icon"></i>
      {/if}
      {option.name}
    </div>
    {/snippet}
    
    <Select 
    bind:value={value} 
    options={manager.files} 
    filter={filter}
    renderFunction={renderFunction} 
    oninput={()=>{manager.updateScreen();oninput(value)}}  ></Select>
    </div>
    
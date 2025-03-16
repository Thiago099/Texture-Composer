<script>
  import {Data} from "../modules/dragManager.svelte"
  import {ImageFile, Composition, Manager, Layer} from "../modules/manager.svelte.js"
  import { Pattern } from '../modules/pattern.svelte.js';
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
      return;
    }


    manager.selectedFile.AddLayer(0, Data.dragData.item)

    manager.updateScreen()
    Data.dragData = null
}


function render(){

  if(!manager.selectedFile){return}

  if(manager.selectedFile){


    const container = document.getElementById("canvas-container")

    if(!container){
      return
    }

    if(!manager.selectedFile){
      return
    }

    if(manager.selectedFile instanceof Composition){
      manager.selectedFile.RenderAsync(1024, 1024, 1024)
      .then(()=>{
        if(container.firstChild != manager.selectedFile.canvas){
          container.innerHTML= ""
          container.appendChild(manager.selectedFile.canvas);
        }
      })
      manager.selectedFile.selectedLayer?.RenderAsync(300)
    }
    else if (manager.selectedFile instanceof Pattern){
      manager.selectedFile.Render(1024, 1024, true)
      .then(()=>{
        container.innerHTML= ""
        container.appendChild(manager.selectedFile.canvas);
      })

    }


  }
  
}
$effect(()=>{
  const data = manager.selectedFile
  manager.updateScreen()
})
document.addEventListener("renderChanged", render);

</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
class="container"
ondragover={handleDragOver}
ondrop={handleDrop}
>
  {#if manager.selectedFile instanceof ImageFile}
  <img src={manager.selectedFile?.image?.src} alt="img"/>
  {:else if manager.selectedFile instanceof Composition || manager.selectedFile instanceof Pattern}
  <div id="canvas-container"></div>
  {/if}
</div>

<style>
.container{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items:  center;
    overflow: hidden;
}

img{
    max-width: 100%;
    max-height: 100%;
}



</style>
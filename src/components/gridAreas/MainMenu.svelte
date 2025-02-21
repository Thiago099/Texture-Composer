<script>
  import { onMount } from "svelte";
  import { LoadImage } from "../../application/io.svelte.js"
import { Folder, Manager } from "../../modules/manager.svelte.js"
import {ManagerPersistence} from "../../modules/managerPersistence.svelte.js"
import { RenderManager } from "../../modules/renderManager.svelte.js";
const manager = Manager.GetSingleton()
const renderManager = RenderManager.GetSingleton()
  import { ListIO, ListRendering, ListData } from "../../modules/listManager.svelte.js";
  import DropDown from "../DropDown.svelte";
  import { SaveModalManager } from "../../modules/saveModalManager.svelte.js";
  import { ConfirmModalManager } from "../../modules/confirmModalManager.svelte.js";
  const io = ListIO.GetFileListSingleton();
  const confirmModalManager = ConfirmModalManager.GetSingleton()

let fileInput;


function uploadMedias(){
    fileInput.click()
  }
  function addComposition(){
    manager.addComposition()
    select(manager.files.length-1)
  }
  function loadFiles(files){
    for(const file of files){
        LoadImage(file).then((image)=>{
          if(image){
            manager.addImage(file, image)
            manager.pushHistory("add file")
          }
        })
      }
  }
  
  io.uploadMedias = uploadMedias

  onMount(async ()=>{
    manager.addComposition()
    fileInput.addEventListener("input",()=>{
        loadFiles(fileInput.files)
    })
  })

    document.body.addEventListener('dragover', event => {
      if(!event.dataTransfer){
        return
      }
      if(!event.dataTransfer.items){
        return
      }
      for(const item of event.dataTransfer.items){
        if (item.kind === 'file') {
          event.preventDefault(); 
        }
      }
    });

    document.body.addEventListener('drop', event => {
        event.preventDefault(); // Prevent default behavior

        const files = event.dataTransfer.files;

        if (files.length === 1) {
          const file = files[0];

          if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
            confirmModalManager.Prompt("Are you sure you want to load this project?", ()=>{
              ManagerPersistence.Load(file)
            })
            return
          }

        }

        loadFiles(event.dataTransfer.files)
    });
  const saveModalManager = SaveModalManager.GetSingleton();

</script>
<DropDown options={[
  {
    name: "Save",
    icon: "fa-solid fa-download",
    action: () => saveModalManager.Prompt("Save Project", manager.projectName , x =>{
      manager.projectName = x
      ManagerPersistence.Save(x)
    })
  },
  {
    name: "Load",
    icon: "fa-solid fa-upload",
    action: () => ManagerPersistence.Load()
  }
]}>
  <i class="fa-solid fa-diagram-project"></i> Project
</DropDown>
<DropDown options={[
  new Folder("Upload"),
  {
    name: "Images",
    icon: "fa-solid fa-image",
    action: uploadMedias
  },
  new Folder("Add"),
  {
    name: "Composition",
    icon: "fa-solid fa-layer-group",
    action: addComposition
  },
  {
    name: "Folder",
    icon: "fa-solid fa-folder",
    action: ()=>manager.addFolder()
  },
  new Folder("Create Fill"),
  {
    name: "Color",
    icon: "fa-solid fa-droplet",
    action: ()=> manager.addColor()
  },
  {
    name: "Linear Gradient",
    icon: "fa-solid fa-swatchbook",
    action: ()=> manager.addLinearGradient()
  },
  {
    name: "Radial Gradient",
    icon: "fa-solid fa-swatchbook",
    action: ()=> manager.addRadialGradient()
  },
  {
    name: "Perlin Noise",
    icon: "fa-solid fa-mountain-sun",
    action: ()=> manager.addPerlinNoise()
  },
  {
    name: "Voronoi Noise",
    icon: "fa-solid fa-mountain-sun",
    action: ()=> manager.addVoronoiNoise()
  },
  {
    name: "Grain Noise",
    icon: "fa-solid fa-mountain-sun",
    action: ()=> manager.addGrainNoise()
  }
]}>
  <i class="fa-solid fa-file"></i> File
</DropDown>

<button class="button main-menu-button" onclick={()=>renderManager.Open()}><i class="fa-regular fa-image"></i> Render</button>
<input type="file" bind:this={fileInput} accept="image/*" hidden multiple>
<style>
.main-menu-button{
  margin: 0 5px;
  height: 30px;
  padding: 0 30px;
}
</style>
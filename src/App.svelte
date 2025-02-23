<script>
  import { onMount } from "svelte";

  import {computeGridStyle} from "./lib/computeGridStyle"

  import { Manager } from "./modules/manager.svelte.js"


  import {makeGridAreasResizable} from "./lib/grid-resize-helper"
  import FileList from "./components/lists/FileList.svelte";
  import Screen from "./components/Screen.svelte";
  import FileHistoryList from "./components/lists/FileHistoryList.svelte";
  import ColorPickerModal from "./components/modals/ColorPickerModal.svelte";
  import MainMenu from "./components/gridAreas/MainMenu.svelte";
  import LeftPanel from "./components/gridAreas/LeftPanel.svelte";
  import RightPanel from "./components/gridAreas/RightPanel.svelte";
  import RenderModal from "./components/modals/RenderModal.svelte";
  import ConfirmModal from "./components/modals/ConfirmModal.svelte";
  import SaveModal from "./components/modals/SaveModal.svelte";
  import ContextMenu from "./components/ContextMenu.svelte";

  onMount(async ()=>{
    let gridElement = document.querySelector('.grid-container');

    function updateGridSize(){
      computeGridStyle(gridElement)
    }

    updateGridSize()

    window.addEventListener("resize", updateGridSize)
    
    makeGridAreasResizable(gridElement,{
        thickness:"15px",
        minWidth: 30, 
        minHeight: 30,
        fixedAreas: ["header","tab"]
    })


  })

</script>

  
  <div class="grid-container">
    <div class="header">
      <div class="grid-item center">
        <MainMenu></MainMenu>
      </div>      
    </div>
    <div class="tab">
      <div class="grid-item" style="overflow: hidden;">
        <FileHistoryList></FileHistoryList>
      </div>      
    </div>
    <div class="main">
      <div class="grid-item checker-big">
        <Screen></Screen>
      </div>
    </div>  
    <div class="right">
      <div class="grid-item">
        <RightPanel></RightPanel>
        </div>
    </div>

    <div class="left">
      <div class="grid-item column"> 
        <LeftPanel></LeftPanel>
      </div>
    </div>
  </div>
  
<ColorPickerModal></ColorPickerModal>
<RenderModal></RenderModal>
<ConfirmModal></ConfirmModal>
<SaveModal></SaveModal>
<ContextMenu></ContextMenu>
<style>
.header { grid-area: header; }
.main { grid-area: main; }
.right { grid-area: right; }
.left { grid-area: left; }
.tab { grid-area: tab; }

.grid-container {
  display: grid;
  grid-template-areas:
    'header header header'
    'tab tab tab'
    'left main right';
  gap: 5px;
  grid-template-columns: 430px 1fr 430px;
  grid-template-rows: 40px 50px 1fr;
  background-color: var(  --background-color );
  padding: 5px;
  width: 100%;
  height: 100vh;
}

.grid-container > div {
  background-color: var(--secondary-color);
  padding: 5px;
  display: flex;
}

.grid-item{
  display: flex;
  overflow: auto;
  flex: 1;
}


</style>

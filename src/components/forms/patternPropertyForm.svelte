<script>
  import {ImageFile, Composition, Layer, Manager, Folder} from "../../modules/manager.svelte.js"
  import Text from "../inputs/Text.svelte";
  import { Pattern } from "../../modules/pattern.svelte.js";
  import Number from "../inputs/Number.svelte";
  import Color from "../inputs/Color.svelte";
  import Gradient from "../inputs/Gradient.svelte";
  import Range from "../inputs/Range.svelte";
  import TextSelect from "../selects/TextSelect.svelte";
  import Button from "../inputs/Button.svelte";
  const manager = Manager.GetSingleton()

  function oninput(action){
    return ()=>{
      manager.updateScreen()
    }
  }
const fillTypes = [
  new Folder("Basic"),
  { name: "Color", value: "color" },
  new Folder("Gradient"),
  { name: "Linear Gradient", value: "linearGradient" },
  { name: "Radial Gradient", value: "radialGradient" },
  new Folder("Noise"),
  { name: "Perlin Noise", value: "perlinNoise" },
  { name: "Voronoi Noise", value: "voronoiNoise" },
  { name: "Grain Noise", value: "grainNoise" },
];

function setVGradient(){
  manager.selectedFile.x1 = 0.5
  manager.selectedFile.y1 = 0.5
  manager.selectedFile.angle = -90
  manager.selectedFile.radios = 1
}

function setHGradient(){
  manager.selectedFile.x1 = 0.5
  manager.selectedFile.y1 = 0.5
  manager.selectedFile.angle = 0
  manager.selectedFile.radios = 1

}
function setD1Gradient(){
  manager.selectedFile.x1 = 0.5
  manager.selectedFile.y1 = 0.5
  manager.selectedFile.angle = 45
  manager.selectedFile.radios = 1
}
function setD2Gradient(){
  manager.selectedFile.x1 = 0.5
  manager.selectedFile.y1 = 0.5
  manager.selectedFile.angle = 135
  manager.selectedFile.radios = 1
}
function setD3Gradient(){
  manager.selectedFile.x1 = 0.5
  manager.selectedFile.y1 = 0.5
  manager.selectedFile.angle = -135
}
function setD4Gradient(){
  manager.selectedFile.x1 = 0.5
  manager.selectedFile.y1 = 0.5
  manager.selectedFile.angle = -45
}
function setCGradient(){
  manager.selectedFile.x1 = 0.5
  manager.selectedFile.y1 = 0.5
  manager.selectedFile.radios = 1
}
function setCornerTopLeftGradient(){
  manager.selectedFile.x1 = 0
  manager.selectedFile.y1 = 0
  manager.selectedFile.radios = 1
}
function setCornerTopRightGradient(){
  manager.selectedFile.x1 = 1
  manager.selectedFile.y1 = 0
  manager.selectedFile.radios = 1
}
function setCornerBottomRightGradient(){
  manager.selectedFile.x1 = 1
  manager.selectedFile.y1 = 1
  manager.selectedFile.radios = 1
}
function setCornerBottomLeftGradient(){
  manager.selectedFile.x1 = 0
  manager.selectedFile.y1 = 1
  manager.selectedFile.radios = 1
}

function setCornerCenterLeftGradient(){
  manager.selectedFile.x1 = 0
  manager.selectedFile.y1 = 0.5
  manager.selectedFile.radios = 1
}
function setCornerCenterRightGradient(){
  manager.selectedFile.x1 = 1
  manager.selectedFile.y1 = 0.5
  manager.selectedFile.radios = 1
}
function setCornerCenterTopGradient(){
  manager.selectedFile.x1 = 0.5
  manager.selectedFile.y1 = 0
  manager.selectedFile.radios = 1
}
function setCornerCenterBottomGradient(){
  manager.selectedFile.x1 = 0.5
  manager.selectedFile.y1 = 1
  manager.selectedFile.radios = 1
}



</script>
{#if manager.selectedFile && manager.selectedFile instanceof Pattern}
    <label>Name</label>
    <Text bind:value={manager.selectedFile.name}></Text>
    <label>Color</label>

    <label>Fill Type</label>
    <TextSelect options={fillTypes} bind:value={manager.selectedFile.fillType}></TextSelect>

    {#if manager.selectedFile.fillType.value == "voronoiNoise"}
    <label>Color</label>
    <Gradient bind:value={manager.selectedFile.gradient}></Gradient>
    <label>Scale</label>
    <Range bind:value={manager.selectedFile.scale} min={1} max={100} step={0.01} reset={()=>manager.selectedFile.scale = 10} oninput={oninput("pattern scale")}></Range>
    <label>Disturbance</label>
    <Range bind:value={manager.selectedFile.disturbance} min={0} max={1} step={0.001} reset={()=>manager.selectedFile.disturbance = 0.8} oninput={oninput("pattern disturbance")}></Range>
    <label>Contrast</label>
    <Range bind:value={manager.selectedFile.contrast} min={1} max={2} step={0.001} reset={()=>manager.selectedFile.contrast = 1.2} oninput={oninput("pattern contrast")}></Range>
    {:else if manager.selectedFile.fillType.value == "perlinNoise"}
    <label>Color</label>
    <Gradient bind:value={manager.selectedFile.gradient}></Gradient>
    <label>Scale</label>
    <Range bind:value={manager.selectedFile.scale} min={1} max={100} step={0.01} reset={()=>manager.selectedFile.scale = 10} oninput={oninput("pattern scale")}></Range>
    <label>Time</label>
    <Range bind:value={manager.selectedFile.time} min={0} max={1} step={0.001} reset={()=>manager.selectedFile.time = 0} oninput={oninput("pattern time")}></Range>
    <label>Octaves</label>
    <Range bind:value={manager.selectedFile.octaves} min={1} max={100} step={1} reset={()=>manager.selectedFile.octaves = 6} oninput={oninput("pattern octaves")}></Range>
    <label>Persistence</label>
    <Range bind:value={manager.selectedFile.persistence} min={0} max={1} step={0.01} reset={()=>manager.selectedFile.persistence = 0.5} oninput={oninput("pattern persistence")}></Range>
    {:else if manager.selectedFile.fillType.value == "color"}
    <label>Color</label>
    <Color bind:value={manager.selectedFile.color}></Color>
    {:else if manager.selectedFile.fillType.value == "linearGradient"}
    <label>Gradient</label>
    <Gradient bind:value={manager.selectedFile.gradient}></Gradient>
    <label>X</label>
    <Range bind:value={manager.selectedFile.x1} min={-5} max={5} step={0.01} reset={()=>manager.selectedFile.x1 = 0.5} oninput={oninput("pattern x1")}></Range>
    <label>Y</label>
    <Range bind:value={manager.selectedFile.y1} min={-5} max={5} step={0.01} reset={()=>manager.selectedFile.y1 = 0.5} oninput={oninput("pattern y1")}></Range>
    <label>Angle</label>
    <Range bind:value={manager.selectedFile.angle} min={0} max={360} step={1} reset={()=>manager.selectedFile.angle = -90} oninput={oninput("pattern angle")}></Range>
    <label>Radious</label>
    <Range bind:value={manager.selectedFile.radios} min={0.001} max={10} step={0.01} reset={()=>manager.selectedFile.radios = 1} oninput={oninput("pattern radios")}></Range>
      <Button action={setHGradient}>Horizontal</Button>
      <Button action={setVGradient}>Vertical</Button>
      <Button action={setD1Gradient}>Top Left</Button>
      <Button action={setD2Gradient}>Top Right</Button>
      <Button action={setD3Gradient}>Bottom Right</Button>
      <Button action={setD4Gradient}>Bottom Left</Button>
    {:else if manager.selectedFile.fillType.value == "radialGradient"}
      <label>Gradient</label>
      <Gradient bind:value={manager.selectedFile.gradient}></Gradient>
      <label>X</label>
      <Range bind:value={manager.selectedFile.x1} min={-5} max={5} step={0.01} reset={()=>manager.selectedFile.x1 = 0.5} oninput={oninput("pattern x1")}></Range>
      <label>Y</label>
      <Range bind:value={manager.selectedFile.y1} min={-5} max={5} step={0.01} reset={()=>manager.selectedFile.y1 = 0.5} oninput={oninput("pattern y1")}></Range>
      <label>Radious</label>
      <Range bind:value={manager.selectedFile.radios} min={0.001} max={10} step={0.01} reset={()=>manager.selectedFile.radios = 1} oninput={oninput("pattern radios")}></Range>
      <Button action={setCGradient}>Center</Button>
      <Button action={setCornerTopLeftGradient}>Top Left</Button>
      <Button action={setCornerTopRightGradient}>Top Right</Button>
      <Button action={setCornerBottomRightGradient}>Bottom Right</Button>
      <Button action={setCornerBottomLeftGradient}>Bottom Left</Button>
      <Button action={setCornerCenterLeftGradient}>Center Left</Button>
      <Button action={setCornerCenterRightGradient}>Center Right</Button>
      <Button action={setCornerCenterTopGradient}>Center Top</Button>
      <Button action={setCornerCenterBottomGradient}>Center Bottom</Button>
      {:else if manager.selectedFile.fillType.value == "grainNoise"}
      <label>Gradient</label>
      <Gradient bind:value={manager.selectedFile.gradient}></Gradient>
      {/if}


{/if}

<style>
.swap-item > *{
  margin: 10px;
}

</style>
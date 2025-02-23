<script>
  import {ImageFile, Composition, Layer, Manager} from "../../modules/manager.svelte.js"
  import Text from "../inputs/Text.svelte";
  import Tabs from "../Collapsible.svelte";
  import File from "../selects/FileSelect.svelte";
  import Button from "../inputs/Button.svelte";
  import Toggle from "../inputs/Toggle.svelte";
  import Range from "../inputs/Range.svelte";
  import ColorSelect from "../selects/ColorSelect.svelte";
  import TextSelect from "../selects/TextSelect.svelte";
  import Gradient from "../inputs/Gradient.svelte";
  import { ConfirmModalManager } from "../../modules/confirmModalManager.svelte.js";
  import { Folder } from "../../modules/folder.svelte.js";
  import Select from "../inputs/Select.svelte";
  const manager = Manager.GetSingleton()
  const confirmModal = ConfirmModalManager.GetSingleton()

  function resetAll(){
    manager.getSelectedLayer().ResetAdjustments()
    manager.selectedFile.selectedLayer.maskGroup = null
    manager.selectedFile.selectedLayer.blendMode = null
    manager.updateScreen()
    oninput("reset all")()
  }
  function resetAlpha(){
    manager.getSelectedLayer().ResetAlpha()
    manager.updateScreen()
  }
  function resetBlurAmount(){
    manager.getSelectedLayer().ResetBlurAmount()
    manager.updateScreen()
  }

  function resetScale(){
    manager.getSelectedLayer().ResetScale()
    manager.updateScreen()
  }

  function resetSaturation(){
    manager.getSelectedLayer().ResetSaturation()
    manager.updateScreen()
  }
  function resetHue(){
    manager.getSelectedLayer().ResetHue()
    manager.updateScreen()
  }

  function resetContrast(){
    manager.getSelectedLayer().ResetContrast()
    manager.updateScreen()
  }

  function resetBrightness(){
    manager.getSelectedLayer().ResetBrightness()
    manager.updateScreen()
  }


  function oninput(action){
    return ()=>{
      manager.updateScreen()
    }
  }


  const blendModes = [
    new Folder("Darkening Modes"),
  { name: "Color Burn", value: 3 },
  { name: "Darken", value: 5 },
  { name: "Linear Burn", value: 12 },
  { name: "Multiply", value: 15 },
  { name: "Subtract", value: 24 },

  new Folder("Lightening Modes"),
  { name: "Add", value: 1 },
  { name: "Color Dodge", value: 4 },
  { name: "Glow", value: 8 },
  { name: "Lighten", value: 11 },
  { name: "Linear Dodge", value: 13 },
  { name: "Screen", value: 22 },

  new Folder("Contrast Modes"),
  { name: "Hard Light", value: 9 },
  { name: "Hard Mix", value: 10 },
  { name: "Linear Light", value: 14 },
  { name: "Overlay", value: 18 },
  { name: "Pin Light", value: 20 },
  { name: "Soft Light", value: 23 },
  { name: "Vivid Light", value: 25 },

  new Folder("Comparative Modes"),
  { name: "Difference", value: 6 },
  { name: "Exclusion", value: 7 },
  { name: "Negation", value: 16 },
  { name: "Phoenix", value: 19 },

  new Folder("Other Modes"),
  { name: "Average", value: 2 },
  { name: "Reflect", value: 21 }
];

</script>
{#if manager.selectedFile?.selectedLayer}
{#snippet basic()}
  {#key manager.historyIndex}
  <label>File</label>
  <File bind:value={manager.selectedFile.selectedLayer.file} oninput={oninput("layer file")} filter={x=>!x.Contains(manager.selectedFile)}></File>
  <label>Reset All Properties</label>
  <Button action={()=>confirmModal.Prompt("Are you sure you want to reset all properties?",resetAll)} >Reset All Properties</Button>
  {/key}
{/snippet}
{#snippet blending()}
{#key manager.historyIndex}
<label>Alpha</label>
<Range 
  bind:value={manager.selectedFile.selectedLayer.alpha} 
  min={0} 
  max={100} 
  step={0.01} 
  reset={resetAlpha} 
  oninput={oninput("layer alpha")}
></Range>
{/key}
<label>Blend Mode</label>
<TextSelect 
options={blendModes} 
bind:value={manager.selectedFile.selectedLayer.blendMode} 
oninput={oninput("layer blend mode")}
disabled={manager.selectedFile.selectedLayer.enableH || manager.selectedFile.selectedLayer.enableS || manager.selectedFile.selectedLayer.enableV}
></TextSelect>

<label>Override Channels</label>
<div class="row">
  <Toggle bind:value={manager.selectedFile.selectedLayer.enableH} oninput={oninput("enable h")}>H</Toggle>
  <Toggle bind:value={manager.selectedFile.selectedLayer.enableS} oninput={oninput("enable s")}>S</Toggle>
  <Toggle bind:value={manager.selectedFile.selectedLayer.enableV} oninput={oninput("enable v")}>V</Toggle>
</div>
<label>Affect Channels</label>
<div class="row">
  <Toggle bind:value={manager.selectedFile.selectedLayer.enableR} oninput={oninput("enable r")}>R</Toggle>
  <Toggle bind:value={manager.selectedFile.selectedLayer.enableG} oninput={oninput("enable g")}>G</Toggle>
  <Toggle bind:value={manager.selectedFile.selectedLayer.enableB} oninput={oninput("enable b")}>B</Toggle>
</div>

{/snippet}
{#snippet positioning()}
<!-- svelte-ignore a11y_label_has_associated_control -->
<label>Horizontal Alignment</label>
<Select hasNone={false} bind:value={manager.selectedFile.selectedLayer.horizontalAlignment} options={[{name:"Left", value:0}, {name:"Center", value:1}, {name:"Right", value:2}]} oninput={oninput("layer horizontal alignment")}></Select>
<!-- svelte-ignore a11y_label_has_associated_control -->
<label>Vertical Alignment</label>
<Select hasNone={false} bind:value={manager.selectedFile.selectedLayer.verticalAlignment} options={[{name:"Top", value:0}, {name:"Center", value:1}, {name:"Bottom", value:2}]} oninput={oninput("layer vertical alignment")}></Select>

<label>Tile</label>
<Toggle bind:value={manager.selectedFile.selectedLayer.tile} oninput={oninput("layer tile")}>Tile</Toggle>
<label>X Offset</label>
<Range bind:value={manager.selectedFile.selectedLayer.xOffset} min={-1} max={1} step={0.001} reset={()=>manager.selectedFile.selectedLayer.xOffset = 0} oninput={oninput("layer x offset")}></Range>
<label>Y Offset</label>
<Range bind:value={manager.selectedFile.selectedLayer.yOffset} min={-1} max={1} step={0.001} reset={()=>manager.selectedFile.selectedLayer.yOffset = 0} oninput={oninput("layer y offset")}></Range>
<label>Scale</label>
<Range 
  bind:value={manager.selectedFile.selectedLayer.scale} 
  min={0} 
  max={500} 
  step={10} 
  reset={resetScale} 
  oninput={oninput("layer scale")}
></Range>
{/snippet}
{#snippet mask()}
  {#key manager.historyIndex}
  <label>Mask Group</label>
  <ColorSelect 
  options={manager.selectedFile.colors}
  bind:value={manager.selectedFile.selectedLayer.maskGroup}
  oninput={oninput("layer mask group")}
  >
  </ColorSelect>
  <label>Mask File</label>
  <File bind:value={manager.selectedFile.selectedLayer.fileMask} filter={x=>!x.Contains(manager.selectedFile)} oninput={oninput("layer file")}></File>
  {/key}
  {/snippet}
{#snippet effects()}
<label>Blur Amount</label>
  {#key manager.historyIndex}
<Range 
  bind:value={manager.selectedFile.selectedLayer.blurAmount} 
  min={0} 
  max={100} 
  step={0.01} 
  reset={resetBlurAmount} 
  oninput={oninput("layer blur amount")}
></Range>
<label>Blur Mask</label>
<File bind:value={manager.selectedFile.selectedLayer.blurMask} filter={x=>!x.Contains(manager.selectedFile)} oninput={oninput("blur mask")}></File>
<div class="separator"></div>
<label>Invert</label>
<Toggle bind:value={manager.selectedFile.selectedLayer.invert} oninput={oninput("layer invert")}>Invert</Toggle>
<label>Gradient map</label>
<Toggle bind:value={manager.selectedFile.selectedLayer.enableGradientMap} oninput={oninput("enable gradient map")}>Enable gradient map</Toggle>

{#if manager.selectedFile.selectedLayer.enableGradientMap}
  <Gradient  bind:value={manager.selectedFile.selectedLayer.gradientMapColors} oninput={oninput("gradient map")}></Gradient>
{/if}
{/key}
{/snippet}
{#snippet colorCorrection()}
{#key manager.historyIndex}
<label>Contrast</label>
<Range 
  bind:value={manager.selectedFile.selectedLayer.contrast} 
  min={0} 
  max={10} 
  step={0.01} 
  reset={resetContrast} 
  oninput={oninput("layer contrast")}
></Range>
<label>Brightness</label>
<Range 
  bind:value={manager.selectedFile.selectedLayer.brightness} 
  min={-1} 
  max={1} 
  step={0.01} 
  reset={resetBrightness} 
  oninput={oninput("layer brightness")}
></Range>
<div class="separator"></div>
<label>Saturation</label>
<Range 
  bind:value={manager.selectedFile.selectedLayer.saturation} 
  min={0} 
  max={manager.selectedFile.selectedLayer.colorize? 1 : 5} 
  step={0.01} 
  reset={resetSaturation} 
  oninput={oninput("layer saturation")}
></Range>
<label>Hue</label>
<Range 
bind:value={manager.selectedFile.selectedLayer.hue} 
min={0} 
max={1} 
step={0.001} 
reset={resetHue} 
oninput={oninput("layer hue")}
></Range>
<label>Colorize</label>
<Toggle bind:value={manager.selectedFile.selectedLayer.colorize} oninput={oninput("layer colorize")}>Colorize</Toggle>
{/key}
{/snippet}
<Tabs tabs={
[
  {
    title:"Basic",
    icon:"fa-solid fa-gears",
    element:basic
  },
  {
    title:"Positioning",
    icon:"fa-solid fa-arrows-up-down-left-right",
    element:positioning
  },
  {
    title:"Mask",
    icon:"fa-solid fa-mask",
    element:mask
  },
  {
    title:"Blending",
    icon:"fa-solid fa-object-group",
    element:blending
  },
  {
    title:"Effects",
    icon:"fa-solid fa-bolt",
    element:effects
  },
  {
    title:"Color Correction",
    icon:"fa-solid fa-palette",
    element:colorCorrection
  }
  
]
}></Tabs>
{/if}

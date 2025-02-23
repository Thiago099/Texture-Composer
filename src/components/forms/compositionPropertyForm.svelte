<script>
  import {ImageFile, Composition, Layer, Manager} from "../../modules/manager.svelte.js"
  import Button from "../inputs/Button.svelte";
  import File from "../selects/FileSelect.svelte";
  import Text from "../inputs/Text.svelte";
  import Tabs from "../Collapsible.svelte";
  import Toggle from "../inputs/Toggle.svelte";
  import Range from "../inputs/Range.svelte";
  const manager = Manager.GetSingleton()
  let optionForm =null; 

  let lastFile = null

</script>
{#if manager.selectedFile && manager.selectedFile instanceof Composition}
  <div class="margin-bottom-30">
    {#key manager.selectedFile}
    {#key manager.historyIndex}
      <label>Mask File</label>
      <File bind:value={manager.selectedFile.file} filter={x=>!x.Contains(manager.selectedFile)} oninput={()=>{manager.selectedFile?.GenerateMask();manager.updateScreen();}}></File>
    {/key}
    {/key}
 </div>
  {#snippet normal()}
  <label>Convert to normal</label>
  <Toggle bind:value={manager.selectedFile.convertToNormal} oninput={()=>{manager.updateScreen();}}>Convert to normal</Toggle>
  {#if manager.selectedFile.convertToNormal}
  <label>Normal Strength</label>
  <Range bind:value={manager.selectedFile.normalStrength} reset={()=>manager.selectedFile.normalStrength = 10} min={0} max={30} step={0.1} oninput={()=>{manager.updateScreen();}}></Range>
  <label>DirectX Normal</label>
  <Toggle bind:value={manager.selectedFile.directXNormal} oninput={()=>{manager.updateScreen();}}>DirectX Normal</Toggle>
  {/if}
  {/snippet}

  {#snippet textureSwap()}
  {#key manager.historyIndex}

  <label>Mask File</label>
  <File bind:value={manager.selectedFile.file} filter={x=>!x.Contains(manager.selectedFile)} oninput={()=>{manager.selectedFile?.GenerateMask();manager.updateScreen();}}></File>
  <label>Layer files</label>
  {#each manager.selectedFile.GetUniqueFiles() as item (item)}
    {#if item != manager.selectedFile.file}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="v-center flex1 swap-item">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        {#if item.thumbnail}
          <img class="thumb h-margin" src={item.thumbnail} alt="thumb"/>
        {:else}
          <i class="fa-solid fa-layer-group h-margin" style="font-size: 3em;"></i>
        {/if}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
      <File bind:value={item.file}  filter={x=>!x.Contains(manager.selectedFile)}  oninput={(newFile)=>{ manager.selectedFile.ReplaceFile(item, newFile);manager.updateScreen();manager.selectedFile.updateAllLayers();}}></File>
      </div>
    {/if}
  {/each}
  {/key}
  {/snippet}

  <Tabs tabs={
    [
      {
        title:"Normal Output",
        icon:"fa-solid fa-mountain",
        element:normal
      },
      {
        title:"Texture swap",
        icon:"fa-solid fa-arrows-rotate",
        element:textureSwap
      }
    ]
    }></Tabs>

{/if}

<style>
.swap-item > *{
  margin: 10px;
}

</style>
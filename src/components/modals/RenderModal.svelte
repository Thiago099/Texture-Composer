<script>
  import { RenderManager } from "../../modules/renderManager.svelte";
  import { Composition, Manager } from "../../modules/manager.svelte";
  import FileSelect from "../selects/FileSelect.svelte";
import Modal from "../Modal.svelte";
  import { rgbToHex } from "../../lib/color";
  import { ConfirmModalManager } from "../../modules/confirmModalManager.svelte";
  import Toggle from "../inputs/Toggle.svelte";
  import Text from "../inputs/Text.svelte";
  import DynamicCollapsible from "../DynamicCollapsible.svelte";
  import Button from "../inputs/Button.svelte";
  import { ListIO } from "../../modules/listManager.svelte";
  import RenderOutputList from "../lists/RenderOutputList.svelte";
const renderManager = RenderManager.GetSingleton()
const manager = Manager.GetSingleton()
const confirmManager = ConfirmModalManager.GetSingleton()
  const io = ListIO.GetFileListSingleton();
</script>
<Modal width={1400} height={800} bind:this={renderManager.contentModal}>
  {#if renderManager.selectedOutput}
  <div style="height: 100%; overflow-y:auto;">
  <div class="row">
    <div  class="col w100" style="margin:10px">

      <div class="column margin-bottom-60">
        <label>Name</label>
        <label>Base Composition</label>
        <div class="full-width-margin">
          <FileSelect filter={x=>x instanceof Composition} bind:value={renderManager.selectedOutput.base} oninput={()=>{renderManager.selectedOutput.name = renderManager.selectedOutput.base?.name;renderManager.selectedOutput.Load()}}></FileSelect>
        </div>
      </div>
      <Toggle bind:value={renderManager.selectedOutput.enabled}>Enabled</Toggle>
      <button class="button full"  onclick={renderManager.CopyEvent(renderManager.selectedOutput)}><i class="fa-solid fa-copy"></i> Duplicate</button>
      <button class="button full"  onclick={()=>confirmManager.Prompt("Are you sure you want to remove this output",()=>renderManager.RemoveOutput(renderManager.selectedOutput))}><i class="fa-solid fa-trash"></i> Remove</button>
      <Button action={()=>confirmManager.Prompt("Are you sure you want to reset this output",()=>renderManager.selectedOutput.Load())}><i class="fa-solid fa-broom"></i> Clean and Update</Button>
    </div>
    {#if renderManager.selectedOutput.preview}
      <img class="h-margin preview" src={renderManager.selectedOutput.preview} alt="thumb"/> 
    {/if}
  </div>

  <label>Files</label>
  <div class="items-container">
    {#each renderManager.selectedOutput.files as item}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="item">
      <FileSelect filter={x=>!x.Contains(renderManager.selectedOutput.base)} bind:value={item.file} oninput={()=>renderManager.selectedOutput.UpdatePreview()}></FileSelect>
    </div>
    {/each}
  </div>
  <label>Colors</label>
  <div class="items-container">
    {#each renderManager.selectedOutput.colors as item}
    <div class="item">
      <button onclick={renderManager.PickColorEvent(renderManager.selectedOutput, item)} class="button full color-icon-container"><div class="color-icon" style="background-color: rgba({item.color[0]},{item.color[1]},{item.color[2]},{item.color[3]/255});"></div>{rgbToHex(...item.color)} {(item.color[3]/255*100).toFixed(2)}</button>
    </div>
    {/each}
  </div>
  </div>
  {/if}
</Modal>
<Modal title="Rendering" width={800} height={600} bind:this={renderManager.modal} >
    <div  class="row">
    <button class="button full"onclick={renderManager.AddOutputEvent()}><i class="fa-solid fa-plus"></i> Add Output</button>
    <button class="button full" onclick={()=>io.uploadMedias()}><i class="fa-solid fa-upload"></i> Upload Medias</button>
    <button class="button full" onclick={renderManager.UpdateAllPreviewEvent()}><i class="fa-solid fa-arrows-rotate"></i> Update All Previews</button>
    <button class="button full" onclick={()=>renderManager.Download()}><i class="fa-solid fa-camera"></i> Render</button>
  </div>
  <div style="height: 100%; overflow-y:auto;">
  {#key renderManager.outputs}
  <div style="display: flex;flex-direction:row;flex-wrap:wrap;">
    <RenderOutputList></RenderOutputList>
  </div>
  {/key}
</div>

</Modal>

<style>

.full-width-margin{
  width: calc(100% - 10px);
  margin:5px;
}

  .items-container{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
  }
  .item{
    width: calc(25% - 10px); 
    margin: 5px;
  }
  .preview{
    height: 100%;
    max-width: 500px;
    max-height: 500px;
  }

  .color-icon{
      width: 15px;
      height: 15px;
      display: block;
      margin-right: 10px;
  }
    .color-icon-container{
      display: flex;
      align-items: center;
    }
</style>
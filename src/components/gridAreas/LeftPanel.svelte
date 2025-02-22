<script>
  import { Composition, Manager } from "../../modules/manager.svelte.js"

  import CompositionPropertyForm from '../forms/compositionPropertyForm.svelte';
  import Tabs from "../Collapsible.svelte";
  import LayerPropertyForm from '../forms/layerPropertyForm.svelte';
  import FolderPropertyForm from "../forms/folderPropertyForm.svelte";
  import { Folder } from "../../modules/folder.svelte.js";
  import PatternPropertyForm from "../forms/patternPropertyForm.svelte";
  import { Pattern } from "../../modules/pattern.svelte.js";
  const manager = Manager.GetSingleton()
</script>

{#snippet layerElement()}
<LayerPropertyForm></LayerPropertyForm>
{/snippet}
{#snippet compositionElement()}
<CompositionPropertyForm></CompositionPropertyForm>
{/snippet}
{#snippet folderElement()}
<FolderPropertyForm></FolderPropertyForm>
{/snippet}
{#snippet patternElement()}
<PatternPropertyForm></PatternPropertyForm>
{/snippet}
<Tabs tabs={
  [
    {
      title:"Composition Properties",
      icon:"fa-solid fa-cubes",
      enabled: manager.selectedFile != null && manager.selectedFile instanceof Composition,
      defaultOpen:true,
      element:compositionElement
    },
    {
      title:"Layer Properties",
      icon:"fa-solid fa-layer-group",
      enabled: manager.selectedFile?.selectedLayer != null,
      defaultOpen:true,
      element:layerElement
    },
    {
      title:"Folder Properties",
      icon:"fa-solid fa-folder",
      enabled: manager.selectedFile != null && manager.selectedFile instanceof Folder,
      defaultOpen:true,
      element:folderElement
    },
    {
      title:"Pattern Properties",
      icon:"fa-solid fa-droplet",
      enabled: manager.selectedFile != null && manager.selectedFile instanceof Pattern,
      defaultOpen:true,
      element:patternElement
    }
    
  ]
  }></Tabs>
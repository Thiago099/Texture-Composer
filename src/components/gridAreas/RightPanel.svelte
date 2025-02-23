<script>
  import LayerList from '../lists/LayerList.svelte';
  import Tabs from "../Collapsible.svelte";
  import FileList from '../lists/FileList.svelte';
  import { Composition, Manager } from '../../modules/manager.svelte';
  const manager = Manager.GetSingleton()
</script>
{#snippet fileElement()}
    <FileList />
{/snippet}
{#snippet layerElement()}
    <LayerList/>
{/snippet}

<Tabs tabs={
    [
    {
        title:"File",
        icon:"fa-solid fa-file",
        defaultOpen:true,
        element:fileElement
    },
    {
        title:"Layer",
        icon:"fa-solid fa-layer-group",
        enabled: manager.selectedFile != null && manager.selectedFile instanceof Composition,
        defaultOpen:true,
        element:layerElement
    }
    ]
    }></Tabs>
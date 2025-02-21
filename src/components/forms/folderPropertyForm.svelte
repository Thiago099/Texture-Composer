<script>
  import {ImageFile, Composition, Layer, Manager} from "../../modules/manager.svelte.js"
  import Text from "../inputs/Text.svelte";
  import Tabs from "../Collapsible.svelte";
  import { Folder } from "../../modules/folder.svelte.js";
  const manager = Manager.GetSingleton()
</script>
{#if manager.selectedFile && manager.selectedFile instanceof Folder}
    <label>Name</label>
    <Text bind:value={manager.selectedFile.name}></Text>
{/if}

<style>
.swap-item > *{
  margin: 10px;
}

</style>
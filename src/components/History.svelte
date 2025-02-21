<script>
import { Manager } from "../modules/manager.svelte";
const manager = Manager.GetSingleton()
</script>



{#key manager.history}
<div style="margin-bottom: 100px;">
{#each manager.history as historyItem, index (historyItem)}
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<button onclick={()=>manager.setHistory(index)} class="button full history-item {manager.historyIndex == index?"selected":""}">{historyItem.action}</button>
{/each}
</div>
{/key}

<style>

.history-item{
    border-bottom: 3px solid transparent;
}
.history-item.selected{
    border-color: var(--primary-color);
}

</style>
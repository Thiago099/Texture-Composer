<script>

let { items, renderFunction, headerRenderFunction }= $props()



let openIndexes = $state([]);

function toggleOpen(enabled, index) {
        if(enabled === false){
            return
        }
        if (openIndexes.includes(index)) {
            openIndexes = openIndexes.filter(i => i !== index);
        } else {
            openIndexes.push(index);
        }
    }

</script>

<div class="menu">

    {#each items as item, index (item)}
        
    <div class="menu-item">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="menu-header {item.defaultOpen ?  (openIndexes.includes(index) ? '' : 'open') : (openIndexes.includes(index) ? 'open' : '')} {item.enabled===false?"disabled":""}" onclick={()=>toggleOpen(item.enabled, index)} >
            {@render headerRenderFunction?.(item)}
        </div>
        <div class="menu-content {item.defaultOpen ?  (openIndexes.includes(index) ? '' : 'open') : (openIndexes.includes(index) ? 'open' : '')}" >
            {@render renderFunction?.(item)}
        </div>
    </div>
        
    {/each}

</div>

<style>
.menu {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-shadow: 3px 6px 5px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(0, 0, 0, 0.2);
}

.menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: var(--background-color);
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: background-color 0.3s ease;
    margin-top: 3px;
}
.menu-header.disabled{
    background-color: var(--ternary-color);
}
.menu-header:not(.disabled):hover {
    background-color: var(--overlay-color);
}
.menu-header.open{
    background-color: var(--overlay-color);
}
.menu-content {
    display: none;
    flex-direction: column;
    padding: 12px 8px;
    transition: max-height 0.3s ease;
    display: none;
    min-height: 100px;
}

.menu-content.open {
    display: flex;
}

.menu-icon {
    transform: rotate(0deg);
    transition: transform 0.3s ease;
}

.menu-icon.open {
    transform: rotate(180deg);
}


</style>


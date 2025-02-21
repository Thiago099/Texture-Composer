<script>

let { tabs }= $props()



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

    {#each tabs as tab, index (tab)}

    {#if tab.enabled !== false}

        
    <div class="menu-item">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="menu-header {tab.defaultOpen ?  (openIndexes.includes(index) ? '' : 'open') : (openIndexes.includes(index) ? 'open' : '')}" onclick={()=>toggleOpen(tab.enabled, index)} >
            <i class={tab.icon}></i> {tab.title}
        </div>
        <div class="menu-content {tab.defaultOpen ?  (openIndexes.includes(index) ? '' : 'open') : (openIndexes.includes(index) ? 'open' : '')}" >
            {@render tab.element?.()}
        </div>
    </div>
        {/if}
    {/each}

</div>

<style>
.menu {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.3); 
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
    border-bottom: 3px solid var(--primary-color);
}
.menu-header.disabled{
    background-color: var(--ternary-color);
}
.menu-header:not(.disabled):hover {
    background-color: var(--overlay-color);
}
.menu-header.open{
}
.menu-header:not(.open){
    border-color: rgba(255, 255, 255, 0.3);

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


<script>
  let { 
    list,
    io,
    rendering,
  } = $props()

  io.removeLayer = (item)=>{
    if(list.selectedItem == item){
      list.selectedItem = null
    }
    list.items.splice(item, 1);
  }

  import {DragManager} from "../modules/dragManager.svelte.js"

const dragManager = new DragManager(list, io);

function prevent(e){
    e.stopPropagation()
  }
  function preventAll(e){
    e.stopPropagation()
    e.preventDefault()
  }
</script>
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="container {list.listType}" >
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
    class={(dragManager.isDraggingOver && -1 == dragManager.dropIndex && dragManager.draggingIndex != dragManager.dropIndex && dragManager.draggingIndex != dragManager.dropIndex+1)? "drop-indicator active" : "drop-indicator"}
    ondragover={dragManager.dragOverHandle(-1)}
    ondragleave={dragManager.handleDragLeave()}
    ondrop={dragManager.handleDrop()}
    ondragend={dragManager.handleDragEnd()}
  >
</div>
    {#each list.items as item, index (item)}

      {#if rendering.doRenderFunction(item, index)}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="row overflow">
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div
        draggable={!item.editName}
        oncontextmenu={e=> {if(list.allowRenaming){e.preventDefault();item.editName = true}}}
        ondragstart={dragManager.handleDragStart(index)}
        ondragover={dragManager.handleDragOver(index)}
        ondragleave={dragManager.handleDragLeave()}
        ondrop={dragManager.handleDrop()}
        ondragend={dragManager.handleDragEnd()}
        ondblclick={dragManager.doubleClickItemEvent(item)}
        onclick={dragManager.singleClickItemEvent(item)}
        class="item 
        { index == dragManager.draggingIndex &&(dragManager.draggingIndex == dragManager.dropIndex || dragManager.draggingIndex == dragManager.dropIndex+1)?"not-changed":""} 
        {dragManager.draggingIndex!=null?"dragging":""} 
        {item == dragManager.list.selectedItem ? "selected":""}
        "
        >
        {#if item.editName && list.allowRenaming}
        <div onmousedown={prevent} style="width:100%">
          <input class="rename-input" type="text" bind:value={item.name}  onblur={()=>item.editName = false} autofocus >
        </div>
        {:else}
          {@render rendering.renderFunction(item, index)} 
        {/if}

        <div class="row" style="margin-left: auto;" onmousedown={preventAll} onclick={preventAll}>
          {#if rendering.optionsRenderFunction != null}
          {@render rendering.optionsRenderFunction(item, index)} 
          {/if}
        </div>

        <!-- svelte-ignore a11y_consider_explicit_label -->

      </div>
      <!-- svelte-ignore a11y_consider_explicit_label -->

       <!-- svelte-ignore a11y_consider_explicit_label -->

      </div>
      <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="drop-indicator {(dragManager.isDraggingOver && index == dragManager.dropIndex && dragManager.draggingIndex != dragManager.dropIndex && dragManager.draggingIndex != dragManager.dropIndex+1  ?  "active" : "drop-indicator")}"
      ondragover={dragManager.dragOverHandle(index)}
      ondragleave={dragManager.handleDragLeave()}
      ondrop={dragManager.handleDrop()}
      ondragend={dragManager.handleDragEnd()}
    >
    </div>
    {/if}
    {/each}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
      class="footer"
      ondragover={dragManager.dragOverHandle(list.items.length-1)}
      ondragleave={dragManager.handleDragLeave()}
      ondrop={dragManager.handleDrop()}
      >
      </div>

</div>

<style>
.tab-list.container{
  display: flex;
  flex-direction: row;
  flex: 1;
}

.vertical-list.container{
  display: flex;
  flex-direction: column;
  flex: 1;
}
.vertical-list .item {
  flex: 1;
  background: var(--background-color);
  color: var(--text-color);
  cursor: move;
  border: 3px solid transparent !important;
  transition: border 0.2s ease-in-out;
  transition: background-color 0.1s ease-in-out;
  display: flex;
  flex-direction: row;
}
.vertical-list .rename-input{
  height: 55px;
  width: 100%;
}
.vertical-list .item:not(.dragging):hover {
  background-color: var(--overlay-color); 
}

.vertical-list .item.selected{
  background-color: var(--overlay-color);
}

.vertical-list .item.not-changed{
  border: 3px dashed var(--primary-color) !important;
}
.vertical-list .drop-indicator {
  transition: border-bottom 0.1s ease-in-out;
  border-bottom:3px dashed transparent;
  margin: 0px 5px;
}
.vertical-list .active.drop-indicator {
  border-bottom:3px dashed var(--primary-color);
}
.vertical-list .footer{
  flex: 1;
}

.vertical-list .container{
  display: flex;
  flex-direction: column;
  flex: 1;
}

.tab-list .item{
  background: var(--background-color);
  color: var(--text-color);
  height:40px;
  cursor: move;
  transition: background-color 0.1s ease-in-out;
  border: 3px solid transparent !important;
  display: flex;
  justify-content: center;


}
.tab-list .icon{
  font-size: 1.1em;
}

.tab-list  .item:not(.dragging):hover {
  background-color: var(--overlay-color); 
}

.tab-list  .item.selected{
  background-color: var(--overlay-color);
}

.tab-list  .item.not-changed{
  border: 3px dashed var(--primary-color) !important;
}
.tab-list  .drop-indicator {
  transition: border-bottom 0.1s ease-in-out;
  border-right:3px dashed transparent;
  margin:5px  0px;
}
.tab-list  .active.drop-indicator {
  border-right:3px dashed var(--primary-color);
}


.tab-list .container{
  display: flex;
  flex-direction: row;
  width: 100%; 
}

.tab-list .footer{
  flex: 1;
}


</style>

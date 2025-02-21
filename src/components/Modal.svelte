<script>
import { ModalManager } from "../modules/modalManager.svelte"
    let {children, width= 800, height = 600, title="", onclose= () => {}} = $props()

    const manager = ModalManager.GetSingleton()
    let isOpen = $state(false)
    let zIndex = $state(0)
    let titleState = $state(title)

    function open(){

        zIndex = manager.Push()

        isOpen = true
    }
    function close(){

        manager.Pop()

        isOpen = false
        onclose()
    }
    function setTitle(newTitle){
        titleState = newTitle
    }

    export { open, close, setTitle}

</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="modal-backdrop {isOpen?"open":""}" style="z-index:{zIndex}" onclick={close}></div>
<div class="modal-container {isOpen?"open":""}" style="z-index:{zIndex}">
    <div class="modal" style="width: {width}px;height: {height}px">
        <div class="modal-header">
            <div>{titleState}</div>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="close-button" onclick={close}>X</div>
        </div>
        {@render children()}
    </div>
</div>


<style>
    .modal-header{
        width: 100%;
        height: 38px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 5px solid var(--background-color);
    }
    .modal-header > div{
        padding: 0 20px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .close-button{
        cursor: pointer;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: bolder;
    }
    .close-button:hover{
        background-color: red;
        color: black;
    }
    .modal-container, .modal-backdrop{
        width: 100vw;
        height: 100vh;
        position: absolute;
        left: 0;
        top:0;
        display: flex;
        justify-content: center;
        align-items: center;
        display: none;
    }
    .modal-container{
        pointer-events: none;
    }
    .modal-backdrop{
        background-color: rgba(0, 0, 0, 0.5);
        display: none;
    }
    .modal{
        pointer-events: all;
        background-color: var(--secondary-color);
        border: 5px solid var(--background-color);
        position: relative;
        overflow: auto;
        overflow: hidden;
        box-shadow: 10px 8px 16px rgba(0, 0, 0, 0.2); 
    }
    .open{
        display: flex;
    }
</style>
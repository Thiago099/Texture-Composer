<script>

    const {value =  $bindable(), oninput=()=>{}  } = $props()

    import { GradientManager } from "../../modules/gradientManager.svelte.js"

    const manage = new GradientManager(value, oninput)

</script>
<div class="gradient-picker">

    <div class="gradient-checker checker-small"></div>
    <div class="gradient-bg" style="--gradient:{manage.GetGradient()}">
    </div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="picker-area" onmousedown={manage.AddItemEvent()}></div>
    {#each manage.items as item}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div 
            class="picker-container {item.dragging?"picker-container-active":""} {item.isRemovingCandidate?"hidden":""}" 
            onmousedown={item.MouseDownEvent()} 
            ondblclick={item.DoubleClickEvent()}
            oncontextmenu={item.ContextMenuEvent()}
            style="--picker-color:{item.color[0]}, {item.color[1]}, {item.color[2]}"
            bind:this={item.element}
            >
                <div class="caret"></div>
                <div class="square"></div>
            </div>
    {/each}
</div>
<style>
.gradient-checker, .gradient-bg{
    width: 100%;
    height: 100%;
    position: absolute;
}
.gradient-bg{
    background: var(--gradient);
}
.gradient-picker {
    position: relative;
    position: relative;
    width: calc(100% - 40px);
    height: 30px;
    border: 1px solid #ccc;
    box-shadow: 2px 2px 0px rgba(0, 0, 0, 1), -2px -2px 0px rgba(0, 0, 0, 1), -2px 2px 0px rgba(0, 0, 0, 1), 2px -2px 0px rgba(0, 0, 0, 1);
    margin: 10px;
    margin-left: 20px;
    margin-bottom: 40px;
}

.caret {
    position: absolute;
    top: 100%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 10px 10px 10px;
    border-color: transparent transparent var(--text-color) transparent;
}
.caret::after {
    content: "";
    position: absolute;
    top: calc(100% + 1px);
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 9px 9px 9px;
    border-color: transparent transparent var(--ternary-color) transparent;
}


.square {
    position: absolute;
    top: calc(100% + 10px); 
    transform: translateX(-50%);
    width: 20px;
    height: 15px;
    background-color:  var(--ternary-color);
    border-bottom: 1px solid var(--text-color);
    border-left: 1px solid var(--text-color);
    border-right: 1px solid var(--text-color);
}

.square::after {
    content: "";
    position: absolute;
    top: calc(100% + 10px); 
    transform: translateX(-50%);
    left: 9px;
    top: 2px;
    width: 10px;
    height: 10px;
    background-color:  rgb(var(--picker-color));
}

.picker-container{
    position: absolute;
    top:30px;
}
.picker-container:hover > .caret::after, .picker-container-active > .caret::after{
    border-color: transparent transparent var(--overlay-color) transparent;
} 
.picker-container:hover > .square, .picker-container-active > .square{
    background-color: var(--overlay-color);
}
.picker-area{
    width: 100%;
    height: 35px;
    top: 29px;
    position: absolute;
    --stipe-color:var(--text-color);

}

.picker-area::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 15px; /* Height of the ruler marks area */
            background: repeating-linear-gradient(
                to right,
                var(--stipe-color), var(--stipe-color) 1px, 
                transparent 1px, transparent 25%
            );
            border-bottom: 1px solid var(--stipe-color);
            border-right: 1px solid var(--stipe-color);
        }
.hidden{
    opacity: 0;
}
</style>
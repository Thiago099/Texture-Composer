<script>

import Modal from "../Modal.svelte";

import { ColorPicker } from "../../modules/colorPicker.svelte";

const colorPicker = ColorPicker.GetSingleton()




</script>
<Modal width={800} height={600} title="Color picker" bind:this={colorPicker.modal} onclose={colorPicker.CloseEvent()}>
    <div class="row container" style="--color-picker-color:{colorPicker.red},{colorPicker.green},{colorPicker.blue};--color-picker-alpha:{colorPicker.alpha/255}">
        <div class="column">
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="color-picker-container"   style="--sv-color-picker-color:{colorPicker.svRed},{colorPicker.svGreen},{colorPicker.svBlue};">
                <div class="sb-box" onmousedown={colorPicker.svPicker.mouseDownEvent()}>
                    <div class="sb-circle" bind:this={colorPicker.svPicker.cursorElement}></div>
                </div>
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div class="hue-box" onmousedown={colorPicker.huePicker.mouseDownEvent()}>
                    <div class="hue-bar" bind:this={colorPicker.huePicker.cursorElement}></div>
                </div>
    
            </div>
                <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="trackbar-container" style="width:calc(100% - 20px);margin:10px;"  onmousedown={colorPicker.alphaPicker.mouseDownEvent()}>
                <div class="checker-small"></div>
                <div class="trackbar-foreground" ></div>
                <div class="alpha-bar"  bind:this={colorPicker.alphaPicker.cursorElement}></div>
            </div>
        </div>
        <div class="row color-picker-row h-center">
            <div class="col">
                <div class="input-group">
                    <label>Hue</label>
                    <input  bind:value={colorPicker.hue} type="text" class="input"/>
                </div>

                <div class="input-group">
                    <label>Saturation</label>
                    <input bind:value={colorPicker.saturation}  type="text" class="input"/>
                </div>

                <div class="input-group">
                    <label>Brightness</label>
                    <input bind:value={colorPicker.brightness} type="text" class="input"/>
                </div>
                <div class="input-group" style="position:relative">
                    <label>Hex</label>
                    <div class="hashtag">#</div>
                    <input bind:value={colorPicker.hex} oninput={e=>colorPicker.setHex(e.target.value)} type="text" class="input"/>
                </div>
            </div>
            <div class="col">
                <div class="input-group">
                    <label>Red</label>
                    <input bind:value={colorPicker.red} oninput={e=>colorPicker.updateRGB()} type="text" class="input"/>
                </div>

                <div class="input-group">
                    <label>Green</label>
                    <input bind:value={colorPicker.green} oninput={e=>colorPicker.updateRGB()} type="text" class="input"/>
                </div>

                <div class="input-group">
                    <label>Blue</label>
                    <input  bind:value={colorPicker.blue} oninput={e=>colorPicker.updateRGB()} type="text" class="input"/>
                </div>
                <div class="input-group" style="position:relative">
                    <label>Alpha</label>
                    <input bind:value={colorPicker.alpha}  type="text" class="input"/>
                </div>
            </div>
            <div class="color-container" onclick={()=>colorPicker.AddThisColorToHistory()}>
                <div class="checker-small"></div>
                <div class="color-foreground"></div>
            </div>
        </div>
    </div>
    <div class="color-history">
        {#each colorPicker.colorHistory as item (item)}
        <div
            class="color-history-container"
            onmousedown={colorPicker.MouseDownEvent(item)}
            onmouseup={colorPicker.ColorHistoryClickEvent(item)}
            oncontextmenu={colorPicker.ColorHistoryContextMenuEvent(item)}
        >
        <div class="checker-small"></div>
        <div 
        class="color-history-item {item == colorPicker.GetRGBAHex()?"color-history-container-selected":""}" 
        style="--color-history-item-color:#{item};--color-history-item-color-no-alpha:#{item.replace(/.{2}$/gi,"")};" 
        ></div>
        </div>

        {/each}

    </div>
</Modal>


<style>
.color-history-container{
    position: relative;
    width: 30px;
    height: 30px;
    cursor: pointer;
    margin: 2px;
    display: inline-block;
}
.color-history-container-selected{
    outline: 2px dotted var(--text-color);
}
.color-history{
    margin: 10px;
    height: 160px;
    overflow-y: auto;
}

.color-history-item{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: var(--color-history-item-color);
    border: 1px solid var(--color-history-item-color-no-alpha);
}


.sb-box{
    background-image: url("/assets/bright.png");
    background-color: rgb(var(--sv-color-picker-color));
    width:300px;height:300px;
    background-size: 100% 100%;
    position: relative;
}
.hue-box{
    background-image: url("/assets/hue.png");
    background-color: red;
    width:50px;height:300px;
    background-size: 100% 100%;
    position: relative;
}

.color-picker-container{
    display: flex;
    flex-direction: row;
}
.color-picker-container > *{
    margin: 10px;
}


.sb-circle{
    width: 13px;
    height: 13px;
    border-radius: 50%;
    border: 1px solid white;
    transform: translate(-50%, -50%);
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
}
.sb-circle::before{
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    border: 1px solid black;
    padding: 2px;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.hue-bar{
    height: 8px;
    width: 100%;
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid white;; 
    border-radius: 20px;
    pointer-events: none;
}
.hue-bar::before{
    content: "";
    border-radius: 20px;
    width: 100%;
    height: 100%;
    position: absolute;
    border: 1px solid black;
    padding: 2px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.alpha-bar{
    width: 8px;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 0px;
    transform: translate(-50%, -50%);
    border: 1px solid white;; 
    border-radius: 50px;
    pointer-events: none;
}
.alpha-bar::before{
    content: "";
    border-radius: 50px;
    width: 100%;
    height: 100%;
    position: absolute;
    border: 1px solid black;
    padding: 2px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.hashtag{
    position: absolute;
    top: 28px;
    left: 5px;
    color: var(--black);
}


  .trackbar-foreground{
    background: linear-gradient(90deg, rgba(var(--color-picker-color),0) 0%, rgba(var(--color-picker-color),1) 100%);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .trackbar-container{
      width: 100%;
      height: 30px;
      position: relative;
  }

  .color-picker-row{
    flex-direction: row;
    width: 100%;
    flex-wrap: nowrap;
    position: relative;
  }

  .modal-regular{
    left: 0;
    top:0;
    width: 100vw;
    height: 100vh;
    max-width: 800px;
    max-height: 600px;
    position: absolute;
}
.modal-regular > .container{
    background-color: var(--secondary-color);
    border: 5px solid var(--background-color);
}

.color-container{
    cursor: pointer;
    width: 100px;
    height: 100px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 30px;
    border: 5px solid var(--background-color);
}
.color-foreground{
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color: rgba(var(--color-picker-color), var(--color-picker-alpha));
    border:1px solid rgb(var(--color-picker-color));
    z-index: 200;
    position: absolute;
}


</style>

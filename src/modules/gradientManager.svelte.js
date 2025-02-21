import { onMount } from "svelte";
import { DragAxis } from "../lib/dragAxis";
import { ColorPicker } from "./colorPicker.svelte";

import { Manager } from "./manager.svelte";

function cumulativeOffset(element) {
    var top = 0, left = 0;

    let current = element
    do {
        top += current.offsetTop  || 0;
        left += current.offsetLeft || 0;
        current = current.offsetParent;
    } while(current);

    current = element

    do {
        top -= current.scrollTop  || 0;
        left -= current.scrollLeft || 0;
        current = current.parentElement;
    } while(current);

    return [
        top,
        left
    ];
};
class GradientPicker{
    lastPosition = 0
    lastColor = [255, 0, 0, 0]

    position = $state(0)
    color = $state([255, 0, 0, 0])
    element = $state(null)
    tracker = null
    isRemovingCandidate = $state(false)
    constructor(parent) {
        this.axis = new DragAxis("x", 0, 0, 100, -45);
        if(parent){
            this.parent = parent
        }
    }
    DoubleClickEvent(){
        return e =>{
            const colorPicker = ColorPicker.GetSingleton()
            colorPicker.PickColor(this.color, (color)=>{
                this.color = [...color]
                this.parent.oninput?.()
            })
        }

    }
    MouseDownEvent(){
        return e => {
            if(e.shiftKey){
                this.parent.CopyItemEvent(this)(e)
            }
            else{
                if(this.element){
                    this.isRemovingCandidate = false
                    this.axis.SetElement(this.element)
                    const { clientX } = e
                    this.axis.p = this.axis.GetCursorP(clientX, this.position)
                    this.parent.draggingItem = this
                }
            }
        }
    }
    Copy(){
        const result = new GradientPicker()
        result.position = this.position
        result.color = [...this.color]
        return result 
    }
    ContextMenuEvent(){
        return e =>{
            e.preventDefault()
            this.parent.items.splice(this.parent.items.indexOf(this), 1)
        }
    }
    MouseUpEvent(){
        return e =>{
            if(this.isRemovingCandidate){
                this.parent.items.splice(this.parent.items.indexOf(this), 1)
            }
        }
    }
    MouseMoveEvent(){
        return e =>{
            if(this.element){
                const {clientX, clientY} = e
                
                this.position = this.axis.GetPixelsAsValue(clientX)

                const [top, left] = cumulativeOffset(this.element)

                this.isRemovingCandidate = Math.abs(clientY - top) > 100

                this.UpdatePosition()
            }
        }
    }
    UpdatePosition(){

        
        this.axis.SetElement(this.element)
        
        this.position = this.axis.LimitValue(this.position)
        
        this.position = Math.round(this.position)
        
        this.element.style.left = (this.axis.GetValueInPixels(this.position)) + "%"


    }
    UpdateLastPosition(){
        this.lastColor = [...this.color]
        this.lastPosition = this.position
    }
    HasChanged(){
        if(this.position != this.lastPosition){
            this.UpdateLastPosition()
            return true
        }
        for(let i = 0; i < 4; i++){
            if(this.color[i] != this.lastColor[i]){
                this.UpdateLastPosition()
                return true;
            }
        }
        return false
    }
}


class GradientManager{
    draggingItem = $state(null)
    selectedItem = $state(null)
    items = null
    constructor(items, oninput) {
        this.items = items
        document.addEventListener("mousemove", this.MouseMoveEvent())
        document.addEventListener("mouseup", this.MouseUpEvent())
        document.addEventListener('mouseleave',this.MouseUpEvent());

        this.oninput = oninput

        if(this.items.length == 0){
            const black = new GradientPicker(this)
            black.position = 0
            black.color = [0,0,0,255]
            const white = new GradientPicker(this)
            white.position = 100
            white.color = [255,255,255,255]
            this.items.push(black,white)
        }

        $effect(() => {
            for(const item of this.items){
                item.parent = this
                item.UpdatePosition()
                $effect(()=>{
                    const color = item.color
                    item.UpdatePosition(color)
                })
            }
        });

    }
    GetGradient(){
        const result = []
        const items = this.GetItems()
        if(items.length == 1){
            result.push(`rgba(${items[0].color[0]},${items[0].color[1]},${items[0].color[2]},${items[0].color[3]/100}) ${0}%`)
            result.push(`rgba(${items[0].color[0]},${items[0].color[1]},${items[0].color[2]},${items[0].color[3]/100}) ${100}%`)
        }

        for(const item of items){
            result.push(`rgba(${item.color[0]},${item.color[1]},${item.color[2]},${item.color[3]/100}) ${item.position}%`)
        }
        return ` linear-gradient(90deg, ${result.join(",")})`
    }
    GetItems(){
        const result = [...this.items]
        result.sort((a,b)=>a.position - b.position)
        return result
    }
    SetItemColor(item){
        const items = this.GetItems()

        const index = items.indexOf(item)

        if(items.length >= 1){
            if(index == 0){
                for(let i = 0; i < 4; i++){
                    item.color[i] = items[1].color[i]
                }
                return
            }
            if(index == items.length - 1){
                for(let i = 0; i < 4; i++){
                    item.color[i] = items.at(-2).color[i]
                }
                return
            }
        }

        if(items.length >= 2){
            for(let i = 0; i < items.length; i++){
                if(i + 2 < items.length){
                    const current = items[i]
                    const next = items[i+2]
                    if(item.position > current.position && item.position < next.position){
                        const ratio = (item.position - current.position) / (next.position - current.position);
                        for(let i = 0; i < 4; i++){
                            item.color[i] = Math.round(current.color[i] + (next.color[i] - current.color[i]) * ratio)
                        }
                    }
                }
            }
        }
    }

    AddItemEvent(){
        return e=>{
            const item = new GradientPicker(this)
            this.items.push(item)
            setTimeout(()=>{
                item.MouseMoveEvent()(e)
                this.SetItemColor(item)
                this.selectedItem = item
                this.draggingItem = item;
            },0)
        }
    }
    CopyItemEvent(base){
        return e=>{
            const item = new GradientPicker(this)
            item.color = [...base.color]
            this.items.push(item)
            setTimeout(()=>{
                item.MouseMoveEvent()(e)
                this.selectedItem = item
                this.draggingItem = item;
            },0)
        }
    }
    MouseMoveEvent(){
        return e =>{
            if(this.draggingItem ){
                this.draggingItem.MouseMoveEvent()(e)
            }
        }
    }
    MouseUpEvent(){
        return e =>{
            if(this.draggingItem != null){
                this.draggingItem?.MouseUpEvent()(e)
                this.draggingItem = null
                const manage = Manager.GetSingleton()
                manage.updateScreen()
            }
        }
    }
}

export { GradientManager, GradientPicker }


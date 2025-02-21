import {HSVtoRGB, RGBtoHSV, hexToRgb, rgbToHex, clamp, rgbaToHex, hexToRgba} from "../lib/color"
import { DragAxis } from "../lib/dragAxis";
import { ContextMenuManager } from "./contextMenuManager.svelte";
import { Folder } from "./folder.svelte";

class HuePicker {
    constructor(colorPicker){
        this.colorPicker = colorPicker
        this.axis = new DragAxis("y", 20, 360,0);
    }
    cursorElement = null
    cursorSnapDistance = 20

    axis = null

    mouseDownEvent(){
        return e => {
            this.colorPicker.activeEvent = "hue"

            const {clientY, offsetY} = e


            if(this.axis.ShouldSnap(this.colorPicker.hue, offsetY)){
                this.colorPicker.hue = this.axis.DoSnap(offsetY)
            }


            this.axis.p = this.axis.GetCursorP(clientY, this.colorPicker.hue)

            this.update()
        }
    }
    mouseMoveEvent(){
        return e =>{
            if(this.colorPicker.activeEvent == "hue"){
                
                const {clientY} = e
 
                this.colorPicker.hue = this.axis.GetPixelsAsValue(clientY)

                this.update()
            }
        }
    }
    update(){

        this.axis.SetElement(this.cursorElement)

        this.colorPicker.hue = this.axis.LimitValue(this.colorPicker.hue)

        this.colorPicker.hue = Math.round(this.colorPicker.hue)

        this.cursorElement.style.top = this.axis.GetValueInPixels(this.colorPicker.hue)+"%"
    }
}


class AlphaPicker {
    constructor(colorPicker){
        this.colorPicker = colorPicker
        this.axis = new DragAxis("x", 20, 0, 255);
    }
    cursorElement = null
    cursorSnapDistance = 20

    axis = null

    mouseDownEvent(){
        return e => {
            this.colorPicker.activeEvent = "alpha"

            const {clientX, offsetX} = e



            if(this.axis.ShouldSnap(this.colorPicker.alpha, offsetX)){
                this.colorPicker.alpha = this.axis.DoSnap(offsetX)
            }

            this.axis.p = this.axis.GetCursorP(clientX, this.colorPicker.alpha)

            this.update()
        }
    }
    mouseMoveEvent(){
        return e =>{
            if(this.colorPicker.activeEvent == "alpha"){
                
                const {clientX} = e
 
                this.colorPicker.alpha = this.axis.GetPixelsAsValue(clientX)

                this.update()
            }
        }
    }
    update(){
        this.axis.SetElement(this.cursorElement)

        this.colorPicker.alpha = this.axis.LimitValue(this.colorPicker.alpha)

        this.colorPicker.alpha = Math.round(this.colorPicker.alpha)

        this.cursorElement.style.left = this.axis.GetValueInPixels(this.colorPicker.alpha)+"%"
    }
}

class SVPicker {
    constructor(colorPicker){
        this.colorPicker = colorPicker
        this.xAxis = new DragAxis("x", 20, 0, 100);
        this.yAxis = new DragAxis("y", 20, 100, 0);
    }
    cursorElement = null
    cursorSnapDistance = 20

    xAxis = null
    yAxis = null

    mouseDownEvent(){
        return e => {
            this.colorPicker.activeEvent = "sv"

            const {clientY, offsetY, clientX, offsetX} = e
            
            if(
                this.xAxis.ShouldSnap(this.colorPicker.saturation, offsetX) || 
                this.yAxis.ShouldSnap(this.colorPicker.brightness, offsetY))
            {
                this.colorPicker.saturation = this.xAxis.DoSnap(offsetX)
                this.colorPicker.brightness = this.yAxis.DoSnap(offsetY)
            }

            this.xAxis.p = this.xAxis.GetCursorP(clientX, this.colorPicker.saturation)
            this.yAxis.p = this.yAxis.GetCursorP(clientY, this.colorPicker.brightness)

            this.update()
        }
    }
    mouseMoveEvent(){
        return e =>{
            if(this.colorPicker.activeEvent == "sv"){
                
                const {clientY, clientX} = e
 
                this.colorPicker.saturation = this.xAxis.GetPixelsAsValue(clientX)
                this.colorPicker.brightness = this.yAxis.GetPixelsAsValue(clientY)

                this.update()
            }
        }
    }
    update(){
        this.xAxis.SetElement(this.cursorElement)
        this.yAxis.SetElement(this.cursorElement)

        this.colorPicker.saturation = this.xAxis.LimitValue(this.colorPicker.saturation)
        this.colorPicker.brightness = this.yAxis.LimitValue(this.colorPicker.brightness)

        this.colorPicker.saturation = Math.round(this.colorPicker.saturation)
        this.colorPicker.brightness = Math.round(this.colorPicker.brightness)

        this.cursorElement.style.left = this.xAxis.GetValueInPixels(this.colorPicker.saturation)+"%"
        this.cursorElement.style.top = this.yAxis.GetValueInPixels(this.colorPicker.brightness)+"%"
    }
}


let singleton = null;

  
class ColorPicker{

    modal = null
    callback = null

    hue = $state(0)
    alpha = $state(100)
    saturation = $state(0)
    brightness = $state(0)
    red = $state(0)
    green = $state(0)
    blue = $state(0)


    svRed = $state(0)
    svGreen = $state(0)
    svBlue = $state(0)

    hex = $state("000000")

    colorHistory = $state([])

    huePicker = new HuePicker(this)
    alphaPicker = new AlphaPicker(this)
    svPicker = new SVPicker(this)
    activeEvent = null
    static GetSingleton(){
        if(singleton == null){
            singleton = new ColorPicker()
        }
        return singleton
    }

    PickColor(color, callback){
        this.red = color[0]
        this.green = color[1]
        this.blue = color[2]
        this.alpha = color[3]
        this.updateRGB()
        if(this.modal){
            this.callback = callback
            this.modal.open()
        }
        document.addEventListener("mouseup", ()=>{
            this.mouseColor = null
        })
    }

    CloseEvent(){
        return (e)=>{
            if(this.callback){
                this.callback([this.red, this.green, this.blue, this.alpha])
                this.AddThisColorToHistory()
            }
        }
    }
    GetRGBAHex(){
        return rgbaToHex(this.red, this.green, this.blue, this.alpha);
    }
    AddThisColorToHistory(){
        const hex = rgbaToHex(this.red, this.green, this.blue, this.alpha)
        if(!this.colorHistory.includes(hex)){
            this.colorHistory.push(hex)
        }
    }
    ColorHistoryContextMenuEvent(color){
        return e =>{
            e.preventDefault()
            const cm = ContextMenuManager.GetSingleton()
            const options = [
                new Folder("Base Channels"),
                "Copy All",
                "Copy Color",
                "Copy Alpha",
                new Folder("HSV Channels"),
                "Copy Hue",
                "Copy Saturation Value",
                "Copy Saturation",
                "Copy Value",
                new Folder("Delete"),
                "Delete"
            ]
            cm.Open(options, x => {

                if(x == "Delete"){
                    this.colorHistory.splice(this.colorHistory.indexOf(color),1)
                    return
                }
                if(x == "Copy All"){
                    this.SetColorFromRGBAHEX(color)
                    return
                }
                if(x == "Copy Color"){
                    this.SetColorFromRGBHEX(color)
                    return
                }
                const rgb = hexToRgba(color)
                const red = rgb[0]
                const green = rgb[1]
                const blue = rgb[2]
                const alpha = rgb[3]
                const [hue, saturation, brightness] = RGBtoHSV(red, green,blue)
                if(x == "Copy Hue"){
                    this.hue = hue * 360
                    this.huePicker.update();
                }
                if (x == "Copy Saturation" || x == "Copy Saturation Value"){
                    this.saturation = saturation * 100
                }
                if (x == "Copy Value" || x == "Copy Saturation Value"){
                    this.brightness = brightness * 100
                }
                if (x == "Copy Saturation" || x == "Copy Value" || x == "Copy Saturation Value"){
                    this.svPicker.update();
                }
                if (x == "Copy Alpha"){
                    this.alpha = alpha
                    this.alphaPicker.update();
                }

            })
        }
    }
    MouseDownEvent(color){
        return e =>{
            this.mouseButton = e.button
            this.mouseColor = color
        }
    }
    ColorHistoryClickEvent(color){
        return e =>{

            if(this.mouseColor != color){
                return
            }


            if(this.mouseButton == 0){
                this.SetColorFromRGBAHEX(color)
            } else if(this.mouseButton == 1){
                this.colorHistory.splice(this.colorHistory.indexOf(color),1)
            }
        }
    }

    SetColorFromRGBAHEX(rgbaHex){
        const rgb = hexToRgba(rgbaHex)
        this.red = rgb[0]
        this.green = rgb[1]
        this.blue = rgb[2]
        this.alpha = rgb[3]
        const [hue, saturation, brightness] = RGBtoHSV(this.red, this.green,this.blue)
        this.hue = hue * 360
        this.saturation = saturation * 100
        this.brightness = brightness * 100
        this.svPicker.update();
        this.alphaPicker.update();
        this.huePicker.update();
    }
    SetColorFromRGBHEX(rgbaHex){
        const rgb = hexToRgba(rgbaHex)
        this.red = rgb[0]
        this.green = rgb[1]
        this.blue = rgb[2]
        const [hue, saturation, brightness] = RGBtoHSV(this.red, this.green,this.blue)
        this.hue = hue * 360
        this.saturation = saturation * 100
        this.brightness = brightness * 100
        this.svPicker.update();
        this.alphaPicker.update();
        this.huePicker.update();
    }
    mouseUp(e){
        this.activeEvent = null
    }

    mouseMove(e){
        this.huePicker.mouseMoveEvent()(e)
        this.alphaPicker.mouseMoveEvent()(e)
        this.svPicker.mouseMoveEvent()(e)
    }
    setHex(value){
        const rgb = hexToRgb(value)
        
        if(rgb == null){
            return
        }

        this.hex = value
        const [red, blue, green] = rgb
        // this.red = red
        // this.blue = blue
        // this.green = green
        const [hue, saturation, brightness] = RGBtoHSV(red, blue, green)
        this.hue = hue * 360
        this.saturation = saturation * 100
        this.brightness = brightness * 100
    }
    updateRGB(){

        const [lastRed,lastGreen,lastBlue] = HSVtoRGB(this.hue/360, this.saturation/100, this.brightness/100)


        this.red = clamp(Number(this.red), 0, 255) ?? lastRed
        this.green = clamp(Number(this.green), 0, 255) ?? lastGreen
        this.blue = clamp( Number(this.blue), 0, 255) ?? lastBlue

        const [hue, saturation, brightness] = RGBtoHSV(this.red, this.green,this.blue)

        this.hue = hue * 360
        this.saturation = saturation * 100
        this.brightness = brightness * 100
    }
    constructor() {
        document.addEventListener("mousemove", e => this.mouseMove(e))
        document.addEventListener("mouseup", e => this.mouseUp(e))
        document.addEventListener('mouseleave',e => this.mouseUp(e));

        $effect(()=>{
            const [svRed,svGreen,svBlue] = HSVtoRGB(this.hue/360, 1, 1)
            this.svRed = svRed
            this.svGreen = svGreen
            this.svBlue = svBlue
        })
        $effect(()=>{
            const [red,green,blue] = HSVtoRGB(this.hue/360, this.saturation/100, this.brightness/100)
            this.red = red
            this.blue = blue
            this.green = green
            this.hex = rgbToHex(red, green, blue)
            this.svPicker.update();
            this.alphaPicker.update();
            this.huePicker.update();
        })
    }
}

export { ColorPicker }
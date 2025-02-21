import { ListItem } from "./listManager.svelte";
import { createCompositionRenderer } from "../application/renderer.svelte";
import { copyCanvas, createThumbnail } from "../lib/image-generation";
import { Composition } from "./composition.svelte";
import { guid } from "../lib/guid";
import { Manager } from "./manager.svelte";
import { createNormalRenderer } from "../application/normalRenderer.svelte";

import { RenderingContext } from "./renderingContext.svelte";
class Layer extends ListItem{
    name = $state("")
    visible = $state(true)
    alpha = $state(100)
    maskGroup = $state(null)
    blendMode = $state(null)
    file = $state(null)
    fileMask = $state(null)
    blurMask = $state(null)
    thumbnail = $state(null)
    gradientMapColors = $state([])
    enableGradientMap = $state(false)
    
    blurAmount = $state(0)
    saturation = $state(1)
    contrast = $state(1)
    brightness = $state(0)
    scale = $state(100)
    hue = $state(0)
    colorize = $state(false)
    invert = $state(false)

    enableR = $state(true)
    enableG = $state(true)
    enableB = $state(true)

    enableH = $state(false)
    enableS = $state(false)
    enableV = $state(false)

    horizontalAlignment = $state({name:"Center", value:1})
    verticalAlignment = $state({name:"Center", value:1})
    tile = $state(true)
    xOffset = $state(0)
    yOffset = $state(0)

    canvas = document.createElement("canvas")

    renderingContext = new RenderingContext(false)
    constructor(name) {
        super();
        if(name == null){
            return
        }
        this.id = guid()
        this.name = name
    }

    static CreateFromFile(file){
        let layer = new Layer(file.name)
        layer.thumbnail = file.thumbnail
        layer.file = file
        return layer
    }
    ResetBlurAmount(){
        this.blurAmount = 0
    }
    ResetSaturation(){
        this.saturation = 1
    }
    ResetContrast(){
        this.contrast = 1
    }
    ResetBrightness(){
        this.brightness = 0
    }
    ResetScale(){
        this.scale = 100
    }
    ResetHue(){
        this.hue = 0
    }
    ResetAlpha(){
        this.alpha = 100
    }
    ResetColorize(){
        this.colorize = false
    }
    ResetAdjustments(){
        this.blurAmount = 0
        this.saturation = 1
        this.contrast = 1
        this.brightness = 0
        this.scale = 100
        this.alpha = 100
        this.hue = 0
        this.colorize = false
        this.blendMode = null
        this.invert = false
        this.enableGradientMap = false
        this.gradientMapColors = []
    }
    CreateThumbnail(canvas){
        this.thumbnail = createThumbnail(canvas, {width:40, height:40})
    }
    Contains(file){
        if(this.file && this.file instanceof Composition){
            for(const layer of this.file.layers){
                if(layer.Contains(file)){
                    return true
                }
            }
        }
        return this.file != null && this.file == file
    }
    Copy(){
        const result = new Layer();
        result.blurAmount = this.blurAmount
        result.saturation = this.saturation
        result.contrast = this.contrast
        result.brightness = this.brightness
        result.scale = this.scale
        result.alpha = this.alpha
        result.hue = this.hue
        result.colorize = this.colorize
        result.maskGroup = this.maskGroup
        result.fileMask = this.fileMask
        result.blurMask = this.blurMask
        result.blendMode = this.blendMode
        result.file = this.file
        result.thumbnail = this.thumbnail
        result.name = this.name
        result.invert = this.invert
        result.enableGradientMap = this.enableGradientMap 
        result.gradientMapColors = this.gradientMapColors.map(x=>x.Copy())
        result.thumbnail = this.thumbnail
        result.enableR = this.enableR
        result.enableG = this.enableG
        result.enableB = this.enableB
        result.enableH = this.enableH
        result.enableS = this.enableS
        result.enableV = this.enableV
        return result
    }
    RenderAsync(maxSize){
        this.renderingContext.Lock(async ()=>{
            await this.renderingContext.InitRendererAsync()
            
            const manager = Manager.GetSingleton()
            const size = {width:this.file.image.width, height:this.file.image.height, maxSize}
            await this.renderingContext.Render(manager.selectedFile, [this], true, size, manager.selectedFile)
            const canvas = this.renderingContext.GetCanvas(manager.selectedFile)
            copyCanvas(canvas, this.canvas)
            this.CreateThumbnail(this.canvas)
        })
    }
}

export { Layer }
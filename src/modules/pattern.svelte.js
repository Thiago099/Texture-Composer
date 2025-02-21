import { ListItem } from "./listManager.svelte";
import { renderColorToCanvas, createThumbnail, renderGradientToCanvas, renderRadialGradientToCanvas, copyCanvas } from "../lib/image-generation";
import { guid } from "../lib/guid";
import { GradientPicker } from "./gradientManager.svelte";
import { RenderTarget } from "./renderingContext.svelte";
import { createNoiseRenderer } from "../application/noiseRenderer.svelte";
import { Singleton } from "../lib/singleton.js";
import { rgbaToHex } from "../lib/color";

const noiseTarget = new Singleton(RenderTarget, createNoiseRenderer);
class Pattern extends ListItem{
    id = null
    fillType = $state({name:"Color", value:"color"})
    name = $state("Pattern")
    thumbnail = $state(null)
    color = $state([255,255,255,255])
    gradient = $state([])
    x1 = $state(0.5)
    y1 = $state(0.5)
    angle = $state(-90)
    radios = $state(1)

    scale = $state(10)
    time = $state(0)
    octaves = $state(6)
    persistence = $state(0.5)

    disturbance = $state(0.8)
    contrast = $state(1.2)

    canvas = document.createElement("canvas")

    version = 1
    noiseTarget = noiseTarget.GetSingleton()
    constructor(name, fillType = null) {
        super();
        this.image = this.canvas
        if(fillType != null){
            this.fillType = fillType
        }
        if(name){
            this.name = name
            this.id = guid()
            this.Render(64,64, true)
        }
    }
    get type(){
        return "pattern"
    }
    GetGradientReplaced(fileSource = null){
        const gradientArray = []
        for(const item of this.gradient){
            const color = fileSource ? fileSource.GetColor(item.color) : item.color
            gradientArray.push({
                color,
                position: item.position
            })
        }

        return gradientArray
    }
    Copy(){
        var result = new Pattern(this.name, this.fillType)
        result.thumbnail = this.thumbnail
        result.id = guid()
        result.color = this.color
        result.gradient = this.gradient?.map(x=>{
            const picker = new GradientPicker()
            picker.position = x.position
            picker.color = [...x.color]
            return picker    
        })
        result.x1 = this.x1
        result.y1 = this.y1
        result.angle = this.angle
        result.radios = this.radios
        return result
    }
    Contains(){
        return false;
    }
    GetUniqueColors(){
        const result = new Set()
        if(this.fillType.value == "color"){
            result.add(rgbaToHex(...this.color))
        } 
        else if(["linearGradient", "radialGradient", "perlinNoise", "voronoiNoise", "grainNoise"].includes(this.fillType.value)){
            for(const gradientItem of this.gradient){
                result.add(rgbaToHex(...gradientItem.color))
            }
        }
        return Array.from(result)
    }
    async Render(width = 800, height = 800, thumb = false, fileSource = null){

        width = Math.max(width, 1)
        height = Math.max(height, 1)


        let gradient = []

        const color = fileSource ? fileSource.GetColor(this.color) : this.color

        if(this.gradient.length > 0){
            gradient = this.GetGradientReplaced(fileSource)
        }
        else{
            const black = {}
            black.position = 0
            black.color = [0,0,0,255]
            const white = {}
            white.position = 100
            white.color = [255,255,255,255]
            gradient.push(black,white)
        }

        const noises = ["perlinNoise", "voronoiNoise", "grainNoise"]

        let image = null
        if(this.fillType.value == "color"){
            image= renderColorToCanvas(color, width, height)
        } else if (this.fillType.value == "linearGradient"){
            image= renderGradientToCanvas({
                x1: this.x1,
                y1: this.y1,
                radios: this.radios,
                angle: this.angle
            }, gradient, width, height)
        }
        else if (this.fillType.value == "radialGradient"){
            image= renderRadialGradientToCanvas({
                x1: this.x1,
                y1: this.y1,
                radios: this.radios
            }, gradient, width, height)
        } else if (noises.includes(this.fillType.value)){
            await this.noiseTarget.InitRendererAsync()
            const noiseData =  {
                scale:this.scale, 
                time:this.time, 
                octaves:this.octaves, 
                persistence:this.persistence,
                disturbance: this.disturbance,
                contrast:this.contrast,
                noiseType: noises.indexOf(this.fillType.value)
            }
            await this.noiseTarget.renderer.Render(gradient,noiseData, width, height)
            image = this.noiseTarget.canvas
        }
        
        copyCanvas(image, this.image)
        this.canvas = this.image
        if(thumb){
            this.thumbnail = createThumbnail(this.image, {width:40, height:40})
        }
        this.version ++
    }
}

export { Pattern }

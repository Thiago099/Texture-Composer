import { getUniqueColors } from "../lib/get-unique-colors";
import { copyCanvas, createBlackImageAsync, createThumbnail } from "../lib/image-generation";
import { ListItem } from "./listManager.svelte";
import { ImageFile } from "./imageFile.svelte";
import { Layer } from "./layer.svelte";
import { guid } from "../lib/guid";
import { hexToRgb, hexToRgba, rgbaToHex, rgbToHex } from "../lib/color";

import { Pattern } from "./pattern.svelte";

import { RenderingContext } from "./renderingContext.svelte";
import { CompositionReference } from "./compositionReference.svelte";


class Composition extends ListItem {
    layers = $state([])
    selectedLayer = $state(null)
    name = $state("")
    thumbnail = $state(null)
    file = $state(null)
    colors = $state(null)
    image = null



    renderingContext = new RenderingContext()

    version = 1
    convertToNormal = $state(false)
    normalStrength = $state(10)

    constructor(name) {
        super();
        if(!name){
            return
        }
        this.name = name
        this.id = guid()
        this.RenderAsync()
    }


    BuildFileCache(){

    }
    GetFile(file){
        return file
    }
    GetColor(color){
        return color
    }
    AddLayer(index, layer){
        this.layers.splice(index, 0, Layer.CreateFromFile(layer))
        this.selectedLayer = this.layers[index]
    }
    CopyLayer(index){
        this.layers.splice(index, 0, this.layers[index].Copy())
        this.selectedLayer = this.layers[index]
    }
    CreateReference(name){
        return new CompositionReference(this, name)
    }
    Copy(){
        const result = new Composition()
        result.layers = this.layers.map(x=>x.Copy())
        result.thumbnail = this.thumbnail
        result.colors = this.colors
        result.file = this.file
        result.name = this.name
        result.image = this.image
        result.convertToNormal = this.convertToNormal
        result.normalStrength = this.normalStrength
        result.selectedLayer = result.layers[this.layers.indexOf(this.selectedLayer)]
        return result
    }
    CreateThumbnail(canvas){
        this.thumbnail = createThumbnail(canvas, {width:40, height:40})
    }
    Contains(file){
        for(const layer of this.layers){
            if(layer.Contains(file)){
                return true
            }
        }
        return file == this
    }
    GenerateMask(){
        this.colors = getUniqueColors(this.file.image)
    }
    CalculateSize(source, width, height){
        
        let mask = this

        do{
            mask = source.GetFile(mask.file ?? mask.layers.at(-1)?.file)
        }
        while(mask instanceof Composition)

        if(mask && !(mask instanceof Pattern)){
            width = mask.image.width
            height = mask.image.height
        }

        width = Math.max(1, width)
        height = Math.max(1, height)
        
        return [width, height]
    }
    async RenderAsync(maxSize, originalWidth = null, originalHeight = null, createThumbnail = true){


        if(this.layers.length == 0){
            return
        }
        
        const [width, height] = this.CalculateSize(this, originalWidth, originalHeight)

        if(maxSize === null){
            maxSize = Math.max(width, height)
        }

        for(const layer of this.layers){

            const scale = layer.scale / 100

            if(layer.file instanceof Composition){
                await layer.file.RenderAsync(maxSize * scale, width * scale, height * scale, false)
            }
            if(layer.fileMask instanceof Composition){
                await layer.fileMask.RenderAsync(maxSize * scale, width * scale, height * scale, false)
            }
            if(layer.blurMask instanceof Composition){
                await layer.blurMask.RenderAsync(maxSize * scale, width * scale, height * scale, false)
            }
        }
            
        await this.renderingContext.Lock(async ()=>{
            await this.renderingContext.InitRendererAsync();
    
            const size = { width, height, maxSize }
    
            await this.renderingContext.Render(this, this.layers, false, size, this)
    
            const canvas = this.renderingContext.GetCanvas(this)
    
            copyCanvas(canvas, this.canvas)
            
            if(createThumbnail){
                this.CreateThumbnail(this.canvas)
            }
    
            this.image = this.canvas
            this.version++
        });

    }

    canvas =  document.createElement("canvas")
    outputCanvas =  document.createElement("canvas")

    GetCanvas(){
        return this.canvas;
    }

    GetUniqueFiles(){
        const result = new Set()
        function GetUniqueFiles(composition){
            if(composition.file){
                result.add(composition.file)
            }
            for(const layer of composition.layers){
                if(layer.file){
                    if(layer.file instanceof Composition){
                        GetUniqueFiles(layer.file)
                    }
                    else{
                        result.add(layer.file)
                    }
                }
                if(layer.fileMask){
                    result.add(layer.fileMask)
                }
                if(layer.blurMask){
                    result.add(layer.blurMask)
                }
            }
        }
        GetUniqueFiles(this)
        return Array.from(result)
    }
    GetUniqueColors(){
        const result = new Set()
        for(const layer of this.layers){
            if(layer.gradientMapColors){
                for(const gradientItem of layer.gradientMapColors){
                    result.add(rgbaToHex(...gradientItem.color))
                }
            }
            if(layer.file instanceof Pattern || layer.file instanceof Composition){
                for(const item of layer.file.GetUniqueColors()){
                    result.add(item)
                }
            }
            if(layer.fileMask instanceof Pattern ||layer.fileMask instanceof Composition ){
                for(const item of layer.fileMask.GetUniqueColors()){
                    result.add(item)
                }
            }
            if(layer.blurMask instanceof Pattern ||layer.fileMask instanceof Composition ){
                for(const item of layer.blurMask.GetUniqueColors()){
                    result.add(item)
                }
            }
        }
        return Array.from(result)
    }
    ReplaceFile(oldFile, newFile){
        for(const layer of this.layers){
            if(layer.file == oldFile){
                layer.file = newFile
            }
            if(layer.fileMask == oldFile){
                layer.fileMask = newFile
            }
            if(layer.blurMask == oldFile){
                layer.blurMask = newFile
            }
        }
    }
    updateAllLayers(){
        for(const layer of this.layers){
            layer.RenderAsync(300)
        }
    }
    getSelectedLayerIndex(){
        return this.layers.indexOf(this.selectedLayer)
    }

}

export { Composition }
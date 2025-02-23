import { hexToRgba, rgbaToHex } from "../lib/color"
import { guid } from "../lib/guid"
import { copyCanvas, createThumbnail } from "../lib/image-generation"
import { Composition } from "./composition.svelte"
import { ListItem } from "./listManager.svelte"

class CompositionColorSwap{
    color = $state(null)
    constructor(color) {
        if(!color){
            return
        }
        this.color = hexToRgba(color)
        this.baseColor = color
    }
    Copy(){
        const result = new CompositionColorSwap()
        result.color = this.color
        result.baseColor = this.baseColor
        return result
    }
}

class CompositionTextureSwap{
    file = $state(null)
    baseFile = $state(null)
    constructor(file) {
        if(!file){
            return
        }
        this.file = file
        this.baseFile = file
    }
    Copy(){
        const result = new CompositionTextureSwap()
        result.file = this.file
        result.baseFile = this.baseFile
        return result
    }
}

class CompositionReference extends ListItem{
    files = $state([])
    colors = $state([])
    enabled = $state(true)
    base = $state(null)
    name = $state("")
    thumbnail = $state(null)
    preview = $state(null)
    constructor(base, name) {
        super()
        if(name){
            this.name = name
        }
        if(base){
            this.base = base
            this.Load()
        }
        this.id = guid()
    }
    async Render(maxSize = null){
        const self = this

        this.BuildFileCache()

        async function Render(comp, maxSize, originalWidth=null, originalHeight=null){
            const [width, height] = comp.CalculateSize(self, originalWidth, originalHeight)

            if(maxSize === null){
                maxSize = Math.max(width, height)
            }

            for(const layer of comp.layers){

                const scale = (layer.scale / 100)

                if(layer.file instanceof Composition){
                    await Render(layer.file, maxSize ? maxSize * scale : null, width * scale, height * scale)
                }
                if(layer.fileMask instanceof Composition){
                    await Render(layer.fileMask, maxSize ? maxSize * scale : null, width * scale, height * scale)
                }
                if(layer.blurMask instanceof Composition){
                    await Render(layer.blurMask, maxSize ? maxSize * scale : null, width * scale, height * scale)
                }
            }

            const size = { width, height, maxSize }

            await comp.renderingContext.Lock(async ()=>{
                await comp.renderingContext.InitRendererAsync();
                await comp.renderingContext.Render(comp, comp.layers, false, size, self)
                copyCanvas(comp.renderingContext.GetCanvas(comp), comp.outputCanvas)
                comp.image = comp.outputCanvas
            })
    
        }

        await Render(this.base, maxSize, 1024, 1024)
    }
    
    GetCanvas(){
        if(this.base.convertToNormal){
            return this.base.normalCanvas
        }
        return this.base.canvas
    }

    BuildFileCache(){
        this.fileDictionary = {}
        this.colorDictionary = {}
        for(const item of this.files){
            this.fileDictionary[item.baseFile.id] = item.file
        }
        for(const item of this.colors){
            this.colorDictionary[item.baseColor] = item.color
        }
    }
    get file(){
        return this.base?.file;
    }
    GetFile(file){
        if(file == null){
            return file
        }
        if(file.id in this.fileDictionary){
            file = this.fileDictionary[file.id]
        }
        return file
    }
    GetColor(color){
        const hex = rgbaToHex(...color)
        if(hex in this.colorDictionary){
            return this.colorDictionary[hex]
        }
        return color
    }
    Load(){
        this.files = this.base.GetUniqueFiles()?.map(x=>new CompositionTextureSwap(x))
        this.colors = this.base.GetUniqueColors()?.map(x=>new CompositionColorSwap(x))
        this.UpdatePreview()
    }
    Copy(){
        const result = new CompositionReference()
        result.name = this.name
        result.files = this.files.map(x=>x.Copy())
        result.colors = this.colors.map(x=>x.Copy())
        result.enabled = this.enabled
        result.base = this.base
        result.thumbnail = this.thumbnail
        result.preview = this.preview
        return result
    }
    async UpdatePreview(){
        await this.Render(500)
        const canvas = this.base.renderingContext.GetCanvas(this.base)
        if(this.base.thumbnail){
            this.thumbnail = await createThumbnail(canvas,{width:40, height:40})
            this.preview = canvas.toDataURL("image/png")
        }
    }
}

export { CompositionReference, CompositionColorSwap , CompositionTextureSwap}
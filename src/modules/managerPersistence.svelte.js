
import { Manager, ImageFile, Composition, Layer } from "./manager.svelte";
import { GradientManager, GradientPicker } from "./gradientManager.svelte";
import { hexToRgb, rgbToHex } from "../lib/color";

import { RenderManager } from "./renderManager.svelte";
import { CompositionColorSwap, CompositionReference, CompositionTextureSwap } from "./compositionReference.svelte";
import { Folder } from "./folder.svelte";
import { Pattern } from "./pattern.svelte";

import { ColorPicker } from "./colorPicker.svelte";

import { ZipReader, ZipWriter } from "../lib/zip";

class ManagerPersistence {
  static Save(fileName) {
    const manager = Manager.GetSingleton()
    const renderManager = RenderManager.GetSingleton()
    const writter = new ZipWriter()
    const files = []
    const outputs = []
    for (const item of manager.files) {
      if (item instanceof ImageFile) {
        writter.WriteImage(item.id + item.extension, item.image.src)
        writter.WriteImage(item.id + "_thumb" + item.extension, item.thumbnail)
        files.push({
            type: "image",
            id:item.id,
            name: item.name,
            extension: item.extension
        })
      } else if(item instanceof Composition){

        const layers = []
        for(const layer of item.layers){
            writter.WriteImage(layer.id + "_thumb.png", layer.thumbnail)
            layers.push({
                id:layer.id,
                name: layer.name,
                visible: layer.visible,
                alpha: layer.alpha,
                maskGroup: layer.maskGroup,
                blendMode: layer.blendMode,
                file: layer.file?.id,
                fileMask: layer.fileMask?.id,
                blurMask: layer.blurMask?.id,
                gradientMapColors: layer.gradientMapColors?.map(x=>{return{
                    position:x.position,
                    color: [...x.color]
                }}),
                enableGradientMap: layer.enableGradientMap,
                blurAmount: layer.blurAmount,
                saturation: layer.saturation,
                contrast: layer.contrast,
                brightness: layer.brightness,
                scale: layer.scale,
                hue: layer.hue,
                colorize: layer.colorize,
                invert: layer.invert,
                enableR: layer.enableR,
                enableG: layer.enableG,
                enableB: layer.enableB,
                enableH: layer.enableH,
                enableS: layer.enableS,
                enableV: layer.enableV,

                horizontalAlignment: layer.horizontalAlignment,
                verticalAlignment: layer.verticalAlignment,
                tile: layer.tile,
                xOffset: layer.xOffset,
                yOffset: layer.yOffset
            })
        }
        writter.WriteImage(item.id + "_thumb.png", item.thumbnail)
        files.push({
            type: "composition",
            id: item.id,
            name: item.name,
            convertToNormal: item.convertToNormal,
            directXNormal: item.directXNormal,
            normalStrength: item.normalStrength,
            file:item.file?.id,
            colors: item.colors?[...item.colors]:null,
            layers
        })
      }
      else if(item instanceof Folder){
        files.push({
            type: "folder",
            name: item.name,
            open: item.open,
            openCtx: item.openCtx
        })
      } 
      else if(item instanceof Pattern){
        writter.WriteImage(item.id + "_thumb.png", item.thumbnail)
        files.push({
            type: "pattern",
            name: item.name,
            color: item.color,
            gradient: item.gradient?.map(x=>{return{
                position:x.position,
                color: [...x.color]
            }}),
            fillType: item.fillType,
            x1: item.x1,
            y1: item.y1,
            angle: item.angle,
            radios: item.radios,
            id: item.id,
            scale: item.scale,
            time:item.time,
            octaves: item.octaves,
            persistence: item.persistence,
            disturbance: item.disturbance,
            contrast: item.contrast
        })
      } 
    }


    for(const item of renderManager.outputs){

        const files = []
        const colors = []


        writter.WriteImage(item.id + "_thumb.png", item.thumbnail)
        
        for(const file of item.files){
            files.push({
                file: file.file == null ? null : file.file.id,
                baseFile: file.baseFile == null ? null : file.baseFile.id
            })
        }

        for(const color of item.colors){
            colors.push({
                color: color.color,
                baseColor: color.baseColor
            })
        }

        outputs.push({
            files,
            colors,
            enabled: item.enabled,
            name: item.name,
            id: item.id,
            base: item.base?.id
        })
    }
    const colorPicker = ColorPicker.GetSingleton()
    const colorHistory= colorPicker.colorHistory

    writter.WriteObject("data", {
        projectName: manager.projectName,
        files, 
        outputs, 
        colorHistory
    })
    writter.Download(fileName + ".tcx")

  }
  static Load(file = null) {
    const manager = Manager.GetSingleton()
    const renderManager = RenderManager.GetSingleton()

    ZipReader.CreateAsync(file)
    .then(async zip=>{
        
        const data = await zip.GetObject("data")
        
        if(data == null){
            return
        }
        
        manager.files = []
        manager.selectedFile = null

        const outputs = []
        const files = []

        const fileDict = {}

        for(const item of data.files){
            if(item.type == "image"){
                const [file, image] = await zip.GetImage(item.id + item.extension)
                const thumbnail = await zip.GetImageDataUrl(item.id + "_thumb" + item.extension)
                const imageFile = new ImageFile()
    
                imageFile.id = item.id
                imageFile.extension = item.extension
                imageFile.name = item.name
                imageFile.image = image
                imageFile.thumbnail = thumbnail
    
                fileDict[imageFile.id] = imageFile
            }else if(item.type == "pattern"){

                const pattern = new Pattern()

                pattern.thumbnail = await zip.GetImageDataUrl(item.id + "_thumb.png")

                pattern.color = item.color
                pattern.id = item.id
                pattern.canvas = document.createElement("canvas")

                pattern.fillType = item.fillType
                pattern.gradient = item.gradient?.map(x=>{
                    const picker = new GradientPicker()
                    picker.position = x.position
                    picker.color = [...x.color]
                    return picker    
                })
                pattern.x1 = item.x1
                pattern.y1 = item.y1
                pattern.angle = item.angle
                pattern.radios = item.radios

                pattern.scale = item.scale
                pattern.time = item.time
                pattern.octaves = item.octaves
                pattern.persistence = item.persistence
                pattern.disturbance = item.disturbance
                pattern.contrast = item.contrast
                pattern.name = item.name

                fileDict[pattern.id] = pattern
            } 
            else if(item.type == "composition"){
                const compositionFile = new Composition()
                compositionFile.thumbnail = await zip.GetImageDataUrl(item.id + "_thumb.png")
                compositionFile.name = item.name
                compositionFile.id = item.id
                compositionFile.canvas = document.createElement("canvas")
                compositionFile.image = compositionFile.canvas 
                compositionFile.colors = item.colors?[...item.colors]:null
                compositionFile.convertToNormal = item.convertToNormal
                compositionFile.directXNormal = item.directXNormal
                compositionFile.normalStrength = item.normalStrength
                fileDict[compositionFile.id] = compositionFile
            }
        }
        for(const item of data.files){
            if(item.type == "image"){
                files.push(fileDict[item.id])
            } else if (item.type == "composition"){

                const compositionFile = fileDict[item.id]
                compositionFile.file = item.file?fileDict[item.file]:null

                for(const layerItem of item.layers){
    
                    const layer = new Layer()
                    layer.thumbnail = await zip.GetImageDataUrl(layerItem.id + "_thumb.png")
                    layer.id =layerItem.id
                    layer.name = layerItem.name
                    layer.visible = layerItem.visible
                    layer.alpha = layerItem.alpha
                    layer.maskGroup = layerItem.maskGroup
                    layer.blendMode = layerItem.blendMode
                    layer.file = layerItem.file == null ? null : fileDict[layerItem.file]
                    layer.fileMask = layerItem.fileMask == null ? null : fileDict[layerItem.fileMask]
                    layer.blurMask = layerItem.blurMask == null ? null : fileDict[layerItem.blurMask]
                    layer.gradientMapColors = layerItem.gradientMapColors?.map(x=>{
                        const picker = new GradientPicker()
                        picker.position = x.position
                        picker.color = [...x.color]
                        return picker    
                    })
                    layer.enableGradientMap = layerItem.enableGradientMap
                    layer.blurAmount = layerItem.blurAmount
                    layer.saturation = layerItem.saturation
                    layer.contrast = layerItem.contrast
                    layer.brightness = layerItem.brightness
                    layer.scale = layerItem.scale
                    layer.hue = layerItem.hue
                    layer.colorize = layerItem.colorize
                    layer.invert = layerItem.invert
                    layer.enableR = layerItem.enableR
                    layer.enableG = layerItem.enableG
                    layer.enableB = layerItem.enableB
                    layer.enableH = layerItem.enableH
                    layer.enableS = layerItem.enableS
                    layer.enableV = layerItem.enableV

                    layer.horizontalAlignment = layerItem.horizontalAlignment,
                    layer.verticalAlignment = layerItem.verticalAlignment,
                    layer.tile = layerItem.tile,
                    layer.xOffset = layerItem.xOffset,
                    layer.yOffset = layerItem.yOffset
    
                    compositionFile.layers.push(layer)
                }
    
                files.push(compositionFile)
            } else if(item.type == "folder"){
                const folder = new Folder();
                folder.name = item.name;
                folder.open = item.open;
                folder.openCtx = item.openCtx;
                files.push(folder)
            }else if(item.type == "pattern"){
                files.push(fileDict[item.id])
            } 
        }

        if(data.outputs){
            for(const item of data.outputs){
                const output = new CompositionReference()
                output.id = item.id
                output.name = item.name
                output.enabled = item.enabled ?? true
                output.base = fileDict[item.base]

                output.thumbnail = await zip.GetImageDataUrl(output.id + "_thumb.png")

                for(const file of item.files){

                    const current = new CompositionTextureSwap()
                    current.file = file.file == null ? null : fileDict[file.file]
                    current.baseFile = file.baseFile == null ? null : fileDict[file.baseFile]
                    output.files.push(current)
                }
        
                for(const color of item.colors){
                    const current = new CompositionColorSwap()
                    current.color = color.color
                    current.baseColor = color.baseColor
                    output.colors.push(current)
                }
                outputs.push(output)
            }
        }
        renderManager.outputs = outputs
        manager.files = files
        manager.selectedFileHistory = []
        manager.historyIndex = -1
        manager.history = []
        manager.selectedFile = null
        manager.projectName = data.projectName

        const colorPicker = ColorPicker.GetSingleton()
        colorPicker.colorHistory = data.colorHistory
    })
  }
}
export { ManagerPersistence };

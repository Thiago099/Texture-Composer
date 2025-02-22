
import { Context } from "../gl/context";
import { Composition } from "../modules/manager.svelte";
import { ImageFile } from "../modules/manager.svelte";
import { Pattern } from "../modules/pattern.svelte";

class CompositionRenderer{
    constructor(canvas, ctx) {

        const positions = [
            -1, -1,  // Bottom-left
            1, -1,  // Bottom-right
            -1,  1,  // Top-left
            1,  1,  // Top-right
        ];
    
        const texCoords = [
            0, 1,  // Bottom-left
            1, 1,  // Bottom-right
            0, 0,  // Top-left
            1, 0,  // Top-right
        ];
    
        const positionBuffer = ctx.AddBuffer('a_position')
        positionBuffer.SetDataStatic(positions)
    
        const texCoordBuffer = ctx.AddBuffer('a_texCoord')
        texCoordBuffer.SetDataStatic(texCoords)

        this.gradientMapTexture = ctx.AddTextureArray('u_gradient_map_texture', 'u_gradient_map_size')
        this.gradientMapTexture.SetSlot(3)


        this.groupTexture = ctx.AddTexture('u_group_texture', 'u_group_texture_ratio')
        this.groupTexture.SetSlot(0)
        
        this.maskTexture = ctx.AddTexture('u_mask_texture', 'u_mask_texture_ratio')
        this.maskTexture.SetSlot(1)

        this.lastTexture = ctx.AddTexture('u_last_texture', 'u_last_texture_ratio')
        this.lastTexture.SetSlot(2)

        this.fileMaskTexture = ctx.AddTexture('u_file_mask_texture', 'u_file_mask_ratio')
        this.fileMaskTexture.SetSlot(4)

        this.blurMaskTexture = ctx.AddTexture('u_blur_mask_texture', 'u_blur_mask_ratio')
        this.blurMaskTexture.SetSlot(5)

        this.ctx = ctx
        this.canvas = canvas

    }
    async Render(composition, layers, showHidden, size, fileSource=null){

        if(!composition){
            return
        }

        
        if(layers.length <= 0){
            this.ctx.Clear()
            return
        }


        if(composition.file){
            const maskTextureFile = fileSource.GetFile(composition.file)

            this.maskTexture.SetDataFromImage(maskTextureFile.image)

            this.maskTexture.SetRenderScale(size.maxSize)
        }

        this.ctx.SetSize(size)
        this.ctx.GetUniform("resolution").SetFloat2(this.ctx.canvas.width, this.ctx.canvas.height)
        this.ctx.Clear()

        let hasLast = false

        for (let i = layers.length - 1; i >= 0; i--) {
            const item = layers[i];
            if(!item.visible && !showHidden){
                continue
            }

            const file = item.file
            if(file instanceof ImageFile || file instanceof Composition|| file instanceof Pattern){


                const patternScale = item.scale/100;

                if(item.enableGradientMap){
                    this.ctx.GetUniform("u_enable_gradient_map").SetInt(1)
                        
                    const gradientArray = []

                    const items = [...item.gradientMapColors]
                    items.sort((a,b)=>a.position - b.position)
            
                    for(const item of items){
                        const color = fileSource.GetColor(item.color)
                        gradientArray.push([[color[0],color[1], color[2], color[3]], [item.position/100*255, 0, 0, 0]])
                    }
            
                    this.gradientMapTexture.SetDataFromArray(gradientArray)
                }
                else{
                    this.ctx.GetUniform("u_enable_gradient_map").SetInt(0)
                }


                if(item.fileMask != null){
                    this.ctx.GetUniform("u_has_file_mask").SetInt(1)

                        
                    const fileMask = fileSource.GetFile(item.fileMask)

                    if(fileMask instanceof Pattern){
                        await fileMask.Render(this.ctx.canvas.width * patternScale, this.ctx.canvas.height * patternScale, false, fileSource)
                    }

                    this.fileMaskTexture.SetDataFromImage(fileMask.image)

                    this.fileMaskTexture.SetRenderScale(size.maxSize)

                }
                else{
                    this.ctx.GetUniform("u_has_file_mask").SetInt(0)
                }

                
                if(item.blurMask != null){
                    this.ctx.GetUniform("u_has_blur_mask").SetInt(1)

                        
                    const blurMask = fileSource.GetFile(item.blurMask)

                    if(blurMask instanceof Pattern){
                        await blurMask.Render(this.ctx.canvas.width * patternScale, this.ctx.canvas.height*patternScale, false, fileSource)
                    }

                    this.blurMaskTexture.SetDataFromImage(blurMask.image)

                    this.blurMaskTexture.SetRenderScale(size.maxSize)

                }
                else{
                    this.ctx.GetUniform("u_has_blur_mask").SetInt(0)
                }

                if(hasLast){
                    this.ctx.GetUniform("u_has_last").SetInt(1)
                    this.ctx.GetUniform("u_blend_mode").SetInt(item.blendMode?.value ?? 17)
                    this.lastTexture.SetDataFromImage(this.ctx.canvas)
                    this.lastTexture.SetRenderScale(size.maxSize)
                }
                else{
                    this.ctx.GetUniform("u_has_last").SetInt(0)
                    hasLast = true
                }

                this.ctx.GetUniform("u_alpha").SetFloat(item.alpha/100.0)

                this.ctx.GetUniform("u_enable_r").SetInt(item.enableR)
                this.ctx.GetUniform("u_enable_g").SetInt(item.enableG)
                this.ctx.GetUniform("u_enable_b").SetInt(item.enableB)
                this.ctx.GetUniform("u_enable_hue").SetInt(item.enableH)
                this.ctx.GetUniform("u_enable_saturation").SetInt(item.enableS)
                this.ctx.GetUniform("u_enable_brightens").SetInt(item.enableV)
                this.ctx.GetUniform("u_blur_amount").SetFloat(item.blurAmount)
                this.ctx.GetUniform("u_saturation").SetFloat(item.saturation)
                this.ctx.GetUniform("u_contrast").SetFloat(item.contrast)
                this.ctx.GetUniform("u_brightens").SetFloat(item.brightness)
                this.ctx.GetUniform("u_hue").SetFloat(item.hue)
                this.ctx.GetUniform("u_colorize").SetInt(item.colorize ? 1 : 0)
                this.ctx.GetUniform("u_invert").SetInt(item.invert ? 1 : 0)
                this.ctx.GetUniform("u_scale").SetFloat(item.scale/100)


                // this.ctx.GetUniform("u_scale").SetFloat(item.tile)
                this.ctx.GetUniform("u_horizontal_alignment").SetInt(item.horizontalAlignment.value)
                this.ctx.GetUniform("u_vertical_alignment").SetInt(item.verticalAlignment.value)
                this.ctx.GetUniform("u_offset").SetFloat2(item.xOffset, item.yOffset)
                this.ctx.GetUniform("u_tile").SetInt(item.tile)




                this.ctx.GetUniform("u_has_mask").SetInt(item.maskGroup != null ? 1 : 0)

                const targetFile = fileSource.GetFile(file)

                if(targetFile instanceof Pattern){
                    await targetFile.Render(this.ctx.canvas.width * patternScale, this.ctx.canvas.height * patternScale, false, fileSource)
                }

                this.groupTexture.SetDataFromImage(targetFile.image)
                
                this.groupTexture.SetRenderScale(size.maxSize)

                if(item.maskGroup){
                    this.ctx.GetUniform("u_mask_color").SetFloat3(...item.maskGroup.map(x=>x/255))
                    this.ctx.RenderTriangleStrip(4)
                }
                else{
                    this.ctx.GetUniform("u_mask_color").SetFloat3(0,0,0)
                    this.ctx.RenderTriangleStrip(4)
                }
            }
        }
    }
    async ToImageAsync(){
        return await new Promise(resolve=> this.canvas.toBlob(resolve))
    }
    async ToDataUrlAsync(){
        return URL.createObjectURL(await this.ToImageAsync())
    }
}

async function createCompositionRenderer(canvas){
    const ctx = new Context(canvas)

    const shader = ctx.AddShader()
    await shader.SetDataFromFileAsync("shader.glsl", "blend.glsl", "adjustment.glsl", "gradientMap.glsl")

    return new CompositionRenderer(canvas, ctx)
}

export { createCompositionRenderer }
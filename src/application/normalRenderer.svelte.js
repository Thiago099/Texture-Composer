
import { Context } from "../gl/context";
import { Mutex } from "../lib/mutex";
class NormalRenderer{
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

        this.groupTexture = ctx.AddTexture('u_group_texture', 'u_group_texture_ratio')
        this.groupTexture.SetSlot(0)
        

        this.ctx = ctx
        this.canvas = canvas

    }

    async Render(image, radius, maxSize, directXNormal){
        this.groupTexture.SetDataFromImage(image)
        this.groupTexture.SetRenderScale(maxSize)
        this.ctx.FitTexture(this.groupTexture, maxSize)
        this.ctx.GetUniform("u_normal_strength").SetFloat(radius)
        this.ctx.GetUniform("u_direct_x_normal").SetInt(directXNormal ? 1 : 0)
        this.ctx.GetUniform("resolution").SetFloat2(this.ctx.canvas.width, this.ctx.canvas.height)
        this.ctx.Clear()
        this.ctx.RenderTriangleStrip(4)
    }
    async ToImageAsync(){
        return await new Promise(resolve=> this.canvas.toBlob(resolve))
    }
    async ToDataUrlAsync(){
        return URL.createObjectURL(await this.ToImageAsync())
    }
}

async function createNormalRenderer(canvas){
    const ctx = new Context(canvas)

    const shader = ctx.AddShader()
    await shader.SetDataFromFileAsync("normal.glsl")

    return new NormalRenderer(canvas, ctx)
}

export { createNormalRenderer }
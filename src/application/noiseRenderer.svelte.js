
import { Context } from "../gl/context";
class NoiseRenderer{
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
        this.gradientMapTexture.SetSlot(1)

        this.ctx = ctx
        this.canvas = canvas

    }

    async Render(gradient, {time, octaves, persistence, scale, disturbance, contrast, noiseType}, width, height){


        const gradientArray = []

        const items = [...gradient]
        items.sort((a,b)=>a.position - b.position)

        for(const item of items){
            const color = item.color
            gradientArray.push([[color[0],color[1], color[2], color[3]], [item.position/100*255, 0, 0, 0]])
        }

        this.gradientMapTexture.SetDataFromArray(gradientArray)

        const size = {width, height, maxSize: null}
        this.ctx.SetSize(size)
        this.ctx.GetUniform("u_time").SetFloat(time)
        this.ctx.GetUniform("u_octaves").SetInt(octaves)
        this.ctx.GetUniform("u_persistence").SetFloat(persistence)
        this.ctx.GetUniform("u_noise_type").SetInt(noiseType)
        this.ctx.GetUniform("u_scale").SetFloat(scale)
        this.ctx.GetUniform("u_disturbance").SetFloat(disturbance)
        this.ctx.GetUniform("u_contrast").SetFloat(contrast)


        // this.ctx.GetUniform("resolution").SetFloat2(this.ctx.canvas.width, this.ctx.canvas.height)
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

async function createNoiseRenderer(canvas){
    const ctx = new Context(canvas)

    const shader = ctx.AddShader()
    await shader.SetDataFromFileAsync("noise.glsl", "gradientMap.glsl", "perlinNoise.glsl", "voronoiNoise.glsl")

    return new NoiseRenderer(canvas, ctx)
}

export { createNoiseRenderer }
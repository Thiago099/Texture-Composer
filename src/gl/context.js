
import { Shader } from "./shader"; 
import { Buffer } from "./buffer";
import { Texture } from "./texture";
import { Uniform } from "./uniform";
import { fitSize } from "./utils";
import { TextureArray } from "./textureArray";
class Context{
    constructor(canvas) {

        this.gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true });

        if (!this.gl) {
            throw new Error("web gl is not supported")
        }
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        
        
        this.canvas = canvas
        this.buffers = []
        this.textures = []
        this.uniforms = {}
    }
    AddShader(){
        this.shader = new Shader(this.gl)
        return this.shader
    }

    AddBuffer(name){
        const buffer = new Buffer(this.shader, name)
        this.buffers.push(buffer)
        return buffer
    }

    AddTexture(name, aspectRatioName){
        const texture = new Texture(this.shader, name, aspectRatioName)
        this.textures.push(texture)
        return texture
    }
    
    AddTextureArray(name, sizeName){
        const texture = new TextureArray(this.shader, name, sizeName)
        this.textures.push(texture)
        return texture
    }

    GetUniform(name){
        if(name in this.uniforms){
            return this.uniforms[name]
        }
        const uniform = new Uniform(this.shader, name)
        this.uniforms[name] = uniform
        return uniform
    }

    FitTexture(texture, maxSize){
        if(maxSize != null){
            const [width, height] = fitSize(texture.image, maxSize)
            this.canvas.width = width
            this.canvas.height = height
        }
        else{
            this.canvas.width = texture.image.width
            this.canvas.height = texture.image.height
        }
    }
    SetSize({width, height, maxSize}){
        if(maxSize != null){
            let [widthScaled, heightScaled] = fitSize({width, height}, maxSize)
            widthScaled = Math.max(widthScaled, 1)
            heightScaled = Math.max(heightScaled, 1)
            this.canvas.width = widthScaled
            this.canvas.height = heightScaled
        }
        else{
            width = Math.max(width, 1)
            height = Math.max(height, 1)
            this.canvas.width = width
            this.canvas.height = height
        }
    }
    Clear(){
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    RenderTriangleStrip(length){

        for(const buffer of this.buffers){
            buffer.Bind()
        }
        for(const texture of this.textures){
            if(texture.IsAvailable()){
                texture.Bind()
            }
        }
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, length);
    }
}
export { Context }

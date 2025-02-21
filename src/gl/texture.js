function get(path){
    return new Promise(resolve=>{
        const image = new Image();
        image.src = path; 
        image.onload = () => {
            resolve(image)
        };
    })
}
import { fitSize } from "./utils";

function getFormat (gl, ddsFormat) {
    var ext = gl.getExtension('WEBGL_compressed_texture_s3tc')
    switch (ddsFormat) {
      case 'dxt1':
        return ext.COMPRESSED_RGB_S3TC_DXT1_EXT
      case 'dxt3':
        return ext.COMPRESSED_RGBA_S3TC_DXT3_EXT
      case 'dxt5':
        return ext.COMPRESSED_RGBA_S3TC_DXT5_EXT
      default:
        throw new Error('unsupported format ' + ddsFormat)
    }
  }

class Texture{
    constructor(shader, attribute, aspectRatioAttribute) {
        this.gl = shader.gl
        this.shader = shader
        this.attribute = attribute
        this.aspectRatioAttribute = aspectRatioAttribute
        this.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.slot = 0
    
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);


        this.slots = [
            this.gl.TEXTURE0,
            this.gl.TEXTURE1,
            this.gl.TEXTURE2,
            this.gl.TEXTURE3,
            this.gl.TEXTURE4,
            this.gl.TEXTURE5,
            this.gl.TEXTURE6,
            this.gl.TEXTURE7,
            this.gl.TEXTURE8,
            this.gl.TEXTURE9,
            this.gl.TEXTURE10,
            this.gl.TEXTURE11,
            this.gl.TEXTURE12,
            this.gl.TEXTURE13,
            this.gl.TEXTURE14,
            this.gl.TEXTURE15,
            this.gl.TEXTURE16,
        ]

        this.textureLocation = this.shader.GetUniformLocation(this.attribute)
        this.aspectRatioLocation = this.shader.GetUniformLocation(this.aspectRatioAttribute)
    }
    async SetDataFromFileAsync(path){
        this.image = await get(path)
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image);
    }
    SetRenderScale(maxSize){
        if(this.image){
            if(maxSize == null){
                const {width, height} = this.image
                this.fit = {width, height}
            }
            else{
                const [width, height] = fitSize(this.image, maxSize)
                this.fit = {width, height}
            }
        }
    }
    SetDataFromImage(image){
        this.image = image
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        if(image instanceof Image || image instanceof HTMLCanvasElement){
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image);
        }
        else{
            this.gl.compressedTexImage2D(this.gl.TEXTURE_2D, 0, getFormat(this.gl, image.format), image.width, image.height, 0, image.buffer);
        }
            
    }
    SetSlot(slot){
        this.slot = slot
    }
    Bind(){
        this.gl.activeTexture(this.slots[this.slot]); // Set texture unit 1
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.uniform1i(this.textureLocation, this.slot); 
        this.gl.uniform2f(this.aspectRatioLocation, this.fit.width, this.fit.height); 
    }
    IsAvailable(){
        return this.image != null
    }
}
export { Texture }
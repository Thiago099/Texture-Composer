function transposeFlatten(arr) {
    // const transposed = arr[0].map((_, colIndex) => arr.map(row => row[colIndex]));
    const flattened = arr.flat().flat();
    return flattened;
}


class TextureArray{
    constructor(shader, attribute, sizeAttribute) {
        this.gl = shader.gl
        this.shader = shader
        this.attribute = attribute
        this.sizeAttribute = sizeAttribute
        this.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.slot = 0
    
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        
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
        this.sizeLocation = this.shader.GetUniformLocation(this.sizeAttribute)
    }

    SetDataFromArray(data){


        this.width = data[0].length
        this.height = data.length

        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(
            this.gl.TEXTURE_2D, 
            0, 
            this.gl.RGBA,   
            this.width,
            this.height,
            0, 
            this.gl.RGBA, 
            this.gl.UNSIGNED_BYTE, 
            new Uint8Array(transposeFlatten(data)) 
          );
    }
    SetSlot(slot){
        this.slot = slot
    }
    Bind(){
        this.gl.activeTexture(this.slots[this.slot]); 
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.uniform1i(this.textureLocation, this.slot); 
        this.gl.uniform2f(this.sizeLocation, this.width-1, this.height-1); 
    }
    IsAvailable(){
        return this.width != null && this.height != null
    }
}
export { TextureArray }
class Buffer{

    constructor(shader, attribute) {
        this.attribute = attribute
        this.shader = shader
        this.gl = shader.gl
        this.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    }
    SetDataStatic(data){
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    }
    Bind(){
        const location = this.shader.GetAttributeLocation(this.attribute)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.enableVertexAttribArray(location);
        this.gl.vertexAttribPointer(location, 2, this.gl.FLOAT, false, 0, 0);
    }
}
export { Buffer }
class Uniform{
    constructor(shader, name) {
        this.shader = shader
        this.gl = shader.gl
        this.location = this.shader.GetUniformLocation(name)
    }
    SetInt(value){
        this.gl.uniform1i(this.location, value)
    }
    SetFloat(value){
        this.gl.uniform1f(this.location, value)
    }
    SetFloat2(a1, a2){
        this.gl.uniform2f(this.location, a1, a2)
    }
    SetFloat3(a1, a2, a3){
        this.gl.uniform3f(this.location, a1, a2, a3)
    }
}
export { Uniform }
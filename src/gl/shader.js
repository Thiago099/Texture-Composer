function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Error linking program:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

function get(path){
    return new Promise(resolve=>fetch(`${window.location.href}${path}`).then(x=>x.text()).then(resolve))
}

async function processShader(content){
    if(!content){
        return ["",""]
    }
    const rawShader = await get("/"+content)
    let result = rawShader.split(/#Fragment Shader/gi).filter(x=>x.trim() != "")
    if(result.length == 1){
        return ["", result[0]]
    }
    return result
}


class Shader{
    constructor(gl) {
        this.gl = gl
        this.program = null
    }
    async SetDataFromFileAsync(...content) {
        let vertexShaderSource = "", fragmentShaderSource = ""

        for(let i = content.length-1; i >= 0; i--){
            const [vertex, frag] = await processShader(content[i])
            if(vertex){
                vertexShaderSource += vertex
            }
            if(frag){
                fragmentShaderSource += frag
            }
        }
        

        const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, "# version 300 es\n"+vertexShaderSource);
        const fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, "# version 300 es\n"+fragmentShaderSource);

        this.program = createProgram(this.gl, vertexShader, fragmentShader);
        this.gl.useProgram(this.program);
    }    

    GetAttributeLocation(location){
        return this.gl.getAttribLocation(this.program, location)
    }
    GetUniformLocation(location){
        return this.gl.getUniformLocation(this.program, location)
    }
}
export { Shader }
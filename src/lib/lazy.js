
class Lazy{
    constructor(time) {
        this.timeout = null
        this.time = time
    }
    Run(action){
        if(this.timeout){
            clearTimeout(this.timeout)
            this.timeout = null
        }
        this.timeout = setTimeout(()=>{
            action()
        },this.time)
    }
}

export { Lazy }
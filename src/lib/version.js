class Version{
    constructor(id, version) {
        this.id = id
        this.version = version
    }
    is(item){
        return item.id == this.id && item.version == this.version
    }
    set(item){
        this.id = item.id
        this.version = item.version
    }
    depends(file, callback){
        if(!this.is(file)){
            this.set(file)
            callback()
        }
    }
}

export {Version}
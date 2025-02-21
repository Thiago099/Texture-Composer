let singleton = null
class SaveModalManager{
    modal = $state(null)
    message = $state("")
    fileName = $state("")
    callback = null
    static GetSingleton(){
        if(singleton == null){
            singleton = new SaveModalManager()
        }
        return singleton
    }
    Prompt(message, fileName, callback){
        this.fileName = fileName
        this.message = message
        this.callback = callback
        if(this.modal){
            this.modal.open()
        }
    }
    CancelEvent(){
        return e =>{
            if(this.modal){
                this.modal.close()
            }
        }
    }
    ConfirmEvent(){
        return e =>{
            if(this.modal){
                this.modal.close()
            }
            if(this.callback){
                this.callback(this.fileName)
            }
        }
    }
}

export {SaveModalManager}
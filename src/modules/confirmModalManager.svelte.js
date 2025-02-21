let singleton = null
class ConfirmModalManager{
    modal = $state(null)
    message = $state("")
    callback = null
    static GetSingleton(){
        if(singleton == null){
            singleton = new ConfirmModalManager()
        }
        return singleton
    }
    Prompt(message, callback){
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
                this.callback()
            }
        }
    }
}

export {ConfirmModalManager}
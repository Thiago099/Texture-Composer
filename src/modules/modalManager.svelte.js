let singleton = null
class ModalManager{

    zindex = 0
    static GetSingleton(){
        if(singleton == null){
            singleton = new ModalManager()
        }
        return singleton
    }
    Push(){
        return this.zindex++
    }
    Pop(){
        this.zindex--
    }

}
export {ModalManager}
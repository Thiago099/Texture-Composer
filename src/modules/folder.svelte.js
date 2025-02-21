import { ListItem } from "./listManager.svelte";


class Folder extends ListItem{
    name = $state("Folder")
    open = $state(true)
    openCtx = $state(true)
    constructor(name) {
        super();
        if(name){
            this.name = name
        }
    }
    get type(){
        return "separator"
    }
    Copy(){
        var result = new Folder(this.name)
        result.open = this.open
        return result
    }
    Contains(){
        return false;
    }
}

export { Folder }

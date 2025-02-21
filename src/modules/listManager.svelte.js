class ListItem{
    editName = $state(false)
    group = $state(null)
}
let fileListIOsingleton = null
class ListIO {
    static GetFileListSingleton(){
        if(fileListIOsingleton == null){
            fileListIOsingleton = new ListIO()
        }
        return fileListIOsingleton
    }
    constructor() {
        this.parseSource= () => {}
        this.selectEvent= () => {}
        this.allowDropEvent= () => {}
        this.dropEvent = () => {}
        this.reorderEvent = (index)=>{}
        this.removeLayer = (index)=>{}
        this.uploadMedias = (index)=>{}
    }
}

class ListRendering{
    constructor(renderFunction, optionsRenderFunction, doRenderFunction = null) {
        this.renderFunction = renderFunction
        this.optionsRenderFunction = optionsRenderFunction
        this.doRenderFunction = doRenderFunction ?? (() => true)
    }
}

class ListData{
    constructor(obj, itemsName, selectedItemName, menuKind, listType = "vertical-list", allowRenaming = true, doubleClickSelection=false) {
        this.menuKind = menuKind
        this.listType = listType
        this.allowRenaming = allowRenaming
        this.doubleClickSelection = doubleClickSelection

        this.itemsName = itemsName
        this.selectedItemName = selectedItemName
        this.obj = obj
    }

    set items(value){
        this.obj[this.itemsName] = value
    }

    set selectedItem(value){
        this.obj[this.selectedItemName] = value
    }

    get items(){
        return this.obj[this.itemsName]
    }

    get selectedItem(){
        return this.obj[this.selectedItemName]
    }
    
    isOrientationVertical(){
        const verticalTypes = new Set(["vertical-list"])
        return verticalTypes.has(this.listType)
    }
}


export { ListItem, ListIO, ListRendering, ListData }
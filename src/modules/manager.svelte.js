import { Composition } from "./composition.svelte";
import { Folder } from "./folder.svelte";
import { ImageFile } from "./imageFile.svelte";
import { Layer } from "./layer.svelte";
import { Pattern } from "./pattern.svelte";
import { ListIO } from "./listManager.svelte";

let singleton = null
class Manager{
    projectName = "Project"
    
    files = $state([])
    selectedFileHistory = $state([])

    get selectedFileHistoryItem(){
        return this.selectedFile
    }
    set selectedFileHistoryItem(value){
        
    }
    selectedFile = $state(null)
    historyIndex = $state(-1)
    history = $state([])
    renderChanged = null
    constructor() {
        this.renderChanged = new CustomEvent("renderChanged", {});
    }
    static GetSingleton(){
        if(singleton == null){
            singleton = new Manager()
        }
        return singleton
    }
    CopyComposition(index){
        const newFile = this.files[index].Copy()
        this.files.splice(index, 0, newFile)
        this.selectFile(newFile)
    }
    updateScreen(){
        document.dispatchEvent(this.renderChanged)
    }
    selectFile(file){
        if(this.files.length > 0){
            const index = this.files.indexOf(file)
            if(index != -1){
                this.selectedFile = this.files[index]
            }
        }
    }
    addComposition(){
        const item = new Composition(this.GetAvailableName("Composition"));
        this.files.splice(0,0,item)
        this.selectFile(item)
        this.pushHistory("add composition")
    }
    getFolder(index){

        if(index instanceof Composition){
            index = this.files.indexOf(index)
        }

        if(this.files[index] instanceof Folder){
            return null
        }

        for(let i = index - 1; i >= 0; i--){
            if(this.files[i] instanceof Folder){
                return this.files[i]
            }
        }
        return null
    }
    GetAvailableName(name){

        let result = name
        let i = 2
        while(this.files.some(x=>x.name == result)){
            result = name + " ("+i+")"
            i++
        }
        return result
    }
    addFolder(){
        const item = new Folder(this.GetAvailableName("Folder"));
        this.files.push(item)
        this.pushHistory("add folder")
    }
    addColor(){
        const item = new Pattern(this.GetAvailableName("Color"));
        this.files.splice(0,0,item)
        this.selectFile(item)
        this.pushHistory("add pattern")
    }
    addLinearGradient(){
        const item = new Pattern(this.GetAvailableName("Linear Gradient"), { name: "Linear Gradient", value: "linearGradient" });
        this.files.splice(0,0,item)
        this.selectFile(item)
        this.pushHistory("add pattern")
    }
    addRadialGradient(){
        const item = new Pattern(this.GetAvailableName("Radial Gradient"), { name: "Radial Gradient", value: "radialGradient" });
        this.files.splice(0,0,item)
        this.selectFile(item)
        this.pushHistory("add pattern")
    }
    addPerlinNoise(){
        const item = new Pattern(this.GetAvailableName("Perlin Noise"),  { name: "Perlin Noise", value: "perlinNoise" });
        this.files.splice(0,0,item)
        this.selectFile(item)
        this.pushHistory("add pattern")
    }
    addVoronoiNoise(){
        const item = new Pattern(this.GetAvailableName("Voronoi Noise"),  { name: "Voronoi Noise", value: "voronoiNoise" });
        this.files.splice(0,0,item)
        this.selectFile(item)
        this.pushHistory("add pattern")
    }
    addGrainNoise(){
        const item = new Pattern(this.GetAvailableName("Grain Noise"),  { name: "Grain Noise", value: "grainNoise" });
        this.files.splice(0,0,item)
        this.selectFile(item)
        this.pushHistory("add pattern")
    }
    addImage(file, image){
        this.files.splice(0,0,new ImageFile(file.name, image))
    }
    getSelectedLayer(){
        if(!this.selectedFile){
            return null;
        }
        return this.selectedFile.selectedLayer
    }
    getSelectedFile(){
        return this.selectedFile
    }
    isCompositionActive(){
        return this.selectedFile instanceof Composition
    }
    pushHistory(action){

        const last = this.history[this.historyIndex]

        if(last && last.action == action && last.files.indexOf(last.selectedFile) == this.getSelectedFileIndex()){
        }
        else{
            if(this.history.length > 30){
                this.history.splice(0, 1)
            }
            else{
                this.historyIndex++
            }
        }

        this.history.splice(this.historyIndex, this.history.length-this.historyIndex)


        const files = []
        for(const file of this.files){
            files.push(file.Copy())
        }
        const selectedFile = files[this.getSelectedFileIndex()]
        this.history.push({
            action,
            files,
            selectedFile,
        })
    }
    getSelectedFileIndex(){
        return this.files.indexOf(this.selectedFile)
    }
    removeFromTabs(index){
        const file = this.files[index]
        const idx = this.selectedFileHistory.indexOf(file)

        if(idx != -1){
            this.selectedFileHistory.splice(idx, 1)
        }
    }
    cleanReferences(index){
        const item = this.files[index]
        for(const file of this.files){
            if(file instanceof Composition){
                for(const layer of file.layers){
                    if(layer.file == item){
                        layer.file = null
                    }
                    if(layer.fileMask == item){
                        layer.fileMask = null
                    }
                    if(layer.blurMask == item){
                        layer.blurMask = null
                    }
                }
            }
        }
    }
    setHistory(index){
        if(index < 0){
            return
        }
        if(index >= this.history.length){
            return
        }
        this.historyIndex = index
        const current = this.history[this.historyIndex]
        this.files = current.files.map(x=>x.Copy())
        this.selectedFileHistory = []
        this.historyIndex = current.historyIndex
        const fileIo = ListIO.GetFileListSingleton()
        this.selectedFile = this.files[current.files.indexOf(current.selectedFile)]
    }
    undoHistory(){
        if(this.historyIndex-1 < 0){
            return
        }
        this.historyIndex--
        const current = this.history[this.historyIndex]
        this.files = current.files.map(x=>x.Copy())
        this.selectedFileHistory = []
        this.selectedFile = this.files[current.files.indexOf(current.selectedFile)]
    }
    redoHistory(){
        if(this.historyIndex + 1 >= this.history.length){
            return
        }
        this.historyIndex++
        const current = this.history[this.historyIndex]
        this.files = current.files.map(x=>x.Copy())
        this.selectedFileHistory = []
        this.selectedFile = this.files[current.files.indexOf(current.selectedFile)]
    }

}


export { Manager, Composition, ImageFile, Layer, Folder }

import { saveAs } from "file-saver";

import { Composition, Manager } from "./manager.svelte"
import { ColorPicker } from "./colorPicker.svelte";
import { CompositionReference } from "./compositionReference.svelte";

const manager = Manager.GetSingleton()

let singleton = null
import JSZip from "jszip";
import { SaveModalManager } from "./saveModalManager.svelte";

class ZipWriter{
    constructor() {
        this.zip = new JSZip();
    }
    WriteImage(name, dataUrl){
        if(!dataUrl){
            return
        }
        this.zip.file(
            name,
            dataUrl.replace(/^data:.*?;base64,/, ""),
            { base64: true }
          );
    }
    Download(fileName){
        this.zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, fileName);
        });
    }
}

class RenderManager{
    modal = $state(null)
    contentModal = $state(null)
    renderTarget = null
    outputs = $state([])
    selectedOutput = $state(null)
    static GetSingleton(){
        if(singleton == null){
            singleton = new RenderManager()
        }
        return singleton
    }
    Open(){
        if(this.modal){
            this.modal.open()
        }
    }
    async RenderOutput(output){
        await output.Render()
        const dataURL = output.base?.outputCanvas.toDataURL('image/png');
        return dataURL
    }

    cleanReferences(index){
        const item = manager.files[index]
        for(const comp of this.outputs){
            if(comp instanceof CompositionReference){

                for(const swap of comp.files){
                    if(swap.file.id == item.id){
                        swap.file = swap.baseFile
                    }
                }

                comp.files = comp.files.filter(swap => swap.baseFile.id !== item.id);
            }


            comp.BuildFileCache()
        }
    }
    
    async Download(){
        const saveModalManager = SaveModalManager.GetSingleton();


        const enabledOutputs = this.outputs.filter(x=>x.enabled)
        
        const renderedOutputs = []
        for(const item of enabledOutputs){
            const image = await this.RenderOutput(item)
            if(image != null){
                renderedOutputs.push({image, name:item.name})
            }
        }
        if(renderedOutputs.length == 1){

            saveModalManager.Prompt("Render Asset", renderedOutputs[0].name , async fileName =>{
                const link = document.createElement('a');
                link.href =  renderedOutputs[0].image;
                link.download = fileName + '.png';
                link.click();
            })
            
        }
        else if (renderedOutputs.length > 0){
            saveModalManager.Prompt("Render Assets", manager.projectName + " Assets" , async fileName =>{
                const writer = new ZipWriter()
                for(const output of renderedOutputs){
                    writer.WriteImage(output.name+".png", output.image)
                }
                writer.Download(fileName)
            })
        }

    }
    OpenContentModalEvent(output){
        return e =>{
            this.selectedOutput = output
            this.contentModal.setTitle("Rendering output - "+ output.name)
            this.contentModal.open()
            this.selectedOutput.UpdatePreview()
        }
    }
    PickColorEvent(output, item){
        return e=>{
            const colorPicker = ColorPicker.GetSingleton()
            colorPicker.PickColor(item.color, (color)=>{
                item.color = [...color]
                output.UpdatePreview()
            })
        }
    }
    RemoveOutput(item){
        if(item == this.selectedOutput){
            this.contentModal.close()
        }
        this.outputs.splice(this.outputs.indexOf(item), 1)
    }
    CopyEvent(item){
        return e=>{
            const newItem = item.Copy()
            newItem.name = this.GetAvailableName(item.name.replace(/\s+-\s+Copy\s+(?:\(\d+\)){0,1}$/g,"") + " - Copy ")
            this.outputs.splice(Math.min(this.outputs.indexOf(item)+1, this.outputs.length),0,newItem)
            this.selectedOutput = newItem
            this.contentModal.setTitle("Rendering output - "+ newItem.name)
        }
    }
    UpdateAllPreviewEvent(){
        return e=>{
            for(const output of this.outputs){
                output.UpdatePreview()
            }
        }
    }
    GetAvailableName(name){
        let result = name
        let i = 2
        while(this.outputs.some(x=>x.name == result)){
            result = name + " ("+i+")"
            i++
        }
        return result
    }
    AddOutputEvent(){
        return e =>{
            if(manager.selectedFile && manager.selectedFile instanceof Composition){
                this.outputs.push(manager.selectedFile.CreateReference(this.GetAvailableName(manager.selectedFile.name + " Render Output")))
            }
            else{
                this.outputs.push(new CompositionReference(null, this.GetAvailableName("Render Output")))
            }
        }
    }
}   

export { RenderManager }
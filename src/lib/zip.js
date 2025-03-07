import JSZip from "jszip";
import { saveAs } from "file-saver";
import { LoadImage } from "../application/io.svelte";

function UploadZipAsync(ext = ".tcx") {
    return new Promise(resolve=>{
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ext;
        input.style.display = "none";
      
        input.addEventListener("change", (e) => resolve(e.target.files[0]));
      
        document.body.appendChild(input);
        input.click();
      
        input.addEventListener("change", () => document.body.removeChild(input));
    })
}
class ZipWriter{
    constructor() {
        this.zip = new JSZip();
        this.images = this.zip.folder("Images");
    }
    WriteObject(name, data){
        this.zip.file(name+".json", JSON.stringify(data));
    }
    WriteImage(name, dataUrl){
        if(!dataUrl){
            return
        }
        this.images .file(
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
function ToDataUrl(blob){
    return new Promise(resolve=>{
        const reader = new FileReader();

        reader.onloadend = function () {
            const dataUrl = reader.result;
            resolve(dataUrl)
        };
        reader.readAsDataURL(blob);
    })

}
class ZipReader{
    constructor(zip) {
        this.zip = zip
        this.images = this.zip.folder("Images");
    }
    static async CreateAsync(file = null){
        if(file == null){
            file = await UploadZipAsync()
        }
        const buffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(buffer);
        return new ZipReader(zip)
    }
    async GetObject(path){
        const file = this.zip.file(path+".json")
        if(file == null){
            return null;
        }
        return JSON.parse(await file.async('text'));
    }
    async GetText(path){
        return await this.zip.file(path).async('text');
    }
    async GetImage(path){
        const entry = this.images.file(path);

        const blob = await entry.async("blob");

        const file = new File([blob], path.replace(/^Images\//gi, ""), {
            type: blob.type,
        });

        const image = await LoadImage(file);    

        return [file, image]
    }
    async GetImageDataUrl(path){
        const entry = this.images.file(path);

        if(!entry){
            return null;
        }

        const blob = await entry.async("blob");

        return await ToDataUrl(blob)
    }
}
class ZipRendererReader{
    constructor(zip) {
        this.zip = zip
    }
    static async CreateAsync(file = null){
        if(file == null){
            file = await UploadZipAsync(".zip")
        }
        const buffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(buffer);
        return new ZipRendererReader(zip)
    }
    async GetAllFiles(){
        const result = {}
        for(const [path, file] of Object.entries(this.zip.files)){


            if (!file.dir && isImageFile(path)) {
                const [comp, output, fileName] = path.split("/").slice(-3);

                if(!(comp in result)){
                    result[comp] = {}
                }

                if(!(output in result[comp])){
                    result[comp][output] = {}
                }

                const blob = await file.async("blob");

                const blobFile = new File([blob], path.replace(/^Images\//gi, ""), {
                    type: blob.type,
                });

                const image = await LoadImage(blobFile);   

                result[comp][output][fileName] = image
            }
        }
        return result
    }
}
function isImageFile(path) {
    return /\.(jpg|jpeg|png|gif|bmp|webp|tiff|svg)$/i.test(path);
}
export {ZipReader, ZipWriter, ZipRendererReader}
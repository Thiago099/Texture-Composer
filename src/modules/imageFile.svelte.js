import { ListItem } from "./listManager.svelte";
import { createThumbnail } from "../lib/image-generation";
import { guid } from "../lib/guid";
import { getExtension } from "../lib/file";
class ImageFile extends ListItem{
    name = $state("")
    version = 1
    constructor(name, image) {
        super()
        if(!image || !name){
            return
        }
        this.id = guid()
        this.name = name
        this.extension = getExtension(name)
        this.image = image
        this.thumbnail = createThumbnail(image, {width:40, height:40})
    }
    Contains(file){
        return false;
    }
    Copy(){
        const result = new ImageFile()
        result.id = guid()
        result.name = this.name
        result.extension =  this.extension
        result.image = this.image
        result.thumbnail = createThumbnail(this.image, {width:40, height:40})
        return result
    }
}

export { ImageFile }
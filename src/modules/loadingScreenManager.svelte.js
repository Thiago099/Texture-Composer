import { Singleton } from "../lib/singleton";
let singleton = null

class LoadingScreenManager{
    display = $state(false)
    taskName = $state("")
    numItems = $state(0)
    itemsProgress = $state(0)
    itemName =$state("")
    timeless= $state(false)
    static GetSingleton(){
        if(singleton == null){
            singleton = new LoadingScreenManager()
        }
        return singleton
    }
    SetTimeless(timeless){
        this.timeless = timeless
    }
    GetTimeless(){
        return this.timeless
    }
    Start(fistTaskName){
        this.taskName = fistTaskName
        this.display = true
    }
    StartTask(task, numItems){
        this.taskName = task
        this.itemName = ""
        this.itemsProgress = 0
        this.numItems = numItems 
    }
    StartItem(item){
        this.itemName = item
        this.itemsProgress++
    }
    End(){
        this.display = false
    }
    GetTaskName(){
        return this.taskName
    }
    GetItemName(){
        return this.itemName
    }
    GetDisplay(){
        return this.display
    }
    GetItemPercentage(){
        let result = this.itemsProgress/this.numItems*100
        if(isNaN(result) || ! isFinite(result)){
            result = 0;
        }
        return  Math.floor(result) + "%"
    }
}

export { LoadingScreenManager }
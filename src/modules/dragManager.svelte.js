class DragData{
  constructor(manager, item) {
    this.menuSource = manager.list.menuKind
    this.item =  item
  }
}
let dragData;

class Data{
  static set dragData(value){
    dragData = value;
  }
  static get dragData(){
    return dragData
  }
}
class DragManager {
  draggingIndex = $state(null);
  dropIndex = $state(null);
  isDraggingOver = $state(false);
  isDroppingAbove = $state(false);
  item
  constructor(list, io) {
    this.list = list
    this.io = io


  }

  handleDragStart(index) {
    return (event) => {

      if(this.list.items[index].editName){
        return
      }

      this.draggingIndex = index;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.cursor = "move";
      const dragImage = document.createElement("div");
      event.dataTransfer.setDragImage(dragImage, 0, 0);
      dragData = new DragData(this, this.list.items[index]);
      dragImage.remove();
    };
  }
  isAllowedToDrop() {
    if (dragData == null) {
      return false;
    }
    return (
      this.list.menuKind == dragData.menuSource ||this.io.allowDropEvent(dragData)
    );
  }

  isTopHalf(targetElement, event) {


    let parent = null
    while(true){
      parent = targetElement.parentElement
      if(parent == null || targetElement.classList.contains("item")){
        break
      }
      else{
        targetElement = parent
      }
    }

    const rect = targetElement.getBoundingClientRect();
    if(this.list.isOrientationVertical()){

      const targetCenterY = rect.top + rect.height / 2;
      
      return event.clientY < targetCenterY;
    }
    else{
      const targetCenterX = rect.left + rect.width / 2;
      
      return event.clientX < targetCenterX;
    }
  }

  handleDragOver(index) {
    return (event) => {
      if (!this.isAllowedToDrop()) {
        return;
      }

      event.preventDefault();

      event.dataTransfer.cursor = "move";

      this.isDroppingAbove = this.isTopHalf(event.target, event);
      if (this.isDroppingAbove) {
        this.dropIndex = index - 1;
      } else {
        this.dropIndex = index;
      }
      this.isDraggingOver = true;
    };
  }

  dragOverHandle(index) {
    return (event) => {
      if (!this.isAllowedToDrop()) {
        return;
      }

      event.preventDefault();
      this.dropIndex = index;
      this.isDraggingOver = true;
    };
  }

  handleDragLeave() {
    return (event) => {
      this.isDraggingOver = false;
    };
  }

  handleDrop() {
    return (event) => {
      event.preventDefault();

      this.isDroppingAbove = this.isTopHalf(event.target, event);
      
      const tmpDraggingIndex = this.draggingIndex;



      if (dragData.menuSource != this.list.menuKind) {
        const tmpDropIndex = this.isDroppingAbove ? this.dropIndex : this.dropIndex;

        this.dropIndex = null;
        this.draggingIndex = null;
        
        if (this.list.items.some((x) => x == dragData.item)) {
          return;
        }

        this.io.dropEvent(tmpDropIndex+1, dragData)

        this.list.selectedItem = this.list.items[tmpDropIndex+1];

        dragData = null;
      } else if (
        this.draggingIndex !== null &&
        this.dropIndex !== null &&
        this.draggingIndex !== this.dropIndex
      ) {
        const tmpDropIndex = this.isDroppingAbove ? this.dropIndex : this.dropIndex-1;

        this.dropIndex = null;
        this.draggingIndex = null;

        const [draggedItem] = this.list.items.splice(tmpDraggingIndex, 1);


        this.list.items.splice(tmpDropIndex+1, 0, draggedItem);

        this.list.selectedItem = this.list.items[tmpDropIndex+1];
        this.io.reorderEvent(this.list.selectedItem)
      }

      this.resetDragState();
    };
  }

  handleDragEnd() {
    return (event) => {
      this.resetDragState();
    };
  }
  doubleClickItemEvent(item) {
    return (event) => {
      if(!this.list.doubleClickSelection){
        return
      }
      this.list.selectedItem = item;
      this.io.selectEvent(item)
    };
  }
  singleClickItemEvent(item) {
    return (event) => {
      if(this.list.doubleClickSelection){
        return
      }
      this.list.selectedItem = item;
      this.io.selectEvent(item)
    };
  }


  resetDragState() {
    this.draggingIndex = null;
    this.dropIndex = null;
    this.isDraggingOver = false;
  }
}

export {DragManager, Data}
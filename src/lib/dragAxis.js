class DragAxis{
    constructor(direction, snapDistance, min, max, offset = 0) {
        this.direction = direction
        this.p = 0
        this.snapDistance = snapDistance
        this.offset = offset

        if(min <= max){
            this.min = min
            this.max = max
            this.flip = false
        }
        else{
            this.min = max
            this.max = min
            this.flip = true
        }
    }
    SetElement(element){
        this.element = element
    }
    GetSize(){
        if(this.element){
            if(this.direction == "x"){
                const style = window.getComputedStyle(this.element.parentElement)
                return Number(style.width.replace(/px$/gi,""))
            }
            else if(this.direction == "y"){
                const style = window.getComputedStyle(this.element.parentElement)
                return Number(style.height.replace(/px$/gi,""))
            }
        }
        return 0
    }

    GetValueInPixels(value) {
        let size = this.GetSize();
        if (this.flip) {
            return ((this.max - value) * 100 / this.max);
        } else {
            return (value * 100 / this.max);
        }
    }
   
    GetPixelsAsValue(client) {
        let size = this.GetSize();
        if (this.flip) {
            // Adjust for flipped axis direction
            return this.max - (((client + this.offset)/ size) * this.max - this.p);
        } else {
            return ((client + this.offset)/ size) * this.max - this.p ;
        }
    }

    ShouldSnap(value, offset){
        const valueInPixels = this.GetValueInPixels(value)

        const distance = Math.abs(valueInPixels - offset);

        return distance > this.snapDistance;
    }

    DoSnap(offset){
        if(this.flip){
            return  this.max - ((offset / this.GetSize()) * this.max);
        }
        else{

            return  (offset / this.GetSize()) * this.max;
        }
    }
 
    GetCursorP(client, value) {
        if (this.flip) {
            return (((client + this.offset) / this.GetSize() * this.max) - (this.max - value)) ;
        } else {
            return ((client + this.offset) / this.GetSize() * this.max) - value;
        }
    }
    LimitValue(value){
        if(value > this.max){
            return this.max
        }
        if(value < this.min){
            return this.min
        }
        return value
    }
}
export { DragAxis }
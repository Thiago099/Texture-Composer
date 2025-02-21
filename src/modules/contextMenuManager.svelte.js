let singleton = null
class ContextMenuManager{
    element = null
    mouseX = 0
    mouseY = 0
    options = $state([])
    constructor() {
        const self = this
        function updateMousePosition(event) {
            self.mouseX = event.clientX;
            self.mouseY = event.clientY;
        }
        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener("mousedown", e => {if(!this.element.contains(e.target)){ this.Close()}})

        $effect(()=>{
            const opt = this.options;

            const rect = this.element.getBoundingClientRect();
            const elementTop = rect.top;
            const elementLeft = rect.left;
            const elementHeight = rect.height;
            const elementWidth = rect.width;
            

            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            

            if (elementTop < 0) {
                this.element.style.top = '0px';
            } else if (elementTop + elementHeight > windowHeight) {
                this.element.style.top = `${windowHeight - elementHeight}px`;
            }
            

            if (elementLeft < 0) {
                this.element.style.left = '0px';
            } else if (elementLeft + elementWidth > windowWidth) {
                this.element.style.left = `${windowWidth - elementWidth}px`;
            }

   
        })
    }
    static GetSingleton(){
        if(singleton == null){
            singleton = new ContextMenuManager()
        }
        return singleton
    }
    Open(options, callback){
        this.options = options
        this.callback = callback
        this.element.style.display = "flex"
        this.element.style.left = (this.mouseX - 250) + "px"
        this.element.style.top = this.mouseY + "px"
    }
    Close(){
        this.element.style.display= "none"
    }
    PickEvent(option){
        return e =>{
            this.callback?.(option)
            this.Close()
        }
    }
}

export {ContextMenuManager}
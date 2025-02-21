export { makeGridAreasResizable }

function makeGridAreasResizable(container, config) {

    const computedStyle = window.getComputedStyle(container);
    const gridTemplateAreas = computedStyle.getPropertyValue('grid-template-areas');

    const areas = gridTemplateAreas.split(/"\s*"{0,1}/gi).filter(x=>x!="").map(x=>x.split(/\s+/))

    const elementsByGridArea = {};

    for(const child of Array.from(container.children)){
        const gridArea = window.getComputedStyle(child).getPropertyValue('grid-area').trim();
        elementsByGridArea[gridArea] = child;
    }
    
    const elementDict = {}

    let x = 0;
    let y = 0;
    for(let i = 0; i < areas.length;i++){
        const line = areas[i]
        x = 0;
        for(let j = 0; j < line.length; j++){

            const current = line[j]
            const nextX = j+1 < line.length?line[j+1]:null
            const nextY = i+1<areas.length?areas[i+1][j]:null

            if(!config.fixedAreas.includes(current)){

                if(nextX != null && !config.fixedAreas.includes(nextX)){
                    if(current != nextX){
                        if(elementDict[current] == null){
                            elementDict[current] = []
                        }
        
                        elementDict[current].push({
                            position: "x+",
                            edge:x
                        })
                    }
                }
                if(nextY != null && !config.fixedAreas.includes(nextY))
                {
                    if(nextY!= null && current != nextY){
                        if(elementDict[current] == null){
                            elementDict[current] = []
                        }
        
                        elementDict[current].push({
                            position: "y+",
                            edge:y
                        })
                    }
                }
            }
            x++
        }
        y++
    }
    
    const elements = []

    for(const [key, value] of Object.entries(elementDict)){
        elements.push({
            item: elementsByGridArea[key],
            helpers:value
        })   
    }

    if(config.thickness == null) config.thickness = "15px"
    if(config.minWidth == null) config.minWidth = 30
    if(config.minHeight == null) config.minHeight = 30
    if(config.helperClass == null) config.helperClass = null
    if(config.helperActiveClass == null) config.helperActiveClass = null

    const containerComputedStyle = getComputedStyle(container)
    const gap = containerComputedStyle.gap ?? "0px"
    const numColumns = containerComputedStyle.gridTemplateColumns.split(' ').length
    const numRows = containerComputedStyle.gridTemplateRows.split(' ').length

    const placements = {
        "x+": xPlusPlacement,
        "y+": yPlusPlacement,
    }

    const axis = {
        "x": xResizable,
        "y": yResizable
    }

    for (const element of elements) {
        const gridAreaElement = element.item
        for (let { position, edge } of element.helpers) {
            if(position[0] == "x" && (edge < 0 || edge > numColumns - 2)){
                console.warn(`Horizontal internal edge "${edge}" does not exist in the grid, skipping it`)
                continue;
            }
            if(position[0] == "y" && (edge < 0 || edge > numRows - 2)){
                console.warn(`Vertical internal edge "${edge}" does not exist in the grid, skipping it`)
                continue;
            }
            
            axis[position[0]](container, placements[position](createHelper(gridAreaElement, config), gap, config), edge, config)
        }
    }
}

function xResizable(gridElement, helper, rowIndexToEdit, config) {

    let rowWidths = null

    let xFactor = 0
    let wFactor = 0

    let oldUserSelect = null

    helper.addEventListener("mousedown", mouseDown)

    function mouseDown(e) {
        const {clientX} = e

        if(config.helperActiveClass != null){
            helper.classList.add(config.helperActiveClass)
        }

        oldUserSelect = gridElement.style.userSelect 
        gridElement.style.userSelect = "none"

        rowWidths = getComputedStyle(gridElement).gridTemplateColumns.split(' ').map(x => Number(x.replace("px", "")))

        gridElement.addEventListener("mousemove", mouseMove)
        gridElement.addEventListener("mouseup", mouseUp)

        let sw = rowWidths[rowIndexToEdit]
        wFactor = rowWidths[rowIndexToEdit + 1] + sw
        xFactor = clientX - sw
    }

    function mouseUp(e) {
        gridElement.removeEventListener("mousemove", mouseMove)
        gridElement.removeEventListener("mouseUp", mouseUp)
        gridElement.style.userSelect = oldUserSelect

        if(config.helperActiveClass != null){
            helper.classList.remove(config.helperActiveClass)
        }
    }

    function mouseMove(e) {
        const { clientX } = e

        let previousWidth = Math.min(Math.max((clientX - xFactor), config.minWidth), wFactor - config.minWidth)
        rowWidths[rowIndexToEdit] = previousWidth;
        rowWidths[rowIndexToEdit + 1] = Math.max(wFactor - previousWidth, 0);
        let newRowsValue = rowWidths.map(x => x + "px").join(' ');

        gridElement.style.gridTemplateColumns = newRowsValue;
    }
    
}

function yResizable(gridElement, helper, rowIndexToEdit, config) {

    let colHeights = null

    let yFactor = 0
    let hFactor = 0

    let oldUserSelect = null

    helper.addEventListener("mousedown", mouseDown)

    function mouseDown(e) {
        const { clientY } = e

        if(config.helperActiveClass != null){
            helper.classList.add(config.helperActiveClass)
        }

        oldUserSelect = gridElement.style.userSelect 
        gridElement.style.userSelect = "none"

        colHeights = getComputedStyle(gridElement).gridTemplateRows.split(' ').map(x => Number(x.replace("px", "")))

        gridElement.addEventListener("mousemove", mouseMove)
        gridElement.addEventListener("mouseup", mouseUp)
        document.addEventListener('mouseleave', mouseUp);

        let sw = colHeights[rowIndexToEdit]
        hFactor = colHeights[rowIndexToEdit + 1] + sw
        yFactor = clientY - sw
    }

    function mouseUp(e) {
        gridElement.removeEventListener("mousemove", mouseMove)
        gridElement.removeEventListener("mouseUp", mouseUp)
        document.removeEventListener('mouseleave', mouseUp);

        if(config.helperActiveClass != null){
            helper.classList.remove(config.helperActiveClass)
        }

        gridElement.style.userSelect = oldUserSelect
    }

    function mouseMove(e) {
        const { clientY } = e
        let previousHeight = Math.min(Math.max((clientY - yFactor), config.minHeight), hFactor - config.minHeight)
        colHeights[rowIndexToEdit] = previousHeight;
        colHeights[rowIndexToEdit + 1] = Math.max(hFactor - previousHeight, 0);
        let newRowsValue = colHeights.map(x => x + "px").join(' ');

        gridElement.style.gridTemplateRows = newRowsValue;
    }


}

function createHelper(element, config) {
    element.style.position = "relative"
    let div = document.createElement("div")

    if(config.helperClass != null){
        div.classList.add(config.helperClass)
    }
    
    div.style.zIndex = "1"
    div.style.position = "absolute"
    // div.style.backgroundColor="red"
    element.appendChild(div)
    return div
}


function xPlusPlacement(div, gap, config) {

    if(config.thickness == "auto"){
        div.style.width = gap
        div.style.transform = "translateX(100%)"
    }
    else{
        if(!/\d/.test(gap)) gap = "0px";

        div.style.width = config.thickness
        div.style.transform = `translateX(calc(50% + ${gap} / 2))`
    }

    div.style.right = "0"
    div.style.top = `calc(-${gap} / 2)`
    div.style.height = `calc(100% + ${gap})`
    div.style.cursor = "ew-resize"
    return div
}

function yPlusPlacement(div, gap, config) {

    if(config.thickness == "auto"){
        div.style.height = gap
        div.style.transform = "translateY(100%)"
    }
    else{
        if(!/\d/.test(gap)) gap = "0px";

        div.style.height = config.thickness
        div.style.transform = `translateY(calc(50% + ${gap} / 2))`
    }


    div.style.bottom = "0"
    div.style.left = `calc(-${gap} / 2)`
    div.style.width = `calc(100% + ${gap})`
    div.style.cursor = "ns-resize"
    return div
}


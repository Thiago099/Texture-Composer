import {createCompositionRenderer } from '../application/renderer.svelte.js'
import { createNormalRenderer } from "../application/normalRenderer.svelte";
import { Singleton } from '../lib/singleton.js';
import { Mutex } from '../lib/mutex.js';


class RenderTarget{
    canvas = document.createElement("canvas")
    renderer = null
    constructor(createRenderer) {
        this.createRenderer = createRenderer
        
    }
    async InitRendererAsync(){
        if(this.renderer == null){
            this.renderer = await this.createRenderer(this.canvas)
        }
    }
}
const renderTarget = new Singleton(RenderTarget, createCompositionRenderer);
const normalRenderTarget = new Singleton(RenderTarget, createNormalRenderer);
const mutex = new Singleton(Mutex)
class RenderingContext{
    renderTarget = renderTarget.GetSingleton()
    normalRenderTarget = normalRenderTarget.GetSingleton()
    enablePostProcessing = true
    mutex = mutex.GetSingleton()
    constructor(enablePostProcessing = true) {
        this.enablePostProcessing = enablePostProcessing
    }
    async Lock(callback){
        await this.mutex.lock(callback);
    }
    async InitRendererAsync(){
        await this.renderTarget.InitRendererAsync();
        await this.normalRenderTarget.InitRendererAsync();
    }
    async Render(composition, layers, showHidden, size, fileSource){
        await this.renderTarget.renderer.Render(composition, layers, showHidden, size, fileSource)

        if(this.enablePostProcessing && composition.convertToNormal){
            await this.normalRenderTarget.renderer.Render(this.renderTarget.canvas, composition.normalStrength , size.maxSize)
        }
    }
    GetCanvas(composition){
        if(this.enablePostProcessing && composition.convertToNormal){
            return this.normalRenderTarget.canvas
        }
        return this.renderTarget.canvas
    }
}

export { RenderingContext, RenderTarget }
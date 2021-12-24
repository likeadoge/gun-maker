import { Ref, Watcher } from "@/reactive/base";
import { Matrix3x3, Size } from "@/utils";
import { CanvasHandle } from "@/utils/canvas";
import { sight } from "./Sight";

export class PreivewCanvas extends CanvasHandle<HTMLCanvasElement>{
    constructor(){
        super(document.createElement('canvas'))
    }
}


export abstract class LayerPreview
    extends CanvasHandle<OffscreenCanvas> 
    implements Watcher<Size>, Watcher<Matrix3x3>{

    constructor() {
        super(new OffscreenCanvas(
            sight.size.val().width,
            sight.size.val().height
        ))
        sight.size.attach(this)
    }

    emit(r: Ref<any>) {
        if (r === screen.size) {
            this.resize(screen.size.val())
        }
        this.clear()
        this.update()
    }

    // protected getScreenTransfrom(): Matrix3x3 {
    //     // return screen.transform.val()
    // }

    protected _ctx() { return this.ctx }

    abstract update(): void

    destroy() {
        screen.size.detach(this)
    }

}


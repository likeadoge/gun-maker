import { Ref, Watcher } from "@/reactive/base";
import { Matrix3x3 } from "@/utils/coordinate";
import { CanvasHandle } from "@/utils/canvas";
import { sight } from "./Sight";
import { Size } from "@/utils";

export class PreivewCanvas extends CanvasHandle<HTMLCanvasElement>{
    constructor() {
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
        if (r === sight.size) {
            this.resize(sight.size.val())
        }
        this.clear()
        this.update()
    }

    protected getScreenTransfrom(): Matrix3x3 {
        return sight.transform.val()
    }

    protected _ctx() { return this.ctx }

    abstract update(): void

    destroy() {
        sight.size.detach(this)
    }

}


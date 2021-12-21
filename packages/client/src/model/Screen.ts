import { Computed, Reactive, Ref, Watcher } from "@/reactive/base"
import { Matrix3x3, Pos, Size } from "@/utils"
import { CanvasHandle } from "@/utils/canvas"
import { Img } from "./Image"
import { Move, Scale } from "./Transform"

export class Screen {
    size = new Reactive(new Size(100, 100))
    move = new Reactive(new Move(new Pos(0)))
    scale = new Reactive(new Scale(new Pos(0), new Pos(1)))
    transform: Ref<Matrix3x3>

    constructor() {
        this.transform = new Computed<[Ref<Move>, Ref<Scale>, Ref<Size>], Matrix3x3>([this.move, this.scale, this.size], (move, scale, size) => {
            const s = scale.val().matrix()
            const m = move.val().matrix()
            const o = new Move(new Pos(size.val().width / 2, - size.val().height / 2)).matrix()
            return s.mul(m).mul(o)
        })
    }
}

export const screen = new Screen()

export abstract class LayerScreen extends CanvasHandle<OffscreenCanvas> implements Watcher<Size>, Watcher<Matrix3x3>{

    constructor() {
        super(new OffscreenCanvas(
            screen.size.val().width,
            screen.size.val().height
        ))
        screen.size.attach(this)
        screen.transform.attach(this)
    }

    emit(r: Ref<any>) {
        if (r === screen.size) {
            this.resize(screen.size.val())
        }
        this.clear()
        this.update()
    }

    protected getScreenTransfrom(): Matrix3x3 {
        return screen.transform.val()
    }

    protected _ctx() { return this.ctx }

    abstract update(): void

    destroy() {
        screen.size.detach(this)
    }

}


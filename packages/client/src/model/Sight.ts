import { Computed, Reactive, Ref, Watcher } from "@/reactive/base"
import { Matrix3x3, Pos, Size } from "@/utils"
import { LayerScreen } from "./Screen"
import { Move, Rotate, Scale } from "./Transform"

export class Sight {
    size = new Reactive(new Size(1080, 1920))
    rotate = new Reactive(new Rotate(new Pos(0), Math.PI/6))
    scale = new Reactive(new Scale(new Pos(0), new Pos(0.5)))
    transform: Ref<Matrix3x3>

    constructor() {
        this.transform = new Computed<[Ref<Rotate>, Ref<Scale>, Ref<Size>], Matrix3x3>([this.rotate, this.scale, this.size], (rotate, scale, size) => {
            const s = scale.val().inverse().matrix()
            const r = rotate.val().inverse().matrix()
            const o = new Move(new Pos(size.val().width / 2, - size.val().height / 2)).matrix()
            return r.mul(s).mul(o)
        })
    }
}

export const sight = new Sight()


export class SightLayerScreen
    extends
    LayerScreen
    implements
    Watcher<Scale>,
    Watcher<Size>,
    Watcher<Rotate>{

    constructor() {
        super()
        this.update()
        sight.scale.attach(this)
        sight.size.attach(this)
        sight.rotate.attach(this)
    }

    update() {

        this.transform(
            this.getScreenTransfrom()
        )

        this._ctx().globalAlpha = 0.2
        this.rect(
            new Pos(-100, 100),
            new Size(200, 200),
            { fill: true }
        )

        this.transform(null)

        const s = sight.scale.val().matrix()
        const r = sight.rotate.val().matrix()

        const mat = s.mul(r)

        this.transform(
            mat.mul(this.getScreenTransfrom())
        )

        this.rect(
            new Pos(
                sight.size.val().width / -2,
                sight.size.val().height / 2
            ),
            sight.size.val(),
            { fill: true }
        )

    }

    destroy() {
        super.destroy()

    }

}

export const sightLayerScreen = new Reactive(new SightLayerScreen())
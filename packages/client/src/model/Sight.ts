import { Reactive, Watcher } from "@/reactive/base"
import { Pos, Size } from "@/utils"
import { LayerScreen } from "./Screen"
import { Rotate, Scale } from "./Transform"

export class Sight {
    size = new Reactive(new Size(1080, 1920))
    rotate = new Reactive(new Rotate(new Pos(0), Math.PI/6))
    scale = new Reactive(new Scale(new Pos(0), new Pos(0.5)))
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
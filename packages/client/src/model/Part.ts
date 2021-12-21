import { Computed, Effect, Mut, Reactive, Ref, Watcher } from "@/reactive/base"
import { Matrix3x3, Pos, Size } from "@/utils"
import { Img } from "./Image"
import { Move, Scale, Transfrom } from "./Transform"
import { CacheList } from "@/reactive/cache"
import { LayerScreen, screen } from "./Screen"




export class Part {
    image: Img
    origin: Pos
    constructor(image: Img) {
        this.image = image
        this.origin = new Pos(
            this.image.size.width * 0.5,
            this.image.size.height * 0.5
        )
    }
    transforms: Transfrom[] = []


    matrix() {
        const o = this.origin
        return this.transforms.reduce<Matrix3x3>((r, v) => {
            const cur = v.matrix(o)
            return r.mul(cur)
        }, new Matrix3x3(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ))
    }
}

export class PartLayerScreen extends LayerScreen implements Watcher<Part>{
    part: Ref<Part>
    constructor(part: Ref<Part>) {
        super()
        this.part = part
        this.part.attach(this)
        this.update()
    }

    update() {
        this.transform(
            this.part.val()
                .matrix()
                .mul(this.getScreenTransfrom())
        )

        this._ctx().globalAlpha = 0.2

        this.img(this.part.val().image, this.part.val().origin.trans(v => -v))

    }

    destroy() {
        super.destroy()
        this.part.detach(this)
    }

}

export const layerList: Mut<Mut<Part>[]> = new Reactive<Mut<Part>[]>([])

export const layerScreenList = new CacheList<Mut<Part>, Ref<PartLayerScreen>>(layerList, (layer) => layer
    .compute(layer => new PartLayerScreen(layer))
)

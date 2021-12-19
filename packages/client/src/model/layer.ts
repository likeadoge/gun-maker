import { Computed, Effect, Mut, Reactive, Ref, Watcher } from "@/reactive/base"
import { Matrix3x3, Pos, Size } from "@/utils"
import { Img } from "./Image"
import { Move, Scale, Transfrom } from "./Transform"
import { screen } from './Screen'
import { CacheList } from "@/reactive/cache"




export class Layer {
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

export class LayerScreen {
    ctx: OffscreenCanvasRenderingContext2D

    screen: OffscreenCanvas
    screenSize: Ref<Size>
    screenSizeEffect: Effect<Size>

    layer: Ref<Layer>
    layerTransform: Matrix3x3
    layerTransformEffect: Effect<Layer>

    global: Ref<Matrix3x3>
    globalTransfrom: Matrix3x3
    globalTransformEffect: Effect<Matrix3x3>


    constructor(
        layer: Ref<Layer>,
        screenSize: Ref<Size>,
        global: Ref<Matrix3x3>
    ) {

        this.layer = layer
        this.layerTransform = this.layer.val().matrix()
        this.layerTransformEffect = new Effect(() => {
            this.layerTransform = this.layer.val().matrix()
            this.render()
        }, this.layer)

        this.screenSize = screenSize
        this.screen = new OffscreenCanvas(
            this.screenSize.val().width,
            this.screenSize.val().height
        )
        this.screenSizeEffect = new Effect((size) => {
            this.screen.height = size.height
            this.screen.width = size.width
            this.render()
        }, this.screenSize)

        this.global = global
        this.globalTransfrom = global.val()
        this.globalTransformEffect = new Effect((mat) => {
            this.globalTransfrom = mat
            this.render()
        }, this.global)

        const ctx = this.screen.getContext('2d')
        if (!ctx) throw new Error('canvas error')

        this.ctx = ctx
    }

    private render() {

        // const transform = this.layer.matrix(this.layer.origin)

        // const center = new Move(new Pos(
        //     this.size.width * 0.5,
        //     this.size.height * 0.5
        // ).sub(
        //     this.layer.origin
        // ).trans(x => x, y => -y)).matrix()

        // const offset = new Move(this.offset).matrix()


        // const mat = transform.mul(center).mul(offset)

        // this.ctx.setTransform(...mat.trans())

        // this.ctx.globalAlpha = 0.2

        // this.ctx.drawImage(
        //     this.layer.image.target, 0, 0
        // )
    }
}

export const layerList: Mut<Mut<Layer>[]> = new Reactive<Mut<Layer>[]>([])

const globalTransfrom = new Computed<[Ref<Move>, Ref<Scale>], Matrix3x3>([screen.move, screen.scale], (move, size) => {
    return move.val().matrix().mul(size.val().matrix())
})

export const layerScreenList = new CacheList<Mut<Layer>, Ref<LayerScreen>>(layerList, (layer) => layer
    .compute(layer =>new LayerScreen(layer, screen.size, globalTransfrom))
)

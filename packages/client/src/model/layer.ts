import { Matrix3x3, Pos, Size } from "@/utils"
import { Img } from "./Image"


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
    transforms: Transfrom[] = [new Rotate(new Pos(0), Math.PI / 6)]


    matrix(o: Pos) {
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
    layer: Layer
    screen: OffscreenCanvas
    ctx: OffscreenCanvasRenderingContext2D

    size: Size
    offset: Pos

    constructor(layer: Layer, size: Size, offset: Pos) {
        this.layer = layer
        this.size = size
        this.offset = offset
        this.screen = new OffscreenCanvas(
            this.size.width,
            this.size.height
        )
        const ctx = this.screen.getContext('2d')
        if (!ctx) throw new Error('canvas error')

        this.ctx = ctx
    }

    private clear() {
        this.ctx.clearRect(0, 0, this.size.width, this.size.height)
    }

    private updateSize() {
        this.screen.height = this.size.height
        this.screen.width = this.size.width
    }

    private updateImage() {

        const transform = this.layer.matrix(this.layer.origin)

        const center = new Move(new Pos(
            this.size.width * 0.5,
            this.size.height * 0.5
        ).sub(
            this.layer.origin
        ).trans(x => x, y => -y)).matrix()

        const offset = new Move(this.offset).matrix()


        const mat = transform.mul(center).mul(offset)

        this.ctx.setTransform(...mat.trans())

        this.ctx.globalAlpha = 0.2

        this.ctx.drawImage(
            this.layer.image.target, 0, 0
        )

    }


    render() {
        console.log(this.size.width, this.size.height)
        this.clear()
        this.updateSize()
        this.updateImage()
    }
}


//https://blog.csdn.net/z397164725/article/details/8276452
//https://www.w3resource.com/html5-canvas/html5-canvas-matrix-transforms.php
export abstract class Transfrom {

    abstract matrix(o: Pos): Matrix3x3
}

export class Move extends Transfrom {
    offset = new Pos(0, 0)

    constructor(pos: Pos) {
        super()
        this.offset = pos
    }

    matrix() {
        return new Matrix3x3(
            1, 0, this.offset.x,
            0, 1, - this.offset.y,
            0, 0, 1
        )
    }
}

export class Scale extends Transfrom {
    ratio = new Pos(0, 0)
    origin = new Pos(0, 0)
    matrix() {
        const step0 = new Move(this.origin.trans(n => -n)).matrix()
        const step1 = new Matrix3x3(
            this.ratio.x, 0, 0,
            0, this.ratio.y, 0,
            0, 0, 1
        )
        const step2 = new Move(this.origin.trans(n => n)).matrix()

        return step0.mul(step1).mul(step2)
    }
}

export class Rotate extends Transfrom {
    angle: number = 1
    origin = new Pos(0, 0)

    constructor(pos: Pos, angel: number) {
        super()
        this.origin = pos
        this.angle = angel
    }

    matrix(o: Pos) {
        const sin = Math.sin(this.angle)
        const cos = Math.cos(this.angle)

        const ori = this.origin.add(o.trans(x => x, y => -y))

        const step0 = new Move(ori.trans(n => -n)).matrix()
        const step1 = new Matrix3x3(
            cos, -sin, 0,
            sin, cos, 0,
            0, 0, 1
        )
        const step2 = new Move(ori.trans(n => n)).matrix()

        return step0.mul(step1).mul(step2)
    }
}

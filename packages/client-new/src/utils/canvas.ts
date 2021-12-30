import { Img } from "./image"
import { Size } from "./position"
import { Matrix3x3, Pos } from "./coordinate"

type CanvasLike = HTMLCanvasElement | OffscreenCanvas
type CanvasCtx<T extends CanvasLike> = T extends HTMLCanvasElement
    ? CanvasRenderingContext2D : OffscreenCanvasRenderingContext2D

export class CanvasHandle<T extends CanvasLike> {
    canvas: T
    ctx: CanvasCtx<T>

    constructor(canvas: T) {
        this.canvas = canvas
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('ctx error!')
        this.ctx = ctx as CanvasCtx<T>
    }

    resize(size: Size) {
        this.canvas.width = size.width
        this.canvas.height = size.height
    }

    clear() {
        this.ctx.resetTransform()
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    private pos(pos: Pos) {
        const x = pos.x
        const y = - pos.y
        return new Pos(x, y)
    }

    rect(pos: Pos, size: Size,
        { fill = true }: { fill?: boolean } = {}
    ) {
        const p = this.pos(pos)

        if (fill) {
            this.ctx.fillRect(p.x, p.y, size.width, size.height)
        } else {
            this.ctx.strokeRect(p.x, p.y, size.width, size.height)
        }
    }
    img(image: Img, p: Pos) {
        this.ctx.drawImage(image.target, p.x, p.y,)
    }
    source(source: CanvasImageSource, p: Pos) {
        this.ctx.drawImage(source, p.x, p.y)
    }
    transform(m: Matrix3x3 | null) {
        if (!m)
            this.ctx.resetTransform()
        else {
            const [x0, x1, x2, x3, x4, x5] = m.val
            this.ctx.setTransform(x0, x1, x2, x3, x4, x5)
        }
    }

}
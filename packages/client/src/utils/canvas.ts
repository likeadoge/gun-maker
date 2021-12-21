import { Img } from "@/model/Image"
import { Matrix3x3, Pos, Size } from "."

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

    img(image: Img, p: Pos) {
        this.ctx.drawImage(image.target, p.x, p.y,)
    }

    transform(m: Matrix3x3 | null) {
        if (!m)
            this.ctx.resetTransform()
        else
            this.ctx.setTransform(...m.trans())
    }

}
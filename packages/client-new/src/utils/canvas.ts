import { Img } from "./image"
import { Positon, Size } from "./position"
import { Matrix3x3, Point } from "./coordinate"

type CanvasLike = HTMLCanvasElement | OffscreenCanvas
type CanvasCtx<T extends CanvasLike> = T extends HTMLCanvasElement ? CanvasRenderingContext2D
    : T extends OffscreenCanvas ? OffscreenCanvasRenderingContext2D
    : never

export class CanvasHandle<T extends CanvasLike> {
    target: T
    private ctx: CanvasCtx<T>


    constructor(canvas: T) {
        this.target = canvas
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('ctx error!')
        this.ctx = ctx as CanvasCtx<T>

        this.size = Size.create(this.target.width, this.target.height)
    }

    size: Size
    resize(size: Size) {
        this.target.width = this.size.width = size.width
        this.target.height = this.size.height = size.height
    }

    // 通过坐标计算位置
    positon(p: Point, { left_top }: { left_top?: Size } = {}) {
        const top = this.size.height / 2 - p.y - (left_top ? left_top.height / 2 : 0)
        const left = this.size.width / 2 + p.x - (left_top ? left_top.width / 2 : 0)
        return Positon.create(top, left)
    }


    // 清空
    clear() {
        this.ctx.resetTransform()
        this.ctx.clearRect(0, 0, this.target.width, this.target.height)
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0)';
        this.ctx.fillRect(0, 0, this.target.width, this.target.height)
    }

    // 矩阵变换
    transform(m: Matrix3x3 | null) {
        console.log(m)
        if (!m)
            this.ctx.resetTransform()
        else {
            const [a, c, e, b, d, f] = m.val
            this.ctx.setTransform(a, b, c, d, e, f)
        }
    }

    rect(pos: Point, size: Size,
        { fill = true }: { fill?: boolean } = {}
    ) {
        const p = this.positon(pos,{left_top:size})

        if (fill) {
            this.ctx.fillStyle = 'rgb(0,0,0)'
            this.ctx.fillRect(p.left, p.top, size.width, size.height)
        } else {
            this.ctx.strokeRect(p.left, p.top, size.width, size.height)
        }
    }

    source(source: CanvasHandle<CanvasLike> | Img, p: Point) {
        const np = this.positon(p, { left_top: source.size })
        this.ctx.drawImage(source.target, np.left, np.top)
    }


}
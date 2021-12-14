import { Img } from "@/model/Image";
import { Layer, LayerScreen, Rotate } from "@/model/layer";
import { Effect, Mut, Reactive, Ref } from "@/reactive/base";
import { shadow, transition } from "@/style";
import { Pos, Size, style } from "@/utils";
import { css, View } from "@/utils/view";


@css<typeof WorkWindow>('.work-window', v => v.classList.add('work-window'), {
    '&': {
        'height': '100%',
        'width': '100%',
        'overflow': 'hidden',
        'background': '#fff',
    },
    'canvas': {
        'height': '100%',
        'width': '100%',
    }
})
export class WorkWindow extends View {

    static ro = new ResizeObserver(entries => {
        for (let entry of entries) {
            // const cr = entry.contentRect;
            const ww = WorkWindow.map.get(entry.target)

            if (ww) {
                ww.reset()
            }
        }
    })

    static map = new WeakMap<Element, WorkWindow>()

    screen: Screen
    move: MouseMovement
    scale: Ref<number>
    scaleEff: Effect<number>
    layers: Reactive<Layer[]>
    layersEff: Effect<Layer[]>

    constructor({ scale, layers }: { scale: Ref<number>, layers: Reactive<Layer[]> }) {
        const $el = document.createElement('div')
        const canvas = document.createElement('canvas')
        const handle = new CanvasHandle(canvas)
        const screen = new Screen(handle, { scale })
        $el.appendChild(canvas)


        super($el)
        const { height, width } = this.$el.getBoundingClientRect()
        this.screen = screen

        this.scale = scale
        this.scaleEff = new Effect(() => { this.reset() })
        this.scale.attach(this.scaleEff)

        this.layers = layers
        this.layersEff = new Effect(() => {
            const layers = this.layers.val()
            this.screen.update({ layers })
        })
        this.layers.attach(this.layersEff)

        const size = new Size(width, height)
        this.screen.update({ size })

        this.move = new MouseMovement(this.$el, { scale: this.scale })
        this.move.getNow = () => this.screen.offset
        this.move.move = (offset) => {
            this.screen.update({ offset })
        }

        WorkWindow.map.set(this.$el, this)
        WorkWindow.ro.observe(this.$el)



        const img = new Img(`https://photo.16pic.com/00/61/76/16pic_6176781_b.jpg`)

        img.done.then(() => {

            const l1 = new Layer(img)
            const l2 = new Layer(img)

            l1.transforms = [new Rotate(new Pos(100),0)]
            l2.transforms = [new Rotate(new Pos(100),Math.PI/6)]

            this.layers.set([l1,l2])

        })

    }

    reset() {
        const { width, height } = this.$el.getBoundingClientRect()
        const scale = this.scale.val()
        const size = new Size(width * scale, height * scale)
        this.screen.update({ size })
    }

    destory() {
        super.destory()
        WorkWindow.ro.unobserve(this.$el)
        this.scale.detach(this.scaleEff)
        this.layers.detach(this.layersEff)
    }
}

class CanvasPos extends Pos { }

class CanvasHandle {
    size = new Size(100, 100)

    canvas: HTMLCanvasElement = null as any
    ctx: CanvasRenderingContext2D = null as any

    constructor(canvas: HTMLCanvasElement,) {
        this.canvas = canvas
        const ctx = this.canvas.getContext('2d')
        if (!ctx) throw new Error('canvas error!!!')
        this.ctx = ctx
    }

    resetSize({ height, width }: Size) {
        this.size = new Size(width, height)
        this.canvas.height = height
        this.canvas.width = width
        this.canvas.style.height = '100%'
        this.canvas.style.width = '100%'
    }

    line(begin: CanvasPos, end: CanvasPos,
        { width, color }: {
            width?: number,
            color?: string
        } = {}
    ) {
        this.ctx.beginPath()
        this.ctx.moveTo(begin.x, begin.y)
        this.ctx.lineTo(end.x, end.y)
        this.ctx.strokeStyle = color || '#ccc'
        this.ctx.lineWidth = width || 1
        this.ctx.stroke()
    }

    rect(pos: CanvasPos, size: Size,
        { fill = true }: { fill?: boolean } = {}
    ) {
        if (fill) {
            this.ctx.fillRect(pos.x, pos.y, size.width, size.height)
        } else {
            this.ctx.strokeRect(pos.x, pos.y, size.width, size.height)
        }
    }
    img(img: CanvasImageSource, pos: Pos) {
        this.ctx.drawImage(img, pos.x, pos.y)
    }

    clear() {
        this.ctx.clearRect(0, 0, this.size.width, this.size.height)
    }


}
class Screen {
    constructor(handle: CanvasHandle, op: { scale: Ref<number> }) {
        this.handle = handle
        this.scale = op.scale
    }

    offset = new Pos(0, 0)
    origin = new Pos(0, 0)
    layerScreens: LayerScreen[] = []

    viewSize = new Size(200, 200)
    scale: Ref<number>

    handle: CanvasHandle
    screenSize() { return this.handle.size }

    // 坐标转换函数
    trans(pos: Pos) {
        const x = this.transX(pos.x)
        const y = this.transY(pos.y)
        return new CanvasPos(x, y)
    }
    transX(x: number) {
        return this.screenSize().width / 2 + this.offset.x + x
    }
    transY(y: number) {
        return this.screenSize().height / 2 - this.offset.y - y
    }

    // 画坐标轴
    axis() {
        const { x, y } = this.offset

        if (
            x < this.screenSize().width / 2
            && x > (-this.screenSize().width / 2)
        ) {

            this.handle.line(
                new CanvasPos(this.transX(0), 0),
                new CanvasPos(this.transX(0), this.screenSize().height), {
                width: 2
            }
            )
        }

        if (
            y < this.screenSize().height / 2
            && y > (-this.screenSize().height / 2)
        ) {
            this.handle.line(
                new CanvasPos(0, this.transY(0)),
                new CanvasPos(this.screenSize().width, this.transY(0)), {
                width: 2
            }
            )
        }

    }
    view() {
        const p = new Pos(-this.viewSize.width / 2, this.viewSize.height / 2)
        this.handle.rect(this.trans(p), this.viewSize, { fill: false })
    }
    layer() {
        this.layerScreens.forEach(v => {
            v.offset = this.offset
            v.size = this.screenSize()
            v.render()
            this.handle.img(v.screen, new Pos(0, 0))
        })
    }
    update({ size, offset, layers }: { size?: Size, offset?: Pos, layers?: Layer[] }) {
        if (size) {
            this.handle.resetSize(size)
        }
        if (offset) {
            this.offset = offset
        }
        if (layers) {
            this.layerScreens = layers.map(v =>
                new LayerScreen(v, this.screenSize(), this.offset))
        }
        this.handle.clear()
        this.layer()
        this.view()
        this.axis()
    }

}
class MouseMovement {

    el: HTMLElement

    from?: Pos | 'start'
    now: Pos = new Pos(0, 0)
    scale: Ref<number>

    constructor(el: HTMLElement, op: { scale: Ref<number> }) {
        this.el = el
        this.scale = op.scale

        this.el.onmousedown = () => {
            this.from = 'start'
            this.now = this.getNow()
            this.el.classList.add('mouse-move')

            this.el.onmousemove = (e) => {
                if (!this.from)
                    return
                else if (this.from === 'start')
                    this.from = new Pos(e.clientX, e.clientY)
                else {
                    const x = (e.clientX - this.from.x) * this.scale.val()
                    const y = -(e.clientY - this.from.y) * this.scale.val()
                    this.move(this.now.trans(_ => x + _, _ => y + _))
                }
            }
            this.el.onmouseup = this.el.onmouseleave = (e) => {
                this.el.classList.remove('mouse-move')
                this.el.onmouseover = null
                this.el.onmouseup = null
                this.el.onmouseleave = null
                this.from = undefined
            }
        }

    }

    move: (p: Pos) => void = () => { }
    getNow: () => Pos = () => new Pos(0, 0)
}
style({
    '.mouse-move': {
        'cursor': 'move'
    }
})
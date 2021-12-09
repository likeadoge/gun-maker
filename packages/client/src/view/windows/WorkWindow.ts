import { Effect, Mut } from "@/reactive/base";
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
            const cr = entry.contentRect;
            const ww = WorkWindow.map.get(entry.target)

            if (ww) {
                ww.reset(new Size(cr.width, cr.height))
            }
        }
    })

    static map = new WeakMap<Element, WorkWindow>()

    screen: Screen
    move: MouseMovement

    constructor() {
        const $el = document.createElement('div')
        const canvas = document.createElement('canvas')
        const handle = new CanvasHandle(canvas)
        const screen = new Screen(handle)
        $el.appendChild(canvas)


        super($el)
        const { height, width } = this.$el.getBoundingClientRect()
        this.screen = screen
        this.screen.update(new Size(width, height))
        this.move = new MouseMovement(this.$el)
        this.move.getNow = () => this.screen.offset
        this.move.move = (p) => {
            this.screen.offset = p
            this.screen.update()
        }

        WorkWindow.map.set(this.$el, this)
        WorkWindow.ro.observe(this.$el)
    }

    reset(size: Size) {
        this.screen.update(size)
    }

    destory() {
        super.destory()
        WorkWindow.ro.unobserve(this.$el)
    }
}

class CanvasPos extends Pos { }

class CanvasHandle {
    size = new Size(100, 100)

    canvas: HTMLCanvasElement = null as any
    ctx: CanvasRenderingContext2D = null as any

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        const ctx = this.canvas.getContext('2d')
        if (!ctx) throw new Error('canvas error!!!')
        this.ctx = ctx
    }

    resetSize({ height, width }: Size) {
        this.size = new Size(width, height)
        this.canvas.height = height
        this.canvas.style.height = height + 'px'
        this.canvas.style.width = width + 'px'
        this.canvas.width = width
        this.clear()
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

    clear() {
        this.ctx.clearRect(0, 0, this.size.width, this.size.height)
    }


}
class Screen {
    constructor(handle: CanvasHandle) {
        this.handle = handle
    }

    offset = new Pos(0, 0)
    origin = new Pos(0, 0)
    viewSize = new Size(600, 800)

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
                new CanvasPos(this.transX(0), this.screenSize().height)
            )
        }

        if (
            y < this.screenSize().height / 2
            && y > (-this.screenSize().height / 2)
        ) {
            this.handle.line(
                new CanvasPos(0, this.transY(0)),
                new CanvasPos(this.screenSize().width, this.transY(0)),
            )
        }

    }
    view() {
        const p = new Pos(-this.viewSize.width / 2, this.viewSize.height / 2)
        this.handle.rect(this.trans(p), this.viewSize, { fill: false })
    }

    update(size?: Size) {
        if (size) {
            this.handle.resetSize(size)
        } else {
            this.handle.clear()
        }
        this.axis()
        this.view()
    }

}

class MouseMovement {

    el: HTMLElement

    from?: Pos | 'start'
    now: Pos = new Pos(0, 0)

    constructor(el: HTMLElement) {
        this.el = el

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
                    const x = e.clientX - this.from.x
                    const y = -(e.clientY - this.from.y)
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
style({'.mouse-move':{
    'cursor':'move'
}})

import { Layer, layerScreenList } from "@/model/Layer";
import { Effect, Mut, Reactive, Ref, Watcher } from "@/reactive/base";
import { nextTick, Pos, Size, style } from "@/utils";
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
    layers: Ref<Ref<Layer>[]>
    layersEff: Effect<Ref<Layer>[]>

    constructor({ scale, layers }: { scale: Ref<number>, layers: Ref<Ref<Layer>[]> }) {
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
            const layers = this.layers.val().map(v => v.val())
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
    }

    reset() {
        const { width, height } = this.$el.getBoundingClientRect()
        const scale = this.scale.val()
        const size = new Size(width * scale, height * scale)
        this.screen.update({ size })
    }

    destroy() {
        super.destroy()
        WorkWindow.ro.unobserve(this.$el)
        this.scale.detach(this.scaleEff)
        this.layers.detach(this.layersEff)
    }
}
class CanvasPos extends Pos { _ = 'canvas' }

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
class Screen implements Watcher<Ref<Layer>[]>{

    private handle : CanvasHandle
    constructor(handle:CanvasHandle){
        this.handle = handle
        this.layers.attach(this)
    }
    private layers = layerScreenList
    private update(){
        const layers = this.layers.val().map(v=>v.val())

        this.handle.clear()
        layers.forEach(v=>{
            this.handle.img(v.screen,new Pos(0))
        })
    }

    async emit(){
        await nextTick()
        this.update()
    }

    destroy(){
        this.layers.detach(this)
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
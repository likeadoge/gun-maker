
import { Part, layerScreenList, PartLayerScreen } from "@/model/Part";
import { asyncEmit, Effect, Mut, Reactive, Ref, Watcher } from "@/reactive/base";
import { Matrix3x3, nextTick, Pos, Size, style } from "@/utils";
import { css, View } from "@/utils/view";
import { LayerScreen, screen } from "@/model/Screen"
import { Move, Scale } from "@/model/Transform";

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
export class WorkWindow extends View implements Watcher<Size>, Watcher<Matrix3x3>, Watcher<Ref<PartLayerScreen>[]>{

    static ro = new ResizeObserver(entries => {
        for (let entry of entries) {
            const cr = entry.contentRect;
            screen.size.set(new Size(Math.floor(cr.width), Math.floor(cr.height)))
        }
    })

    handle: CanvasHandle
    movement: MouseMovement

    constructor() {
        const $el = document.createElement('div')
        const canvas = document.createElement('canvas')
        $el.appendChild(canvas)
        super($el)

        this.handle = new CanvasHandle(canvas)
        this.movement = new MouseMovement(this.$el, {
            scale: new Reactive(1)
        })
        this.movement.getNow = () => screen.move.val().offset
        this.movement.move = (pos) => {
            screen.move.set(new Move(pos))
        }

        WorkWindow.ro.observe(this.$el)

        screen.size.attach(this)
        screen.transform.attach(this)
        layerScreenList.attach(this)

        this.update()
    }


    @asyncEmit
    emit(r: Ref<Size> | Ref<Matrix3x3> | Ref<Ref<PartLayerScreen>[]>) {
        this.handle.clear()
        if (r === screen.size) {
            this.handle.resize(screen.size.val())
        }
        this.update()
    }

    update() {
        console.log('update')
        this.handle.clear()
        this.handle.transform(screen.transform.val())
        this.handle.rect(
            new Pos(-100, 100),
            new Size(200, 200),
            { fill: false }
        )
        this.handle.transform(false)

        layerScreenList.val().forEach(layerScreen => {
            this.handle.img(layerScreen.val().canvas, new Pos(0))
        });
    }

    destroy() {
        super.destroy()
        WorkWindow.ro.unobserve(this.$el)
        screen.size.detach(this)
        screen.transform.detach(this)
        layerScreenList.detach(this)
    }
}

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

    private pos(pos: Pos) {
        const x = pos.x
        const y = - pos.y
        return new Pos(x, y)
    }

    resize({ height, width }: Size) {
        this.size = new Size(width, height)
        this.canvas.height = height
        this.canvas.width = width
    }
    transform(mat: Matrix3x3 | false) {
        if (mat)
            this.ctx.setTransform(...mat.trans())
        else
            this.ctx.resetTransform()
    }
    line(begin: Pos, end: Pos,
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
    img(img: CanvasImageSource, pos: Pos) {
        this.ctx.drawImage(img, pos.x, pos.y)
    }
    clear() {
        this.ctx.resetTransform()
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
}
style({
    '.mouse-move': {
        'cursor': 'move'
    }
})
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



export const workWindow = new WorkWindow()
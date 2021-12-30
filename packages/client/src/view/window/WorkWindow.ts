import { layerScreenList } from "@/model/Layer";
import { LayerScreen } from "@/model/Screen";
import { Watcher, Ref, Reactive, asyncEmit } from "@/reactive/base";
import { Size } from "@/utils";
import { screen } from "@/model/Screen"
import { CanvasHandle } from "@/utils/canvas";
import { Matrix3x3, Move, Pos } from "@/utils/coordinate";
import { style } from "@/utils/style";
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

export class WorkWindow extends View implements Watcher<Size>, Watcher<Matrix3x3>, Watcher<Ref<LayerScreen>[]>{

    static ro = new ResizeObserver(entries => {
        for (let entry of entries) {
            const cr = entry.contentRect;
            screen.size.set(new Size(Math.floor(cr.width), Math.floor(cr.height)))
        }
    })

    handle: CanvasHandle<HTMLCanvasElement>
    movement: MouseMovement


    constructor() {
        const $el = document.createElement('div')
        const canvas = document.createElement('canvas')
        $el.appendChild(canvas)
        super($el)

        this.handle = new CanvasHandle(canvas)
        this.movement = new MouseMovement(this.$el, {
            scale: screen.scale.compute(v=>v.val().ratio.x)
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
    emit(r: Ref<Size> | Ref<Matrix3x3> | Ref<Ref<LayerScreen>[]>) {
        this.handle.clear()
        if (r === screen.size) {
            this.handle.resize(screen.size.val())
        }
        this.update()
    }

    update() {
        console.log('update')
        this.handle.clear()
        this.handle.transform(null)

        layerScreenList.val().forEach(layerScreen => {
            this.handle.source(layerScreen.val().canvas, new Pos(0))
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
                    const x = (e.clientX - this.from.x) / this.scale.val()
                    const y = -(e.clientY - this.from.y) / this.scale.val()
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
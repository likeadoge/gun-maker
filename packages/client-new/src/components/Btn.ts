import { Effect, Mut } from "@/utils/reactive";
import { shadow, transition } from "@/style/common";
import { css, View } from '@/utils/view'


@css('.btn-group', v => v.className += 'btn-group', {
    '': {
        'display': 'flex',
        'padding': '6px',
        'flexDirection': 'row',
        'justifyContent': 'left',
        'alignItems': 'center',
    }
})
export class BtnGroup extends View {


}


// @css('.btn', v => v.className += 'btn', {
//     '': {
//         ...shadow(3),
//         ...transition(),
//         'cursor': 'pointer',
//         'margin': '6px',
//         'background-color': '#ff1744',
//         'color': '#fff',
//         'font-size': '36px',
//         'padding': '3px 6px',
//         'border-radius': '3px',
//     },
//     '&:hover': {
//         ...shadow(5),
//         'opacity': '0.85'
//     },
//     '&:active': {
//         ...shadow(0),
//     }
// })
// export class Btn extends View {

// }


@css('.toggle-btn', v => v.classList.add('toggle-btn'), {
    '&': {
        ...shadow(0),
        ...transition(),
        'cursor': 'pointer',
        'margin': '6px',
        'backgroundColor': '#ff1744',
        'color': '#fff',
        'filter': 'grayscale(100%)',
        'fontSize': '36px',
        'padding': '3px 6px',
        'borderRadius': '3px',
    },
    '&:hover': {
        'opacity': '0.85'
    },
    "&.selected": {
        ...shadow(4),
        'filter': 'grayscale(0)',
    },
})
export class ToggleBtn extends View {

    status: Mut<boolean>

    effect: Effect<boolean>

    constructor(status: Mut<boolean>) {
        super()
        this.status = status
        this.$root.onclick = () => this.status.update(!this.status.val())
        this.effect = new Effect(v => this.$root.classList[v ? 'add' : 'remove']('selected'))
        this.status.attach(this.effect)
    }

    destroy() {
        super.destroy()
        this.status.detach(this.effect)
    }
}


@css('.slider-btn', v => v.classList.add('slider-btn'), {
    '&': {
        'position': 'relative',
        'margin': '0 12px',
        'padding': '12px 0'
    },
    '&::before': {
        'content': '""',
        'display': 'block',
        'height': '4px',
        'borderRadius': '2px',
        'position': 'relative',
        'background': '#66ccff',

    },
    'div': {
        ...shadow(4),
        'top': '2px',
        'position': 'absolute',
        'height': '24px',
        'width': '24px',
        'cursor': 'pointer',
        'borderRadius': '50%',
        'background': '#ff1744',
        'transform': 'translateX(-12px)'
    },
})

export class SliderBtn extends View {
    status: Mut<number>
    effect: Effect<number>
    slider: HTMLDivElement
    move: SliderMovement
    constructor(status: Mut<number>) {
        super()
        this.status = status
        this.effect = new Effect(v => {
            this.slider.style.left = v * 100 + '%'
        })
        this.slider = document.createElement('div')
        this.$root.appendChild(this.slider)
        this.move = new SliderMovement(this.$root, this.slider)
        this.status.attach(this.effect)

        this.move.getNow = () => this.status.val()
        this.move.move = (s) => { this.status.update(s) }

        this.status.update(this.status.val())
    }
}
class SliderMovement {

    el: HTMLElement
    silder: HTMLElement

    from?: number | 'start'
    now: number = 0

    constructor(el: HTMLElement, silder: HTMLElement) {
        this.el = el
        this.silder = silder

        this.silder.onmousedown = () => {
            this.from = 'start'
            this.now = this.getNow()
            this.silder.classList.add('mouse-move')

            let { width } = this.el.getBoundingClientRect()

            const move = (e:MouseEvent) => {
                if (!this.from)
                    return
                else if (this.from === 'start')
                    this.from = e.clientX
                else {
                    let x = e.clientX - this.from
                    x = x / width + this.now
                    x = x > 1 ? 1 : x < 0 ? 0 : x
                    this.move(x)
                }
            }
            const done = () => {
                this.el.classList.remove('mouse-move')
                document.removeEventListener('mousemove',move)
                document.removeEventListener('mouseleave',done)
                document.removeEventListener('mouseup',done)
                this.done()
                this.from = undefined
            }

            document.addEventListener('mousemove',move)
            document.addEventListener('mouseleave',done)
            document.addEventListener('mouseup',done)
        }

    }

    move: (num: number) => void = (n) => { console.log(n) }
    done: () => void = () => { }
    getNow: () => number = () => 0
}
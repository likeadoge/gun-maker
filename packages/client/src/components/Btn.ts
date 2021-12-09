import { Effect, Mut } from "@/reactive/base";
import { shadow, transition } from "@/style";
import { css, View } from '@/utils/view'


@css('.btn-group', v => v.className += 'btn-group', {
    '': {
        'display': 'flex',
        'padding': '6px',
        'flex-direction': 'row',
        'justify-content': 'left',
        'align-items': 'center',
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
        'background-color': '#ff1744',
        'color': '#fff',
        'filter': 'grayscale(100%)',
        'font-size': '36px',
        'padding': '3px 6px',
        'border-radius': '3px',
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
        this.$el.onclick = () => this.status.update(v => !v)
        this.effect = new Effect(v => this.$el.classList[v ? 'add' : 'remove']('selected'))
        this.status.attach(this.effect)
    }
}
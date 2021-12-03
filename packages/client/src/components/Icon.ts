import { css, View } from './Base'

@css('.icon',el => { el.className += 'icon'}, {
    '': {
        'width': '1em',
        'height': '1em',
        'fill': 'currentColor',
        'overflow': 'hidden'
    },
    'svg':{
        'transform': 'translateY(10%)',
    }
})
export class Icon extends View {
    $el = document.createElement('i')
    constructor(name: string) {
        super()
        this.$el.innerHTML = `<svg aria-hidden="true" class="icon"><use xlink:href="#icon-${name}"></use></svg>`
    }
}
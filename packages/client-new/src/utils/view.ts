import { style, StyleOption } from "./stylesheet"

export class View<Slots extends string>{
    $el: HTMLElement
    children: View<string>[] = []

    constructor(el: HTMLElement = document.createElement('div')) {
        this.$el = el
    }

    parent(p: HTMLElement) {
        p.appendChild(this.$el)
        return this
    }

    append(c: View<string>) {
        this.children.push(c)
        c.parent(this.$el)
        return this
    }

    slot(name: Slots, c: View<string>) {
        const pa = this.$el.querySelector(`[data-slot="${name}"]`)
        if (pa instanceof HTMLElement) {
            this.children.push(c)
            c.parent(pa)
        }
        return this
    }

    style(fn: (s: CSSStyleDeclaration) => void) {
        fn(this.$el.style)
        return this
    }

    css(css: { [key: string]: string }) {

        Array.from(Object.entries(css)).forEach(([k, val]) => {
            const key: any = k.replace(/\-[a-z]/g, s => s[1].toUpperCase())
            this.$el.style[key] = val
        })

        return this

    }

    destroy() {
        this.children.forEach(v => v.destroy())
    }
    
}
export const css = <T extends {
    new(...args: any[]): any
}>(
    selector: string,
    el: (el: HTMLElement) => void,
    styleOp: StyleOption
) => (constractor: T): T => {

    style(styleOp, selector)

    return class extends constractor {
        constructor(...arg: any[]) {
            super(...arg)
            if ((this as any).$el) {
                el((this as any).$el)
            }
        }
    }
}
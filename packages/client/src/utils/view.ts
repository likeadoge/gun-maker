import { style, StyleOp } from "@/utils"

export class View {
    $el: HTMLElement
    children: View[] = []

    constructor(el: HTMLElement = document.createElement('div')) {
        this.$el = el
    }

    parent(p: HTMLElement) {
        p.appendChild(this.$el)
        return this
    }

    child(c: View) {
        this.children.push(c)
        c.parent(this.$el)
        return this
    }

    style(fn: (s: CSSStyleDeclaration) => void) {
        fn(this.$el.style)
        return this
    }

    css(css:{[key:string]:string}){

        Array.from(Object.entries(css)).forEach(([k,val])=>{
            const key :any= k.replace(/\-[a-z]/g, s => s[1].toUpperCase())
            this.$el.style[key] = val
        })

        return this

    }

    destroy() {
        this.children.forEach(v => v.destroy())
    }
}



export const css = <T extends {new(...args: any[]): any}>(selector: string, el: (el: HTMLElement) => void, styleOp: StyleOp) => (constractor: T) : T=> {

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

type IsExtends<S, T> = S extends T ? 1 : 2

type A = { new(...args: any[]): any }

type C = { new(...args: any[]): any, [key:string]:any}

type T = { new(...args: any[]): any, ro: any }

type M = IsExtends<T,C>
import { style, StyleOption } from "./stylesheet"

export class View<Slots extends string = never>{

    $id: string
    $el: HTMLElement

    children: View<string>[] = []
    waiting?: Promise<this>
    afterWaiting: (() => void)[] = []

    constructor(el: HTMLElement = document.createElement('div')) {
        this.$el = el
        this.$id = Math.random().toString()

        const waiting = new Promise<this>(res => {
            setTimeout(() => {
                Promise.resolve(this.created())
                    .then(() => {
                        res(this)
                        this.stopWaiting(waiting)
                    })
            });
        })

        this.waiting = waiting
    }

    protected complete: boolean = false
    
    protected setEl(el:HTMLElement){
        if(this.complete) throw new Error("can't set el after complete !!!")
        this.$el = el
        return this
    }

    // 更新
    protected stopWaiting(p: Promise<this>) {
        if (this.waiting !== p) return
        this.waiting = undefined
        this.afterWaiting.forEach(v => v())
    }

    protected asyncUpdate(fn: () => void) {
        const waiting = Promise.resolve(this.waiting)
            .then(() => (fn(), this))
            .finally(() => this.stopWaiting(waiting))

        this.waiting = waiting
        return this
    }

    protected syncUpdate(fn: () => void) {
        if (this.waiting) {
            this.afterWaiting.push(fn)
        } else {
            fn()
        }
    }

    // slot
    protected slot(c: Slots) {
        return {'data-slot':`${this.$id + c}`}
    }
    protected slotName(c: Slots) {
        return `data-slot="${this.$id + c}"`
    }
    insert(name: Slots, c: View<string>) {
        this.syncUpdate(() => {
            const pa = this.$el.querySelector(`[${this.slotName(name)}]`)
            if (pa instanceof HTMLElement) {
                this.children.push(c)
                c.parent(pa)
            }
        })
        return this
    }

    // 外部操作
    parent(p: HTMLElement) {
        this.syncUpdate(() => {
            p.appendChild(this.$el)
        })
        return this
    }

    append(c: View<string>) {
        this.syncUpdate(() => {
            this.children.push(c)
            c.parent(this.$el)
        })
        return this
    }

    style(css: Partial<CSSStyleDeclaration>) {
        Object.assign(this.$el.style, css)
        return this
    }


    // 生命周期
    protected created(): Promise<void> | void { }
    protected destroy() {
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
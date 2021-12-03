export const assert = <T>(v?: T | null) => {
    if (v === undefined || v === null)
        throw new Error('assert error !!!')
    else
        return v
}


export type StyleValueOp = { [name: string]: string } & { $next?: StyleOp }

export type StyleOp = { [selector: string]: StyleValueOp }

export const style = (s: StyleOp, upper: string = '') => {

    const e = document.createElement('style')
    const sel = (selector: string) => selector[0] === '&'
        ? selector.replace('&', '')
        : ' ' + selector

    Array.from(Object.entries(s)).forEach(([selector, values]) => {
        const html = `
        ${upper}${sel(selector)} {${Array.from(Object.entries(values))
                .filter(v => typeof v[1] === 'string')
                .map(([name, value]) => `
            ${name}:${value};`).join('')}
        }`
        e.innerHTML += html

        console.log(html)

        if (values.$next) { style(values.$next, `${upper}${sel(selector)}`) }
    })

    document.head.appendChild(e)
}

export const complete = new Promise(res => {

    const s = () => {
        if (document.querySelector('#icon-scale'))
            return res(null)
        else
            requestAnimationFrame(s)
    }

    s()
})

export class Pos{
    x:number = 0 // left
    y:number = 0 // top
    
    constructor(x:number,y:number){
        this.x = x
        this.y = y
    }
}
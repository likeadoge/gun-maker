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

export class Pos {
    x: number = 0 // left
    y: number = 0 // top

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    trans(x: (n: number) => number, y: (n: number) => number = x) {
        return new Pos(x(this.x), y(this.y))
    }
}


export class Size {
    height: number = 100
    width: number = 100

    
    constructor(width: number, height: number) {
        this.width = width
        this.height = height
    }

    scale(fn:(n:number)=>number){
        return new Size(fn(this.width),fn(this.height))
    }
}
export class Matrix3x3 {
    val: [
        number, number, number,
        number, number, number,
        number, number, number,
    ]

    constructor(...val: [
        number, number, number,
        number, number, number,
        number, number, number,
    ]) {
        this.val = val
    }

    mul(mat: Matrix3x3) {
        const [
            x1_1, x1_2, x1_3,
            x2_1, x2_2, x2_3,
            x3_1, x3_2, x3_3,
        ] = this.val
        const [
            y1_1, y1_2, y1_3,
            y2_1, y2_2, y2_3,
            y3_1, y3_2, y3_3,
        ] = mat.val

        return new Matrix3x3(
            ...[
                x1_1 * y1_1 + x1_2 * y2_1 + x1_3 * y3_1,
                x1_1 * y1_2 + x1_2 * y2_2 + x1_3 * y3_2,
                x1_1 * y1_3 + x1_2 * y2_3 + x1_3 * y3_3
            ] as [number, number, number],
            ...[
                x2_1 * y1_1 + x2_2 * y2_1 + x2_3 * y3_1,
                x2_1 * y1_2 + x2_2 * y2_2 + x2_3 * y3_2,
                x2_1 * y1_3 + x2_2 * y2_3 + x2_3 * y3_3
            ] as [number, number, number],
            ...[
                x3_1 * y1_1 + x3_2 * y2_1 + x3_3 * y3_1,
                x3_1 * y1_2 + x3_2 * y2_2 + x3_3 * y3_2,
                x3_1 * y1_3 + x3_2 * y2_3 + x3_3 * y3_3
            ] as [number, number, number],
        )

    }
}
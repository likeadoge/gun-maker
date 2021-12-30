export const assert = <T>(v?: T | null) => {
    if (v === undefined || v === null)
        throw new Error('assert error !!!')
    else
        return v
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

export const nextTick = () => new Promise(res => { setTimeout(res, 0) })

export class Size {
    height: number = 100
    width: number = 100


    constructor(width: number, height: number) {
        this.width = width
        this.height = height
    }

    scale(fn: (n: number) => number) {
        return new Size(fn(this.width), fn(this.height))
    }
}
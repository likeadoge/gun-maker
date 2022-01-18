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

export class Positon {
    top: number = 0
    left: number = 0
    constructor(top: number, left: number) {
        this.top = top
        this.left = left
    }
}


export const position = (top: number, left: number = top) => new Positon(top, left)

export const size = (width: number, height: number = width) => new Positon(width, height)

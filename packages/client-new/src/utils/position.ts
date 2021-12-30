export class Location {
    top: number = 0 // left
    left: number = 0 // top

    constructor(top: number, left: number = top) {
        this.top = top
        this.left = left
    }
}

export class Size {
    width: number = 0 // left
    height: number = 0 // top

    constructor(width: number, height: number = width) {
        this.width = width
        this.height = height
    }
}


export class Pos {
    x: number = 0 // left
    y: number = 0 // top

    constructor(x: number, y: number = x) {
        this.x = x
        this.y = y
    }

    trans(x: (n: number) => number, y: (n: number) => number = x) {
        return new Pos(x(this.x), y(this.y))
    }

    add(pos: Pos) {
        return new Pos(this.x + pos.x, this.y + pos.y)
    }

    sub(pos: Pos) {
        return new Pos(this.x - pos.x, this.y - pos.y)
    }

    mul(pos: Pos) {
        return new Pos(this.x * pos.x, this.y * pos.y)
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
        ] = mat.val
        const [
            y1_1, y1_2, y1_3,
            y2_1, y2_2, y2_3,
            y3_1, y3_2, y3_3,
        ] = this.val

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

    trans(): [number, number, number, number, number, number] {
        const [
            x1_1, x1_2, x1_3,
            x2_1, x2_2, x2_3,
        ] = this.val
        return [x1_1, x2_1, x1_2, x2_2, x1_3, x2_3]
    }
}
//https://blog.csdn.net/z397164725/article/details/8276452
//https://www.w3resource.com/html5-canvas/html5-canvas-matrix-transforms.php
export abstract class Transfrom {

    abstract matrix(o: Pos): Matrix3x3
}

export class xMove extends Transfrom {
    offset = new Pos(0, 0)

    constructor(pos: Pos) {
        super()
        this.offset = pos
    }

    matrix() {
        return new Matrix3x3(
            1, 0, this.offset.x,
            0, 1, - this.offset.y,
            0, 0, 1
        )
    }

    inverse() {
        return new xMove(this.offset.trans(v => -v))
    }
}

export class xScale extends Transfrom {
    ratio = new Pos(0, 0)


    constructor(ratio: Pos) {
        super()
        this.ratio = ratio
    }

    matrix() {

        return new Matrix3x3(
            this.ratio.x, 0, 0,
            0, this.ratio.y, 0,
            0, 0, 1
        )
    }


    inverse() {
        return new xScale(this.ratio.trans(v => 1 / v))
    }
}

export class xRotate extends Transfrom {
    angle: number = 1

    constructor(angel: number) {
        super()
        this.angle = angel
    }

    matrix() {
        const sin = Math.sin(this.angle)
        const cos = Math.cos(this.angle)

        return new Matrix3x3(
            cos, -sin, 0,
            sin, cos, 0,
            0, 0, 1
        )
    }

    inverse() {
        return new xRotate(-1 * this.angle)
    }
}

export class XoY {
    base: Symbol | XoY
    private transfroms: (xScale | xMove)[] = []

    static from(xoy: XoY) {
        return new XoY(xoy.base)
    }

    constructor(base: (Symbol|XoY) = Symbol()) {
        this.base = base
    }

    update(t: (xScale | xMove)[]) {
        this.transfroms = t
        return this
    } 
    getTransfroms(){
        return this.transfroms
    }
}

export class OPos extends Pos {
    xoy: XoY
    constructor(x: number, y: number, xoy: XoY) {
        super(x, y)
        this.xoy = xoy
    }
}


const basic_xoy = new XoY()


const screen_trans = {
    move: new xMove(new Pos(0)),
    scale: new xScale(new Pos(0.5))
}

const screen_xoy = XoY
    .from(basic_xoy)
    .update([screen_trans.move, screen_trans.scale])

const move_btn_xoy = XoY
    .from(screen_xoy)





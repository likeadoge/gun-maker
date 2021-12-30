
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
export abstract class Transfrom {

    abstract matrix(o: Pos): Matrix3x3
}

export class Move extends Transfrom {
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
        return new Move(this.offset.trans(v => -v))
    }
}

export class Scale extends Transfrom {
    ratio = new Pos(0, 0)
    origin = new Pos(0, 0)


    constructor(pos: Pos, ratio: Pos) {
        super()
        this.origin = pos
        this.ratio = ratio
    }

    matrix() {
        const step0 = new Move(this.origin.trans(n => -n)).matrix()
        const step1 = new Matrix3x3(
            this.ratio.x, 0, 0,
            0, this.ratio.y, 0,
            0, 0, 1
        )
        const step2 = new Move(this.origin.trans(n => n)).matrix()

        return step0.mul(step1).mul(step2)
    }


    inverse() {
        return new Scale(this.origin, this.ratio.trans(v => 1 / v))
    }
}

export class Rotate extends Transfrom {
    angle: number = 1
    origin = new Pos(0, 0)

    constructor(pos: Pos, angel: number) {
        super()
        this.origin = pos
        this.angle = angel
    }

    matrix() {
        const sin = Math.sin(this.angle)
        const cos = Math.cos(this.angle)

        // const ori = this.origin.add(o.trans(x => x, y => -y))

        const step0 = new Move(this.origin.trans(n => -n)).matrix()
        const step1 = new Matrix3x3(
            cos, -sin, 0,
            sin, cos, 0,
            0, 0, 1
        )
        const step2 = new Move(this.origin.trans(n => n)).matrix()

        return step0.mul(step1).mul(step2)
    }

    inverse() {
        return new Rotate(this.origin, -1 *this.angle)
    }
}

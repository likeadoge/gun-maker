import { Matrix3x3, Pos } from "@/utils"

//https://blog.csdn.net/z397164725/article/details/8276452
//https://www.w3resource.com/html5-canvas/html5-canvas-matrix-transforms.php
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
}

export class Rotate extends Transfrom {
    angle: number = 1
    origin = new Pos(0, 0)

    constructor(pos: Pos, angel: number) {
        super()
        this.origin = pos
        this.angle = angel
    }

    matrix(o: Pos) {
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
}
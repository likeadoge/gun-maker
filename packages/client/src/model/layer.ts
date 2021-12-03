import { Pos } from "@/utils"




export class Layer {
    transforms: Transfrom[] = []
}

export class Transfrom { }

export class Move extends Transfrom {
    offset = new Pos(0,0)
}

export class Scale extends Transfrom {
    ratio = new Pos(0,0)
}

export class Rotate extends Transfrom{
    angle: number = 1
    origin = new Pos(0,0)
}

// export class
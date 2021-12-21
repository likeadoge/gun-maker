import { Reactive } from "@/reactive/base"
import { Pos, Size } from "@/utils"
import { Rotate, Scale } from "./Transform"

export class Sight {
    size = new Reactive(new Size(1080, 1920))
    rotate = new Reactive(new Rotate(new Pos(0), 0))
    scale = new Reactive(new Scale(new Pos(0), new Pos(0)))
}

export const sight = new Sight()
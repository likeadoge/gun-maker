import { Reactive } from "@/reactive/base"
import { Pos, Size } from "@/utils"
import { Move, Scale } from "./Transform"

export class Screen {
    size = new Reactive(new Size(1080, 1920))
    move = new Reactive(new Move(new Pos(0)))
    scale = new Reactive(new Scale(new Pos(0), new Pos(1)))
}


export const screen = new Screen()
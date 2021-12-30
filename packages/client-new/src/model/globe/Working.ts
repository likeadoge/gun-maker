import { Reactive } from "@/utils/reactive"
import { Size } from "@/utils/position"
import { Move, Pos, Scale } from "@/utils/coordinate"

export class Working {
    screen = {
        size: new Reactive(new Size(100, 100)),
        move: new Reactive(new Move(new Pos(0))),
        scale: new Reactive(new Scale(new Pos(0)))
    }
}

export const working = new Working()
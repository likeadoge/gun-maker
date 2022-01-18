import { Reactive } from "@/utils/reactive"
import { size } from "@/utils/position"
import { move, point, scale } from "@/utils/coordinate"

export class Working {
    screen = {
        size: new Reactive(size(100, 100)),
        move: new Reactive(move(point(0))),
        scale: new Reactive(scale(point(0)))
    }
}

export const working = new Working()
import { Reactive } from "@/utils/reactive"
import { Size } from "@/utils/position"
import { Rotate, Pos, Scale } from "@/utils/coordinate"

export class Preview {
    screen = {
        size: new Reactive(new Size(1080, 1920)),
        rotate: new Reactive(new Rotate(Math.PI / 6)),
        scale: new Reactive(new Scale(new Pos(0.5)))
    }
}

export const preview = new Preview()


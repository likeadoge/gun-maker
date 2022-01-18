import { rtive } from "@/utils/reactive"
import { size } from "@/utils/position"
import { rotate, scale, point } from "@/utils/coordinate"

export class Preview {
    screen = {
        size: rtive(size(1080, 1920)),
        rotate: rtive(rotate(Math.PI / 6)),
        scale: rtive(scale(point(0.5)))
    }
}

export const preview = new Preview()


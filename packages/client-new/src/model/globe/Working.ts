import { rVal } from "@/utils/reactive"
import { Size } from "@/utils/position"
import { Transfrom } from "@/utils/coordinate"

export class Working {
    screen = {
        size: rVal(Size.create(100, 100)),
        offset: rVal(Transfrom.move())
    }
}

export const working = new Working()
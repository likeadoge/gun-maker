import { R } from "@/utils/reactive"
import { Size } from "@/utils/position"
import { Point, Scale, Transfrom } from "@/utils/coordinate"

export const Working = new class {
    screen = {
        size: R.val(Size.create(100, 100)),
        scale: R.val(Transfrom.scale(Point.create(1))),
        offset: R.val(Transfrom.move())
    }
}()


Working.screen.scale.attach(R.effect((v)=>console.log('work-screen scale change',v)))
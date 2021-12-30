import { Img } from "@/utils/image"
import { Transfrom, Pos } from "@/utils/coordinate"
import { Reactive } from "@/utils/reactive"

export class Part {
    image: Img
    origin: Pos
    constructor(image: Img) {
        this.image = image
        this.origin = new Pos(
            this.image.size.width * 0.5,
            this.image.size.height * 0.5
        )
    }
    transforms: Transfrom[] = []
}

export const parts = new Reactive<Part[]>([])
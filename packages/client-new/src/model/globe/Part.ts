import { Img } from "@/utils/image"
import { Transfrom, Point } from "@//utils/coordinate"
import {  rtive } from "@/utils/reactive"

export class Part {
    image: Img
    origin: Point
    constructor(image: Img) {
        this.image = image
        this.origin = new Point(
            this.image.size.width * 0.5,
            this.image.size.height * 0.5
        )
    }
    transforms: Transfrom[] = []
}

export const parts = rtive<Part[]>([])
import { Reactive } from "@/reactive/base"
import { Layer } from "./layer"

class Globe {
    tansformType = new Reactive<null | 'move' | 'scale' | 'rotate'>(null)
    screenScale = new Reactive(2)
    layers = new Reactive<Layer[]>([])  
}


export const globe = new Globe()







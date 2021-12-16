import { Mut, Reactive } from "@/reactive/base"
import { CacheList } from "@/reactive/cache"
import { Layer } from "./layer"

class Globe {
    tansformType = new Reactive<null | 'move' | 'scale' | 'rotate'>(null)
    screenScale = new Reactive(2)
    layers: Mut<Mut<Layer>[]> = new Reactive<Mut<Layer>[]>([])
}


export const globe = new Globe()







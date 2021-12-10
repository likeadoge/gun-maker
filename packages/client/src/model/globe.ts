import { Reactive } from "@/reactive/base"

class Globe {
    tansformType = new Reactive<null | 'move' | 'scale' | 'rotate'>(null)
    screenScale = new Reactive(1)
}

export const globe = new Globe()



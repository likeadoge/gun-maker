import { Reactive } from "@/reactive/base"

class Globe {
    tansformType = new Reactive<null | 'move' | 'scale' | 'rotate'>(null)
    
}

export const globe = new Globe()



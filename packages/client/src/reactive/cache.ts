import { Reactive, Ref, Watcher } from "./base";

export class CacheList<S, T> extends Ref<T[]> implements Watcher<S[]>{

    ref:Ref<S[]>
    #target:Reactive<T[]>
    fn:(s:S)=>T
    #cache: Map<S,T> = new Map()
    #onlyEmitWhenNewVal:boolean

    constructor(ref:Ref<S[]> , fn:(s:S)=>T ,onlyEmitWhenNewVal:boolean = false){
        super()
        this.ref = ref
        this.fn = fn
        this.#target = new Reactive<T[]>([]) 
        this.#onlyEmitWhenNewVal = onlyEmitWhenNewVal

        this.update()
        this.ref.attach(this)
    }

    private update(){
        const val = this.ref.val()
        const cache: Map<S,T> = new Map()

        const list = val.map(s=>{
            const c = this.#cache.get(s)
            const t = c ?? this.fn(s)
            cache.set(s,t)
            return t
        })
        this.#cache = cache
        this.#target.set(list)
    }

    destroy(){
        this.ref.detach(this)
    }

    emit(m:Ref<S[]>,oldVal:S[]){
        if(!this.#onlyEmitWhenNewVal)
            return this.update()
        if(m.val() !== oldVal)
            return this.update()
    }

    val() { return this.#target.val() }

    attach(w: Watcher<T[]>) { return this.#target.attach(w) }
    detach(w: Watcher<T[]>) { return this.#target.detach(w) }

}
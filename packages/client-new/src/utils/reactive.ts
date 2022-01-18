// import { Head, Tail } from "@/types"


export interface Watcher<T > {
    emit: (r: Reactive<T>, old: T) => void
    destroy: () => void
}
export abstract class Ref<T> {
    abstract val(): T
    abstract attach<S extends  Watcher<T>>(w: S): void
    abstract detach<S extends  Watcher<T>>(w: S): void



    static gen<T>(t: MayRef<T>): Ref<T> {
        return t instanceof Ref ? t : new Reactive(t)
    }

    compute<S>(compute: (t: this) => S): Ref<S> {
        return new Computed<[this], S>([this], compute)
    }



    protected parents: Mut<any>[] = []

    public parent(t: Mut<any>): this {
        this.parents.push(t)
        return this
    }

    protected emitParents() {
        this.parents.forEach(element => { element.update(element.val()) });
    }
}
export abstract class Mut<T> extends Ref<T> {
    abstract update(t: T): void

    static gen<T>(t: MayMut<T>): Mut<T> {
        return t instanceof Ref ? t : new Reactive(t)
    }

    transform<S>(compute: (t: this) => S, update: (v: S, t: this) => void): Mut<S> {
        return new Transform<[this], S>([this], compute, update)
    }

}
export class Reactive<T> extends Mut<T>{
    #val: T
    #watchers: Watcher<T>[] = []

    constructor(val: T | Reactive<T>) {
        super()
        if (val instanceof Reactive)
            throw new Error("reactive: can't reactive val twice!")
        this.#val = val
    }
    // 取值
    val() {
        return this.#val
    }
    // 赋值
    update(newVal: T) {
        const old = this.#val
        this.#val = newVal
        this.#watchers.forEach(v => v.emit(this, old))
        this.emitParents()
    }
    // 添加一个 watcher
    attach(watcher: Watcher<T>) {
        this.#watchers = this.#watchers.filter(v => v != watcher).concat([watcher])
    }
    // 注销对应 watcher
    detach(watcher: Watcher<T>) {
        this.#watchers = this.#watchers.filter(v => v != watcher)
    }
}
export class Computed<S extends any[], T> extends Ref<T> implements Watcher<unknown>{

    #target: Reactive<T>
    #argus: S
    #fn: (...s: S) => T

    private calcu(): T {
        return this.#fn(...this.#argus)
    }

    constructor(argus: S, fn: (...s: S) => T) {
        super()
        this.#argus = argus
        this.#fn = fn
        this.#target = new Reactive(this.calcu())
        argus.forEach(v => { if (v instanceof Ref) v.attach(this) })
    }

    emit() {
        this.#target.update(this.calcu())
        this.emitParents()
    }

    destroy() {
        this.#argus.forEach((v) => { if (v instanceof Ref) v.detach(this) })
    }

    val() { return this.#target.val() }
    attach(w: Watcher<T>) { return this.#target.attach(w) }
    detach(w: Watcher<T>) { return this.#target.detach(w) }
}
export class Transform<S extends any[], T> extends Mut<T> implements Watcher<unknown>{

    #target: Reactive<T>
    #argus: S
    #computeFn: (...s: S) => T
    #updateFn: (val: T, ...s: S) => void

    private calcu(): T {
        return this.#computeFn(...this.#argus)
    }

    constructor(argus: S, computeFn: (...s: S) => T, updateFn: (val: T, ...s: S) => void) {
        super()
        this.#argus = argus
        this.#computeFn = computeFn
        this.#updateFn = updateFn
        this.#target = new Reactive(this.calcu())

        argus.forEach(v => { if (v instanceof Ref) v.attach(this) })
    }

    emit() {
        this.#target.update(this.calcu())
        this.emitParents()
    }

    destroy() {
        this.#argus.forEach((v) => { if (v instanceof Ref) v.detach(this) })
    }

    val() { return this.#target.val() }
    attach(w: Watcher<T>) { return this.#target.attach(w) }
    detach(w: Watcher<T>) { return this.#target.detach(w) }

    update(v: T) { this.#updateFn(v, ...this.#argus) }
}
export class Effect<T> implements Watcher<T>{
    #target: Ref<T> | null = null
    #fn = (t: T) => { }
    constructor(
        fn: (t: T) => void,
        target: Ref<T> | null = null
    ) {

        this.#fn = fn
        this.attachTo(target)
    }
    emit(t: Ref<T>) {
        this.#fn(t.val())
    }
    attachTo(target: Ref<T> | null) {
        this.#target?.detach(this)
        this.#target = target
        this.#target?.attach(this)
    }
    destroy() {
        this.#target?.detach(this)
    }
}
export type MayRef<T> = T | Ref<T>

export type MayMut<T> = T | Mut<T>

// 方法装饰器
const asyncEmitWeakmap = new WeakMap<{}, number>()
const clearAsyncEmit = (s: any) => {
    const above = asyncEmitWeakmap.get(s)
    if (above) { clearTimeout(above) }
}
export function asyncEmit(
    target: Watcher<any>,
    key: 'emit',
    descriptor: PropertyDescriptor
) {
    const old = descriptor.value
    descriptor.value = function (...argus: any[]) {
        clearAsyncEmit(this)
        const emit = () => {
            clearAsyncEmit(this)
            return old.call(this,...argus)
        }
        const num = setTimeout(emit, 0) as unknown as number
        asyncEmitWeakmap.set(this, num)
    }

    return descriptor
}

// 带缓存的数组
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
        this.#target.update(list)
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


export const rtive = <T>(v:T)=> new Reactive(v)
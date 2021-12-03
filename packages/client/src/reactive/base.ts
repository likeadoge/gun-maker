import { Head, Tail } from "@/types"

export interface Watcher<T> {
    emit: (r: Reactive<T>) => void
    destroy: () => void
}

export abstract class Ref<T> {
    abstract val(): T
    abstract attach(w: Watcher<T>): void
    abstract detach(w: Watcher<T>): void

    compute<S>(compute: (t: this) => S): Ref<S> {
        return new Computed<[this], S>([this], compute)
    }
}

export abstract class Mut<T> extends Ref<T> {
    abstract set(t: T): void
    abstract update(fn: (t: T) => T): void

    transform<S>(compute: (t: this) => S, update: (v: S, t: this) => void): Mut<S> {
        return new Transform<[this], S>([this], compute, update)
    }
}

export class Reactive<T> extends Mut<T>{
    #val: T
    #watchers: Watcher<T>[] = []


    static new<T>(val: T | Reactive<T>) {
        return val instanceof Reactive ? val : new Reactive(val)
    }

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
    set(newVal: T) {
        this.#val = newVal
        this.#watchers.forEach(v => v.emit(this))
    }
    // 更新（赋值语法糖）
    update(fn: (t: T) => T) {
        this.set(fn(this.#val))
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
        this.#target.set(this.calcu())
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
        this.#target.set(this.calcu())
    }

    destroy() {
        this.#argus.forEach((v) => { if (v instanceof Ref) v.detach(this) })
    }

    val() { return this.#target.val() }
    attach(w: Watcher<T>) { return this.#target.attach(w) }
    detach(w: Watcher<T>) { return this.#target.detach(w) }

    set(v: T) { this.#updateFn(v, ...this.#argus) }
    update(fn: (t: T) => T) { this.set(fn(this.#target.val())) }
}

export class Effect<T> implements Watcher<T>{
    #target: Reactive<T> | null = null
    #fn = (t: T) => { }
    constructor(
        fn: (t: T) => void,
        target: Reactive<T> | null = null
    ) {

        this.#fn = fn
        this.attachTo(target)
    }
    emit(t: Reactive<T>) {
        this.#fn(t.val())
    }
    attachTo(target: Reactive<T> | null) {
        this.#target?.detach(this)
        this.#target = target
        this.#target?.attach(this)
    }
    destroy() {
        this.#target?.detach(this)
    }
}
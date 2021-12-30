import { Part } from "@/model/Part";
import { Ref, Watcher } from "@/reactive/base";
import { CacheList } from "@/reactive/cache";
import { View } from "@/utils/view";

export class LayerList extends View implements Watcher<LayerItem[]>{

    #cache: CacheList<Ref<Part>, LayerItem>
    #container: HTMLUListElement

    constructor(layers: Ref<Ref<Part>[]>) {
        super()
        this.#cache = new CacheList(layers, s => new LayerItem(s), true)
        this.#container = document.createElement('ul')
        this.$el.appendChild(this.#container)
        this.#cache.attach(this)
        this.update()
    }


    update() {
        this.#container.remove()
        this.#container = document.createElement('ul')
        this.#cache.val().forEach(v => {
            this.#container.appendChild(v.$el)
        })
        this.$el.appendChild(this.#container)
    }

    emit() {
        this.update()
    }

    destroy() {
        super.destroy()
        this.#cache.detach(this)
    }

}

export class LayerItem extends View {
    title: HTMLElement
    layer: Ref<Part>

    constructor(layer: Ref<Part>) {
        super(document.createElement('li'))
        this.layer = layer

        this.title = document.createElement('div')
        this.title.innerText = this.layer.val().image.src
        this.$el.appendChild(this.title)
    }
}
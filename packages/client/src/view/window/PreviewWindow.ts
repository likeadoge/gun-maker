import { layerPreviewList } from "@/model/Layer"
import { LayerPreview } from "@/model/Preview"
import { sight } from "@/model/Sight"
import { screen } from "@/model/Screen"
import { Watcher, Ref, asyncEmit } from "@/reactive/base"
import { shadow } from "@/style"
import { Size } from "@/utils"
import { CanvasHandle } from "@/utils/canvas"
import { Matrix3x3, Pos } from "@/utils/coordinate"
import { css, View } from "@/utils/view"



@css<typeof PreviewWindow>('.preview-window', v => v.classList.add('preview-window'), {
    '&': {
        'width': '100%',
        'overflow': 'hidden',
        'background': '#fff',
    },
})

export class PreviewWindow extends View implements Watcher<Size>, Watcher<Matrix3x3>, Watcher<Ref<LayerPreview>[]>{

    static ro = new ResizeObserver(() => {
        sight.size.update(v=>v)
    })

    handle: CanvasHandle<HTMLCanvasElement>
    canvas: HTMLCanvasElement


    constructor() {
        const $el = document.createElement('div')
        const canvas = document.createElement('canvas')
        $el.appendChild(canvas)
        super($el)
        this.handle = new CanvasHandle(canvas)
        this.canvas = canvas
        PreviewWindow.ro.observe(this.$el)
        sight.size.attach(this)
        layerPreviewList.attach(this)
        this.resizeEl()
    }

    @asyncEmit
    emit(r: Ref<Size> | Ref<Matrix3x3> | Ref<Ref<LayerPreview>[]>) {
        this.handle.clear()
        if (r === sight.size) {
            this.handle.resize(sight.size.val())
            this.resizeEl()
        }
        this.update()
    }

    resizeEl(){
        const size = sight.size.val()
        console.log(this.$el)
        const {width} = this.$el.getBoundingClientRect()
        this.canvas.style.width =  width + 'px'
        this.canvas.style.height = width/size.width*size.height + 'px'
        this.handle.resize(size)
    }

    update() {

        this.handle.clear()
        this.handle.transform(null)

        layerPreviewList.val().forEach(layerScreen => {
            this.handle.source(layerScreen.val().canvas, new Pos(0))
        });
    }

    destroy() {
        super.destroy()
        PreviewWindow.ro.unobserve(this.$el)
        screen.size.detach(this)
        screen.transform.detach(this)
        layerPreviewList.detach(this)
    }
}



export const previewWindow = new PreviewWindow()
    .css(shadow(4))
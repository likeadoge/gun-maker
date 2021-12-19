import { App } from "@/components/App"
import { BtnGroup, ToggleBtn, SliderBtn } from "@/components/Btn"
import { FlexCol, FlexFill, FlexFixed, FlexRow } from "@/components/Flex"
import { Icon } from "@/components/Icon"
import { Img } from "@/model/Image"
import { Layer } from "@/model/layer"
import { Reactive, Ref } from "@/reactive/base"
import { shadow } from "@/style"
import { screen } from "@/model/Screen"
import { LayerList } from "./windows/LayerList"
import { Scale } from "@/model/Transform"
import { Pos } from "@/utils"

export const initView = () => {
    new App()
        .parent(document.body)
        .child(
            new FlexCol()
                .style(e => { e.height = '100%' })
                .child(
                    new FlexFill()
                        .child(
                            new FlexRow()
                                .style(v => v.height = "100%")
                                .child(
                                    new FlexFill()
                                        .css(shadow(4))
                                        .css({ margin: '12px' })
                                    // .child(new WorkWindow({
                                    //     scale: globe.screenScale,
                                    //     layers: globe.layers as unknown as Ref<Ref<Layer>[]>
                                    // }))
                                )
                                .child(
                                    new FlexFixed()
                                        .style(v => v.width = "300px")
                                    // .child(new LayerList(globe.layers as unknown as Ref<Ref<Layer>[]>))
                                )
                        )
                )
                .child(
                    new FlexFixed()
                        .child(new BtnGroup()
                            // .child(new ToggleBtn(
                            //     globe.tansformType.transform(
                            //         (t) => t.val() === 'move' ? true : false,
                            //         (val, t) => t.set(val ? 'move' : null)
                            //     )
                            // ).child(new Icon('move')))
                            // .child(new ToggleBtn(
                            //     globe.tansformType.transform(
                            //         (t) => t.val() === 'scale' ? true : false,
                            //         (val, t) => t.set(val ? 'scale' : null)
                            //     )
                            // ).child(new Icon('scale')))
                            // .child(new ToggleBtn(
                            //     globe.tansformType.transform(
                            //         (t) => t.val() === 'rotate' ? true : false,
                            //         (val, t) => t.set(val ? 'rotate' : null)
                            //     )
                            // ).child(new Icon('rotate')))


                            .child(new SliderBtn(screen.scale.transform(scale => {
                                const s = (v: number) => ((Math.log(v) / Math.log(4)) + 1) / 2
                                return s(scale.val().ratio.x)
                            }, (s, t) => {
                                const m = (v: number) => 4 ** (2 * (v - 0.5))
                                t.set(new Scale(new Pos(0), new Pos(m(s))))
                                console.log(t.val())
                            }))
                                .style(v => v.width = '200px')
                            )
                        )
                )

        )
}



const img0 = new Img('http://localhost:3000/1911/滑套.png')
const img1 = new Img('http://localhost:3000/1911/下身.png')
const img2 = new Img('http://localhost:3000/1911/击锤.png')

Promise.all([img0.done, img1.done, img2.done]).then(() => {

    const l0 = new Layer(img0)
    const l1 = new Layer(img1)
    const l2 = new Layer(img2)

    // l1.transforms = [new Rotate(new Pos(100), 0)]
    // l2.transforms = [new Rotate(new Pos(100), Math.PI / 6)]

    // globe.layers.set([
    //     new Reactive(l0),
    //     new Reactive(l1),
    //     new Reactive(l2)
    // ])

})


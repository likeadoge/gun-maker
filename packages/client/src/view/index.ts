import { App } from "@/components/App"
import { BtnGroup, ToggleBtn, SliderBtn } from "@/components/Btn"
import { FlexCol, FlexFill, FlexFixed, FlexRow } from "@/components/Flex"
import { Icon } from "@/components/Icon"
import { globe } from "@/model/globe"
import { shadow } from "@/style"
import { WorkWindow } from './windows/WorkWindow'

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
                                        .child(new WorkWindow({
                                            scale: globe.screenScale,
                                            layers: globe.layers
                                        }))
                                )
                                .child(
                                    new FlexFixed()
                                        .style(v => v.width = "300px")
                                )
                        )
                )
                .child(
                    new FlexFixed()
                        .child(new BtnGroup()
                            .child(new ToggleBtn(
                                globe.tansformType.transform(
                                    (t) => t.val() === 'move' ? true : false,
                                    (val, t) => t.set(val ? 'move' : null)
                                )
                            ).child(new Icon('move')))
                            .child(new ToggleBtn(
                                globe.tansformType.transform(
                                    (t) => t.val() === 'scale' ? true : false,
                                    (val, t) => t.set(val ? 'scale' : null)
                                )
                            ).child(new Icon('scale')))
                            .child(new ToggleBtn(
                                globe.tansformType.transform(
                                    (t) => t.val() === 'rotate' ? true : false,
                                    (val, t) => t.set(val ? 'rotate' : null)
                                )
                            ).child(new Icon('rotate')))
                            .child(new SliderBtn(globe.screenScale.transform(v => {
                                const s = (v: number) => (Math.log10(v) + 1) / 2
                                return s(v.val())
                            }, (s, t) => {
                                const m = (v: number) => 10 ** (2 * (v - 0.5))
                                t.set(m(s))
                            }))
                                .style(v => v.width = '200px')
                            )
                        )
                )

        )
}
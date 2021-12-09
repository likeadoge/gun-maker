import { App } from "@/components/App"
import { BtnGroup, ToggleBtn } from "@/components/Btn"
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
                                        .css({margin:'12px'})
                                        .child(new WorkWindow())
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
                        )
                )

        )
}
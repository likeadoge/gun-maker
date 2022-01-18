import { flex, shadow } from "@/style/common";
import { cls, div, style } from "@/utils/dom";
import { css, View } from "@/utils/view";

@css({
    '&': { height: '100%' },
    '.sider': { width: '400px' },
    '.content': {},
    '.control': { height: '100px' }
})
export class MainLayout extends View<'screen'>{
   

    created() {
        this.setRoot([div, style(flex.row()), [
            [div, cls('content'), style(flex.fill(), flex.col()), [
                [div, cls('control'), style(flex.fixed())],
                [div, cls('screen'), style(flex.fill()), [new CardContainer()]],
            ]],
            [div, cls('sider'), style(flex.fixed())],
        ]])
    }
}

@css({
    '&.outer': { height: '100%', width: '100%', padding: '12px' },
    '.inner': { ...shadow(4), backgroundColor: '#fff', height: '100%', width: '100%' },
})

export class CardContainer extends View<'inner'>{

    protected created(): void | Promise<void> {
        this.setRoot([div, cls('outer'), [
            [div, cls('inner'), this.slot('inner')]
        ]])
    }
}

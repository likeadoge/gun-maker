import { flex, shadow } from "@/style/common";
import { css, View } from "@/utils/view";


@css('.main', (e) => { e.classList.add('main') }, {
    '': { height: '100%' },
    '.content': {},
    '.sider': { width: '300px' },
    '.control': { height: '100px' }
})
export class MainLayout extends View<'screen'>{
    constructor() {
        super()
        this.$el = <div style={{ ...flex.row() }}>
            <div className="content" style={{ ...flex.fill(), ...flex.col() }}>
                <div className="control" style={{ ...flex.fixed() }}></div>
                <div className="screen" style={{ ...flex.fill() }} {...this.slot('screen')}></div>
            </div>
            <div className="sider" style={{ ...flex.fixed() }}>
            </div>
        </div>


        this.insert('screen', new CardContainer())

    }

    created() {
    }
}



@css('.card-container', (e) => { e.classList.add('card-container') }, {
    '&,outer': { height: '100%', width: '100%', padding: '12px' },
    '.inner': { ...shadow(4), backgroundColor: '#fff', height: '100%', width: '100%' },
})

export class CardContainer extends View<'inner'>{
    constructor() {
        super()
        this.setEl(
            <div className="outer">
                <div className="inner" {...this.slot('inner')}></div>
            </div>
        )
    }
}

import { SliderButton } from '@/components/Btn';
import { Working } from '@/model/globe/Working';
import { Point, Transfrom } from '@/utils/coordinate';
import { div, id } from '@/utils/dom';
import { R } from '@/utils/reactive';
import { css, View } from '@/utils/view'
import { MainLayout } from './layout';
import { WorkScreen } from './work-screen';


@css({
    '&': {
        'background': "#ccc",
        'minWidth': '800px',
        'height': '100%'
    }
})
export class App extends View {
    protected created(): void | Promise<void> {
        this.setRoot([div, id('app'), [
            new MainLayout()
                .insert('screen', new WorkScreen())
                .insert('control', new SliderButton(R.translate(
                    () => {
                        const s = (v: number) => ((Math.log(v) / Math.log(4)) + 1) / 2
                        const num = Working.screen.scale.val().ratio.x
                        return s(num)
                    },
                    num => {
                        const m = (v: number) => 4 ** (2 * (v - 0.5))
                        const s = Transfrom.scale(Point.create(m(num)))
                        Working.screen.scale.update(s)
                    }
                )))
        ]])
    }
}
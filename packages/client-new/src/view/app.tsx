import { SliderButton } from '@/components/Btn';
import { div, id } from '@/utils/dom';
import { rVal } from '@/utils/reactive';
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
                .insert('control', new SliderButton(rVal(0.3)))
        ]])
    }
}
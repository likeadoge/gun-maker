import { div, id } from '@/utils/dom';
import { css, View } from '@/utils/view'
import { MainLayout } from './layout';


@css({
    '&': {
        'background': "#ccc",
        'minWidth': '800px',
        'height': '100%'
    }
})
export class App extends View {
    protected created(): void | Promise<void> {
        this.setRoot([div,id('app'),[new MainLayout()]])
    }
}
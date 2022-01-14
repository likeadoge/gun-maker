import { css, View } from '@/utils/view'
import { MainLayout } from './layout';


@css('#app',el => { el.id = 'app'; return '#app' }, {
    '': {
        'background': "#ccc",
        'minWidth': '800px',
        'height': '100%'
    }
})
export class App extends View {
    constructor(){
        super(( document.querySelector('#app') as HTMLElement )|| document.createElement('div'))
    }
    created(){
        this.append(new MainLayout())
    }
}
import { css, View } from '@/utils/view'


@css('#app',el => { el.id = 'app'; return '#app' }, {
    '': {
        'background': "#ccc",
        'min-width': '800px',
        'height': '100%'
    }
})
export class App extends View {
    $el =( document.querySelector('#app') as HTMLElement )|| document.createElement('div')
}
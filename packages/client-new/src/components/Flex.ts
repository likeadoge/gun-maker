import { css, View } from '@/utils/view'

@css('.flex-row',el => { el.className += 'flex-row'}, {
    '': {
        'display': 'flex',
        'flexDirection': 'row',
    }
})
export class FlexRow extends View {
    $root = document.createElement('div') 
}


@css('.flex-col',el => { el.className += 'flex-col'}, {
    '': {
        'display': 'flex',
        'flexDirection': 'column',
    }
})
export class FlexCol extends View {
    $root = document.createElement('div') 
}


@css('.flex-fill',el => { el.className += 'flex-fill'}, {
    '': {
        'flex': 'auto',
        'overflow': 'auto',
    }
})
export class FlexFill extends View {
    $root = document.createElement('div') 
}


@css('.flex-fixed',el => { el.className += 'flex-fixed'}, {
    '': {
        'flex': 'none',
    }
})
export class FlexFixed extends View {
    $root = document.createElement('div') 
}

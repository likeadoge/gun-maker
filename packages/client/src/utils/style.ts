
export type StyleValueOp = { [name: string]: string } & { $next?: StyleOp }

export type StyleOp = { [selector: string]: StyleValueOp }

export const style = (s: StyleOp, upper: string = '') => {

    const e = document.createElement('style')
    const sel = (selector: string) => selector[0] === '&'
        ? selector.replace('&', '')
        : ' ' + selector

    Array.from(Object.entries(s)).forEach(([selector, values]) => {
        const html = `
        ${upper}${sel(selector)} {${Array.from(Object.entries(values))
                .filter(v => typeof v[1] === 'string')
                .map(([name, value]) => `
            ${name}:${value};`).join('')}
        }`
        e.innerHTML += html

        if (values.$next) { style(values.$next, `${upper}${sel(selector)}`) }
    })

    document.head.appendChild(e)
}

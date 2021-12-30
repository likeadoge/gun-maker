
export type StyleRules = { [name: string]: string } & { $next?: StyleOption }

export type StyleOption = { [selector: string]: StyleRules }

export const style = (s: StyleOption, upper: string = '') => {

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

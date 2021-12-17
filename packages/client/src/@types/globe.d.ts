declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: HTMLElement;
    }

    type Element = HTMLElement
}

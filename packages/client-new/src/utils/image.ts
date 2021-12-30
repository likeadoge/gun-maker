import { Size } from "./position"

export class Img {
    src: string
    size: Size = new Size(0, 0)
    target: HTMLImageElement
    done: Promise<Img>
    private onload: () => void
    constructor(src: string) {
        this.src = src
        this.target = new Image()
        this.target.src = this.src
        this.onload = () => { }
        this.done = new Promise(res => {
            this.onload = () => {
                this.size.width = this.target.width
                this.size.height = this.target.height
                res(this)
            }
        })
        this.target.onload = this.onload
    }
}
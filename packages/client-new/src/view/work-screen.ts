import { working } from '@/model/globe/Working'
import { full } from '@/style/common';
import { CanvasHandle } from '@/utils/canvas';
import { Move, Point, Transfrom } from '@/utils/coordinate';
import { canvas, div } from '@/utils/dom';
import { Size } from '@/utils/position';
import { Reactive, Watcher } from '@/utils/reactive';
import { MouseMovement } from '@/utils/touch';
import { css, View } from '@/utils/view';

const size = working.screen.size
const offset = working.screen.offset


@css({
    '': { ...full(), 'overflow': 'hidden' },
    'canvas': { 'background': 'transparent' }
})
export class WorkScreen extends View<never> implements Watcher<Size>, Watcher<Move>{


    private handle: CanvasHandle<HTMLCanvasElement> = new CanvasHandle(canvas())
    private movement: MouseMovement = MouseMovement.create()

    private ro = new ResizeObserver(entries => {
        for (let entry of entries) {
            size.update(Size.create(
                Math.floor(entry.contentRect.width),
                Math.floor(entry.contentRect.height)
            ))
            console.log(size.val())
        }
    })


    protected created(): void | Promise<void> {
        this.setRoot([div, [
            [() => this.handle.target]]
        ])

        this.resize()
        this.render()

        this.ro.observe(this.handle.target)
        this.movement.target(this.handle.target)

        this.movement.getNow = () => offset.val().offset
        this.movement.move = (from, move) => {
            offset.update(Transfrom.move(
                Point.create(from.x + move.x, from.y + move.y)
            ))
        }

        size.attach(this)
        offset.attach(this)
    }


    private resize() {
        this.handle.resize(size.val())
    }


    private render() {
        this.handle.clear()
        this.handle.transform(offset.val().matrix())
        this.handle.rect(Point.create(0), Size.create(10, 10), { fill: true })
    }


    emit(r: Reactive<Size> | Reactive<Move>) {
        if (r === size) this.resize()
        this.render()
    }

    destroy(): void {
        super.destroy()
        size.detach(this)
    }


}
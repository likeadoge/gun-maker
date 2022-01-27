import { Working } from '@/model/globe/Working'
import { full } from '@/style/common';
import { CanvasHandle } from '@/utils/canvas';
import { Matrix3x3, Move, Point, Scale, Transfrom } from '@/utils/coordinate';
import { canvas, div } from '@/utils/dom';
import { Size } from '@/utils/position';
import { Ref, Watcher } from '@/utils/reactive';
import { MouseMovement } from '@/utils/touch';
import { css, WatcherView } from '@/utils/view';

const size = Working.screen.size
const scale = Working.screen.scale
const offset = Working.screen.offset


@css({
    '': { ...full(), 'overflow': 'hidden' },
    'canvas': { 'background': 'transparent' }
})
export class WorkScreen extends WatcherView<never> implements Watcher<Size>, Watcher<Move>, Watcher<Scale>{


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
        scale.attach(this)
        offset.attach(this)
    }


    private resize() {
        this.handle.resize(size.val())
    }


    private render() {
        this.handle.clear()
        const matrix = Matrix3x3.blank()
        offset.val().matrix(matrix)
        scale.val().matrix(matrix)
        this.handle.transform(matrix)
        this.handle.rect(Point.create(0), Size.create(10, 10), { fill: true })
    }


    emit(r: Ref<Size> | Ref<Move> | Ref<Scale>) {
        console.log(1)
        if (r === size) this.resize()
        this.render()
    }


}
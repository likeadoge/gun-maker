import { Ref, Watcher } from "@/reactive/base";
import { Move, Pos } from "@/utils/coordinate";
import { View } from "@/utils/view";

export class TransformBtn extends View { }

export class MoveBtn extends TransformBtn 
    implements Watcher<Pos> ,Watcher<Move>{

    start: HTMLDivElement
    end: HTMLDivElement

    move:Ref<Move>
    startPos:Ref<Pos>

    constructor(
        startPos:Ref<Pos>,
        move:Ref<Move>
    ) {
        super(<div className="">
            <div className="start"></div>
            <div className="end"></div>
        </div>)

        const start = this.$el.querySelector('.start')
        const end = this.$el.querySelector('.end')

        if (!(start instanceof HTMLDivElement)) {
            throw new Error('start error')
        }
        if (!(end instanceof HTMLDivElement)) {
            throw new Error('end error')
        }

        this.start = start
        this.end = end
        this.startPos = startPos
        this.move = move
        this.update()

        startPos.attach(this)
        move.attach(this)
    }

    emit(){
        this.update()
    }

    destroy(){
        super.destroy()
        this.startPos.detach(this)
        this.move.detach(this)
    }

    update(){
        const offset = this.move.val().offset

        const startPos = this.startPos.val()
        const endPos = startPos.add(offset)
        const {width,height} = this.$el.getBoundingClientRect()

        this.start.style.left = startPos.x + width/2 + 'px'
        this.start.style.top = height/2 - startPos.y + 'px'
        
        this.end.style.left = endPos.x + width/2 + 'px'
        this.end.style.top = height/2 - endPos.y + 'px'
    }





}
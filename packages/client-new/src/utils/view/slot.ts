import { DomSlotDecortor, DomOption } from "../dom"
import { Root } from "./root"

export class Slot<SlotIds extends string = never> extends Root {

    // slot
    protected slotTable: { [key: string]: DomSlotDecortor } = {}

    protected slot(sid: SlotIds): DomSlotDecortor {
        return this.slotTable[sid] ?? (this.slotTable[sid] = new DomSlotDecortor(this, sid))
    }

    destroy(): void {
        super.destroy()
        Array.from(Object.values(this.slotTable)).forEach(v=>v.destroy())
    }

    insert(sid: SlotIds, node: Root | DomOption<HTMLElement>) {
        const ele = node instanceof Array ? this.createElement(node) : node

        this.syncUpdate(() => {
            const pa = this.slotTable[sid]
            if (pa instanceof DomSlotDecortor) {
                pa.insert(ele)
            }
        })
        return this
    }
    
}

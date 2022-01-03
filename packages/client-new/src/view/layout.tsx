import { flex } from "@/style";
import { View } from "@/utils/view";

export class Main extends View<never>{
    constructor(){
        super(
            <div className="main" style={{...flex.row()}}>
                <div className="content" style={{...flex.fill(),...flex.col()}}>
                    
                </div>
                <div className="sider" style={{...flex.fixed()}}>

                </div>
            </div>
        )
    }
}
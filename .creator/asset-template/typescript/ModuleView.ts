import { _decorator } from "cc";
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { CCComp } from "../../common/ecs/view/CCComp";

const { ccclass, property } = _decorator;

/** 视图层对象 */
@ccclass('<%Name%>Comp')
@ecs.register('<%Name%>', false)
export class <%Name%>Comp extends CCComp {
    /** 视图层逻辑代码分离演示 */
    onLoad() {
        // var entity = this.ent as ecs.Entity;         // ecs.Entity 可转为当前模块的具体实体对象
        // this.on(ModuleEvent.Cmd, this.onHandler, this);
    }

    /** 全局消息逻辑处理 */
    // private onHandler(event: string, args: any) {
    //     switch (event) {
    //         case ModuleEvent.Cmd:
    //             break;
    //     }
    // }

    /** 视图对象通过 ecs.Entity.remove(ModuleViewComp) 删除组件是触发组件处理自定义释放逻辑 */
    reset() {
        this.node.destroy();
    }
}
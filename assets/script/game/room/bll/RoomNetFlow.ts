/*
 * @Author: dgflash
 * @Date: 2022-05-17 11:00:06
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 16:43:12
 */

import { oops } from "../../../../../extensions/oops-framework/assets/core/Oops";
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { Room } from "../Room";
import { RoomOwnerLeaveComp } from "./RoomOwnerLeave";

/** 自己创建房间 */
@ecs.register('RoomNetFlow')
export class RoomNetFlowComp extends ecs.Comp {
    reset(): void { }
}

export class RoomNetFlowSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(RoomNetFlowComp);
    }

    entityEnter(e: Room): void {
        let wsc = e.RoomModelNet.wsc;

        // 客户端断开连接后逻辑
        wsc.flows.postDisconnectFlow.push(v => {
            if (!v.isManual) {
                oops.gui.toast(`服务器维护`);
                e.add(RoomOwnerLeaveComp);
            }
            return v;
        });

        e.remove(RoomNetFlowComp);
    }
}
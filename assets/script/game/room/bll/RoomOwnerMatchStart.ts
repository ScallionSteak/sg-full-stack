/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:45
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 16:45:33
 */
import { Message } from "../../../../../extensions/oops-framework/assets/core/common/event/MessageManager";
import { oops } from "../../../../../extensions/oops-framework/assets/core/Oops";
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { Room } from "../Room";
import { RoomEvent } from "../RoomEvent";

/** 开始匹配 */
@ecs.register('RoomOwnerMatchStart')
export class RoomOwnerMatchStartComp extends ecs.Comp {
    /** 角色名 */
    playerName: string = null;

    reset(): void {
        this.playerName = null;
    }
}

export class RoomOwnerMatchStartSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(RoomOwnerMatchStartComp);
    }

    async entityEnter(e: Room) {
        let ret = await e.RoomModelNet.hc.callApi('MatchStart', {}, { timeout: 5000 });
        if (ret.isSucc) {
            e.RoomModel.roomId = ret.res.roomId;
            e.RoomModel.serverUrl = ret.res.serverUrl;
            e.RoomModel.playerName = e.get(RoomOwnerMatchStartComp).playerName;

            // 通知创建房间完成
            Message.dispatchEvent(RoomEvent.RoomEnter);
        }
        else {
            oops.gui.toast("【房间】匹配失败");
        }
        e.remove(RoomOwnerMatchStartComp);
    }
}
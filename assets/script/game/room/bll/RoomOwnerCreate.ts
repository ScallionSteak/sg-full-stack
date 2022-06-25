/*
 * @Author: dgflash
 * @Date: 2022-05-05 12:13:02
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 16:43:26
 */
import { Message } from "../../../../../extensions/oops-framework/assets/core/common/event/MessageManager";
import { oops } from "../../../../../extensions/oops-framework/assets/core/Oops";
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { Room } from "../Room";
import { RoomEvent } from "../RoomEvent";

/** 自己创建房间 */
@ecs.register('RoomOwnerCreate')
export class RoomOwnerCreateComp extends ecs.Comp {
    /** 房间名 */
    roomName: string = null;
    /** 玩家名 */
    playerName: string = null;

    reset(): void {
        this.roomName = null;
        this.playerName = null;
    }
}

export class RoomOwnerCreateSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(RoomOwnerCreateComp);
    }

    async entityEnter(e: Room) {
        let match = e.RoomModelNet.hc;
        let roc = e.get(RoomOwnerCreateComp);
        let ret = await match.callApi(`RoomCreate`, { roomName: roc.roomName });
        if (ret.isSucc) {
            e.RoomModel.roomId = ret.res.roomId;
            e.RoomModel.serverUrl = ret.res.serverUrl;
            e.RoomModel.playerName = roc.playerName;

            // 通知创建房间完成
            Message.dispatchEvent(RoomEvent.RoomEnter);
        }
        else {
            oops.gui.toast("【房间】创建房间失败");
        }
        e.remove(RoomOwnerCreateComp);
    }
}
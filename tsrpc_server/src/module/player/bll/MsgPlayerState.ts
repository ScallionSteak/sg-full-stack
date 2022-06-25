/*
 * @Author: dgflash
 * @Date: 2022-05-16 16:41:19
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-23 11:10:11
 */

import { ecs } from "../../../core/ecs/ECS";
import { RoomConnection } from "../../../server/room/model/ServerRoomModelComp";
import { Player } from "../Player";

/** 客户端玩家通知房间服务器更新玩家状态数据 */
@ecs.register('MsgPlayerState')
export class MsgPlayerStateComp extends ecs.Comp {
    reset(): void { }
}

export class MsgPlayerStateSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem, ecs.IEntityRemoveSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(MsgPlayerStateComp);
    }

    entityEnter(e: Player): void {
        e.PlayerModel.conn.listenMsg(`client/PlayerState`, call => {
            // 同步的数据地方不对，加入房间进其它玩家数据没同步进去
            const conn = call.conn as RoomConnection;
            const msg = call.msg;

            const player = e.PlayerModel.conn.room.RoomModel.states[conn.player.PlayerModel.pi.id];
            player.pos = msg.pos;
            player.rotation = msg.rotation;
            player.action = msg.action;
        });
    }

    entityRemove(e: Player): void {
        e.PlayerModel.conn.unlistenMsgAll(`client/PlayerState`);
    }
}
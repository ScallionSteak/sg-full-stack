/*
 * @Author: dgflash
 * @Date: 2022-05-20 13:53:29
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-30 11:37:19
 */
import { ecs } from "../../../core/ecs/ECS";
import { RoomConnection } from "../../../server/room/model/ServerRoomModelComp";
import { Player } from "../Player";

/** 客户端玩家通知房间服务器转发状态数据（暂未使用 - 后续用于移动） */
@ecs.register('MsgPlayerMove')
export class MsgPlayerMoveComp extends ecs.Comp {
    reset(): void { }
}

export class MsgPlayerMoveSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem, ecs.IEntityRemoveSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(MsgPlayerMoveComp);
    }

    entityEnter(e: Player): void {
        e.PlayerModel.conn.listenMsg(`client/PlayerMove`, call => {
            const conn = call.conn as RoomConnection;
            e.PlayerModel.conn.room.broadcastMsg(`server/PlayerMove`, {
                state: {
                    uid: conn.player.PlayerModel.pi.id,
                    ...call.msg
                }
            });
        });
    }

    entityRemove(e: Player): void {
        e.PlayerModel.conn.unlistenMsgAll(`client/PlayerMove`);
    }
}
/*
 * @Author: dgflash
 * @Date: 2022-05-20 22:56:27
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-23 11:15:56
 */
import { ecs } from "../../../core/ecs/ECS";
import { Player } from "../Player";

/** 玩家离开房间 */
@ecs.register('PlayerLeaveRoom')
export class PlayerLeaveRoomComp extends ecs.Comp {
    reset(): void { }
}

export class PlayerLeaveRoomSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(PlayerLeaveRoomComp);
    }

    entityEnter(e: Player): void {
        let rcm = e.PlayerModel;
        let pi = rcm.pi;
        let room = rcm.conn.room;

        room.logger.log('玩家离开房间', pi.id, pi.nickname);

        // 移除房间中的玩家
        room.removePlayer(rcm.conn);

        if (rcm.conn) {
            // 关闭 websocket 连接
            rcm.conn.close();

            // 从消息中删除所有处理程序
            rcm.conn.player.removeMsgs();
        }

        // 广播玩家离开房间
        if (pi) {
            room.broadcastMsg(`server/PlayerLeave`, {
                time: new Date,
                playerInfo: pi
            });
        }

        // 记录上一次空房时间
        if (room.RoomModel.conns.length === 0) {
            room.RoomModel.data.timeLastEmpty = Date.now();
        }

        e.remove(PlayerLeaveRoomComp);
    }
}
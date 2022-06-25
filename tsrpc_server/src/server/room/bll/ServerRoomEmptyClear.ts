/*
 * @Author: dgflash
 * @Date: 2022-05-11 09:51:28
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-16 16:08:47
 */

import { ecs } from "../../../core/ecs/ECS";
import { Config } from "../../../module/config/Config";
import { ServerRoom } from "../ServerRoom";

/** 服务器空房清理 */
@ecs.register('ServerRoomEmptyClear')
export class ServerRoomEmptyClearComp extends ecs.Comp {
    reset(): void { }
}

var interval: ReturnType<typeof setInterval>;
export class ServerRoomEmptyClearSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem, ecs.IEntityRemoveSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(ServerRoomEmptyClearComp);
    }

    entityEnter(e: ServerRoom) {
        interval = setInterval(() => {
            const now = Date.now();
            const rooms = e.ServerRoomModel.rooms;

            // 清除超时没有玩家的房间
            rooms.array.filter(v => v.RoomModel.data.timeLastEmpty && now - v.RoomModel.data.timeLastEmpty >= Config.room.empty_time).forEach(room => {
                room.logger.log("房间删除");
                rooms.delete(room.RoomModel.data.id);
                room.destroy();
            });
        }, Config.room.empty_time);
    }

    entityRemove(e: ServerRoom): void {
        clearInterval(interval);
    }
}
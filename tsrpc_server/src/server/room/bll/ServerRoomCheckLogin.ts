/*
 * @Author: dgflash
 * @Date: 2022-05-11 11:09:32
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-16 14:57:50
 */

import { ecs } from "../../../core/ecs/ECS";
import { RoomConnection } from "../model/ServerRoomModelComp";
import { ServerRoom } from "../ServerRoom";

/** 
 * 登录态校验，WebSocket 与 HTTP 不同，登录态直接存在 Connection 上
 */
@ecs.register('ServerRoomCheckLogin')
export class ServerRoomCheckLoginComp extends ecs.Comp {
    reset(): void { }
}

export class ServerRoomCheckLoginSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(ServerRoomCheckLoginComp);
    }

    entityEnter(e: ServerRoom) {
        // 管线：执行 API 接口实现之前
        e.ServerRoomModel.wsSrever.flows.preApiCallFlow.push(async call => {
            const conn = call.conn as RoomConnection;
            const name = call.service.name;
            // 部分接口需要登录和加入房间后才可使用
            if (!name.startsWith('admin/') && name !== 'RoomJoin') {
                if (!conn.player.PlayerModel.pi.id) {
                    call.error('你还未登录', { code: 'ERROR_NEED_LOGIN' });
                    return undefined;
                }

                if (!conn.room) {
                    call.error('尚未加入房间', { code: 'ERROR_NO_ROOM' });
                    return undefined;
                }
            }

            return call;
        });
    }
}
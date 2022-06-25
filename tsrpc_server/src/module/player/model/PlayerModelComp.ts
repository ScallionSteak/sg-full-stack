/*
 * @Author: dgflash
 * @Date: 2022-05-20 14:04:45
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-20 15:43:04
 */

import { ecs } from "../../../core/ecs/ECS";
import { RoomConnection } from "../../../server/room/model/ServerRoomModelComp";
import { PlayerInfo } from "../../../tsrpc/types/PlayerInfo";

/** 房间连接状态数据 */
@ecs.register('PlayerModel')
export class PlayerModelComp extends ecs.Comp {
    /** 玩家基本信息 */
    pi: PlayerInfo = null!;

    /** 游戏房间连接 */
    conn: RoomConnection = null!;

    reset(): void {
        this.pi = null!;
        this.conn = null!;
    }
}
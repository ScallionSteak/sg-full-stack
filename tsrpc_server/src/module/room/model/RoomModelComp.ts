/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:40
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-20 23:40:10
 */
import { PrefixLogger } from "tsrpc";
import { ecs } from "../../../core/ecs/ECS";
import { RoomConnection } from "../../../server/room/model/ServerRoomModelComp";
import { RoomData } from "../../../tsrpc/types/RoomData";
import { RoomPlayerState } from "../../../tsrpc/types/RoomPlayerState";

/** 游戏房间数据 */
@ecs.register('RoomModel')
export class RoomModelComp extends ecs.Comp {
    /** 日志前缀 */
    logger: PrefixLogger = null!;

    /** 游戏房间连接 */
    conns: RoomConnection[] = [];

    /** 游戏房间数据 */
    data: RoomData = null!;

    /** 房间内玩家状态 */
    states: {
        [uid: string]: RoomPlayerState
    } = {};

    reset(): void {
        this.logger = null!;
        this.data = null!;
        this.states = {};
        this.conns.splice(0, this.conns.length);
        for (let uid in this.states) delete this.states[uid];
    }
}
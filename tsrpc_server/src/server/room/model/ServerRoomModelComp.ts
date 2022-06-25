/*
 * @Author: dgflash
 * @Date: 2022-05-06 11:03:18
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-09 10:59:58
 */

import { HttpClient, WsConnection, WsServer } from "tsrpc";
import { Collection } from "../../../core/collection/Collection";
import { ecs } from "../../../core/ecs/ECS";
import { Player } from "../../../module/player/Player";
import { Room } from "../../../module/room/Room";
import { ServiceType as ServiceTypeMatch } from "../../../tsrpc/protocols/ServiceProtoMatch";
import { ServiceType as ServiceTypeRoom } from "../../../tsrpc/protocols/ServiceProtoRoom";

/** 房间服务器数据 */
@ecs.register('ServerRoomModel')
export class ServerRoomModelComp extends ecs.Comp {
    /** 房间 websocket 服务器 */
    wsSrever: WsServer<ServiceTypeRoom> = null!;

    /** 与匹配服务器连接的 HTTP 客户端 */
    hcMatch: HttpClient<ServiceTypeMatch> = null!;

    /** 与匹配服务器的 WebSocket 连接对象 */
    matchServerConn?: RoomConnection;

    /** 房间对象集合 */
    rooms: Collection<string, Room> = new Collection();

    reset(): void {

    }
}

/** 房间服务器中的客户端 WebSocket 连接类型 */
export type RoomConnection = WsConnection<ServiceTypeRoom> & {
    /** 玩家所在房间管理对象 */
    room: Room;
    /** 玩家管理对象 */
    player: Player;
};
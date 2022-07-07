/*
 * @Author: dgflash
 * @Date: 2022-05-16 14:44:44
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-19 14:35:12
 */
import { ApiCall, PrefixLogger } from "tsrpc";
import * as uuid from 'uuid';
import { ecs } from "../../../../core/ecs/ECS";
import { Config } from "../../../../module/config/Config";
import { Room } from "../../../../module/room/Room";
import { sr } from "../../../../ServerRoom";
import { ReqRoomCreate, ResRoomCreate } from "../../../../tsrpc/protocols/room/admin/PtlRoomCreate";

/** 匹配服务器通知创建房间 */
export async function ApiRoomCreate(call: ApiCall<ReqRoomCreate, ResRoomCreate>) {
    let room = ecs.getEntity<Room>(Room);
    let rm = room.RoomModel;
    rm.data = {
        id: uuid.v4(),
        playerMax: Config.room.max_user_num,
        name: call.req.roomName,
        players: [],
        messages: [],
        timeStartMatch: Date.now(),
        timeUpdate: Date.now()
    };
    console.log("create here----------------------------------", call);

    rm.logger = new PrefixLogger({
        logger: sr.ServerRoomModel.wsSrever.logger,
        prefixs: [`[Room ${rm.data.id}]`],
    });

    sr.ServerRoomModel.rooms.set(room.RoomModel.data.id, room);

    call.succ({
        roomId: room.RoomModel.data.id
    });
}
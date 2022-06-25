/*
 * @Author: dgflash
 * @Date: 2022-05-16 14:44:44
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-23 11:13:23
 */
import { ApiCall } from "tsrpc";
import { ReqRoomChat, ResRoomChat } from "../../../tsrpc/protocols/room/PtlRoomChat";
import { RoomConnection } from "../model/ServerRoomModelComp";

/** 房间内聊天 */
export async function ApiRoomChat(call: ApiCall<ReqRoomChat, ResRoomChat>) {
    const conn = call.conn as RoomConnection;
    const room = conn.room;
    const pi = conn.player.PlayerModel.pi;

    room.broadcastMsg(`server/Chat`, {
        time: new Date,
        playerInfo: pi,
        content: call.req.content
    })

    call.succ({});
}
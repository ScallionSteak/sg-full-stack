/*
 * @Author: dgflash
 * @Date: 2022-05-16 14:44:44
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-07 09:45:12
 */
import { ApiCall } from 'tsrpc';
import * as uuid from 'uuid';
import { ecs } from "../../../core/ecs/ECS";
import { Player } from "../../../module/player/Player";
import { sr } from "../../../ServerRoom";
import { ReqRoomJoin, ResRoomJoin } from "../../../tsrpc/protocols/room/PtlRoomJoin";
import { PlayerInfo } from "../../../tsrpc/types/PlayerInfo";
import { PlayerPosition, PlayerRotation } from "../../../tsrpc/types/PlayerState";
import { RoomConnection } from "../model/ServerRoomModelComp";

/** 请求加入房间 */
export async function ApiRoomJoin(call: ApiCall<ReqRoomJoin, ResRoomJoin>) {
    const pi: PlayerInfo = {
        id: uuid.v4(),
        nickname: call.req.nickname
    }

    const conn = call.conn as RoomConnection;

    let room = sr.ServerRoomModel.rooms.get(call.req.roomId)!;
    let rm = room.RoomModel;
    if (!room) {
        return call.error('房间不存在', { code: 'ROOM_NOT_EXISTS' });
    }

    if (rm.data.players.length >= rm.data.playerMax) {
        return call.error('该房间已满员');
    }

    conn.player = ecs.getEntity<Player>(Player);

    // 用户已经在本房间中，可能是通过其它设备登录，踢出旧连接
    let existedConns = rm.conns.filter(v => v.player.PlayerModel.pi.id === pi.id);
    existedConns.forEach(v => { v.player.leave(); });

    // 用户正在其它房间中，从已有房间中退出（转到其它房间时用到）
    if (conn.room) conn.player.leave();

    // 测试：上线随机生成位置与旋转
    const pos = { x: Math.random() * 8, y: 1.7, z: Math.random() * 8 };
    const rotation = { x: 0, y: 0, z: 0, w: 1 };

    let player: (PlayerInfo & { pos: PlayerPosition } & { rotation: PlayerRotation }) = {
        ...pi,
        pos: pos,
        rotation: rotation
    }

    // 添加房间中的玩家
    room.addPlayer(conn, player);

    conn.room = room;
    conn.player.PlayerModel.pi = pi;
    conn.player.PlayerModel.conn = conn;
    conn.player.addMsgs();

    // 通知玩家加入房间成功
    call.succ({
        room: rm.data,
        playerInfo: pi
    });

    // 广播房间内玩家加入
    room.broadcastMsg(`server/PlayerJoin`, {
        time: new Date,
        playerInfo: pi,
        pos: pos,
        rotation: rotation
    });
}
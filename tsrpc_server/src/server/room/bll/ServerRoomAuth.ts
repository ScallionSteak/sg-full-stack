/*
 * @Author: dgflash
 * @Date: 2022-05-11 11:09:32
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-19 16:50:43
 */

import chalk from "chalk";
import { ApiCall } from "tsrpc";
import { ecs } from "../../../core/ecs/ECS";
import { Config } from "../../../module/config/Config";
import { sr } from "../../../ServerRoom";
import { ReqAuth, ResAuth } from "../../../tsrpc/protocols/room/admin/PtlAuth";
import { RoomConnection } from "../model/ServerRoomModelComp";
import { ServerRoom } from "../ServerRoom";
import { ServerRoomJoinMathServerComp } from "./ServerRoomServerJoinMatch";

/** 
 * 匹配服务器授权房间服务器开始工作
 * 1、与匹配服务器同步房间状态数据
 * 2、与匹配服务器断开时，自动重连
 */
@ecs.register('ServerRoomAuth')
export class ServerRoomAuthComp extends ecs.Comp {
    call: ApiCall<ReqAuth, ResAuth> = null!;

    reset(): void {
        this.call = null!;
    }
}

var interval: ReturnType<typeof setInterval>;
export class ServerRoomAuthSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem, ecs.IEntityRemoveSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(ServerRoomAuthComp);
    }

    entityEnter(e: ServerRoom) {
        let comp = e.ServerRoomAuth;
        if (comp.call.req.type === 'MatchServer') {
            let conn = comp.call.conn as RoomConnection;
            let srm = sr.ServerRoomModel;
            srm.matchServerConn = conn;

            // 定时与匹配服务器同步房间状态
            interval = setInterval(() => {
                conn.sendMsg(`admin/RoomUpdateState`, {
                    rooms: srm.rooms.array.map((v) => {
                        return {
                            id: v.RoomModel.data.id,
                            name: v.RoomModel.data.name,
                            playerNum: v.RoomModel.conns.length,
                            playerMax: v.RoomModel.data.playerMax,
                            timeUpdate: v.RoomModel.data.timeUpdate,                    // 房间信息的最后更新时间
                            timeStartMatch: v.RoomModel.data.timeStartMatch             // 为 undefined 代表不在匹配中
                        }
                    })
                })
            }, Config.room.update_state_interval);
        }

        comp.call.succ({});
    }

    entityRemove(e: ServerRoom): void {
        clearInterval(interval);

        var srm = e.ServerRoomModel;
        srm.matchServerConn = undefined;
        srm.wsSrever.logger.log(chalk.green(`与匹配服务器断开连接`));

        // 定时检测加入匹配服务
        e.add(ServerRoomJoinMathServerComp);
    }
}
/*
 * @Author: dgflash
 * @Date: 2022-05-11 10:47:14
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-09 12:02:15
 */

import chalk from "chalk";
import { ApiCall, PrefixLogger } from "tsrpc";
import * as uuid from 'uuid';
import { ecs } from "../../../core/ecs/ECS";
import { Config } from "../../../module/config/Config";
import { Room } from "../../../module/room/Room";
import { MatchUtil } from "../../match/bll/MatchUtil";
import { ServerRoom } from "../ServerRoom";
import {sr} from "../../../ServerRoom";
import { ApiRoomJoin } from "../api/ApiRoomJoin";
import { ReqRoomCreate, ResRoomCreate } from "../../../tsrpc/protocols/room/admin/PtlRoomCreate";
import { ApiRoomCreate } from "../api/admin/ApiRoomCreate";

/** 房间服务器加入匹配服务器 */
@ecs.register('ServerRoomJoinMathServer')
export class ServerRoomJoinMathServerComp extends ecs.Comp {
    reset(): void { }
}

export class ServerRoomJoinMathServerSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(ServerRoomJoinMathServerComp);
    }

    async entityEnter(e: ServerRoom) {
        await this.joinMatchServer(e);
    }

    async joinMatchServer(e: ServerRoom) {
        let rm = e.ServerRoomModel;
        let logger = rm.wsSrever.logger;

        // 房间服务器的地址通知匹配服务器，建立 WebSocket 连接
        let ret = await rm.hcMatch.callApi('admin/RoomServerJoin', {
            adminToken: Config.adminToken,
            serverUrl: Config.room.default_match_server_url_ws
        });

        // 添加匹配服务器失败时，延时5秒继续尝试加入
        if (!ret.isSucc) {
            logger.error(`通知匹配服务器链接地址[${Config.room.default_match_server_url_ws}]失败,3秒后尝试再次加入匹配服务器`, ret.err);
            setTimeout(this.joinMatchServer.bind(this, e), 3000);
            return;
        }

        logger.log(chalk.green('房间服务器开始服务'));
        e.remove(ServerRoomJoinMathServerComp);

        /** 以下是新增的创建初始房间的代码 */
        let room = ecs.getEntity<Room>(Room);
        //创建publicSpace
        let rm1 = room.RoomModel;
        rm1.data = {
            id: uuid.v4(),
            playerMax: Config.room.max_user_num,
            name: 'PublicSpaceRoom',
            players: [],
            messages: [],
            timeStartMatch: Date.now(),
            timeUpdate: Date.now()
        };

        rm1.logger = new PrefixLogger({
            logger: sr.ServerRoomModel.wsSrever.logger,
            prefixs: [`[Room ${rm1.data.id}]`],
        });
        sr.ServerRoomModel.rooms.set(room.RoomModel.data.id, room);
        
        let room2 = ecs.getEntity<Room>(Room);
        //创建SeeDAO私域
        let rm2 = room2.RoomModel;
        rm2.data = {
            id: uuid.v4(),
            playerMax: Config.room.max_user_num,
            name: 'SeeDAORoom',
            players: [],
            messages: [],
            timeStartMatch: Date.now(),
            timeUpdate: Date.now()
        };

        rm2.logger = new PrefixLogger({
            logger: sr.ServerRoomModel.wsSrever.logger,
            prefixs: [`[Room ${rm2.data.id}]`],
        });
        sr.ServerRoomModel.rooms.set(room2.RoomModel.data.id, room2);

        let room3 = ecs.getEntity<Room>(Room);
        //创建HYDAO私域
        let rm3 = room3.RoomModel;
        rm3.data = {
            id: uuid.v4(),
            playerMax: Config.room.max_user_num,
            name: 'HYDAORoom',
            players: [],
            messages: [],
            timeStartMatch: Date.now(),
            timeUpdate: Date.now()
        };

        rm3.logger = new PrefixLogger({
            logger: sr.ServerRoomModel.wsSrever.logger,
            prefixs: [`[Room ${rm3.data.id}]`],
        });
        sr.ServerRoomModel.rooms.set(room3.RoomModel.data.id, room3);

    }
}
/*
 * @Author: dgflash
 * @Date: 2022-05-13 13:39:02
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-24 14:21:07
 */
import { WECHAT } from 'cc/env';
import { WsClient as WsClient_Browser } from 'tsrpc-browser';
import { WsClient as WsClient_Miniapp } from 'tsrpc-miniapp';
import { Logger } from "../../../../../extensions/oops-framework/assets/core/common/log/Logger";
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { serviceProto as ServiceProtoRoom } from "../../../tsrpc/protocols/ServiceProtoRoom";
import { config } from '../../common/config/Config';
import { RoomConfig } from "../model/RoomConfig";
import { Room } from "../Room";
import { RoomNetFlowComp } from './RoomNetFlow';
import { RoomNetMsgComp } from './RoomNetMsg';
import { RoomOwnerJoinComp } from './RoomOwnerJoin';

/** 连接房间服务器 */
@ecs.register('RoomServerConnect')
export class RoomServerConnectComp extends ecs.Comp {
    reset(): void { }
}

export class RoomServerConnectSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(RoomServerConnectComp);
    }

    async entityEnter(e: Room) {
        let rm = e.RoomModel;

        // 创建客户端与房间服务器的 WebSocket 连接
        let wsc = new (WECHAT ? WsClient_Miniapp : WsClient_Browser)(ServiceProtoRoom, {
            server: rm.serverUrl,
            heartbeat: {
                interval: config.game.server.heartbeat_interval,
                timeout: config.game.server.heartbeat_timeout
            },
            json: config.game.server.json,
            // logger: console,
            // logMsg: true,
        });
        e.RoomModelNet.wsc = wsc;

        // 连接房间服务器
        let resConnect = await wsc.connect();
        if (!resConnect.isSucc) {
            Logger.logBusiness(resConnect.errMsg, '【房间】连接房间服务器失败');
            e.remove(RoomServerConnectComp);
            return;
        }

        let retRoomJoin = await e.RoomModelNet.wsc.callApi(`RoomJoin`, {
            roomId: rm.roomId,
            nickname: rm.playerName
        });

        if (retRoomJoin.isSucc) {
            e.add(RoomNetMsgComp);
            e.add(RoomNetFlowComp);
            e.add(RoomOwnerJoinComp).data = retRoomJoin.res;
        }
        else {
            Logger.logBusiness(retRoomJoin.err, '【房间】房间加入失败');
        }

        e.remove(RoomServerConnectComp);
    }
}
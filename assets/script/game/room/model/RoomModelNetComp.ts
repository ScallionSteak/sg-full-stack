/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:45
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-24 21:25:45
 */
import { WECHAT } from "cc/env";
import { HttpClient as HttpClient_Browser, WsClient as WsClient_Browser } from 'tsrpc-browser';
import { HttpClient as HttpClient_Miniapp, WsClient as WsClient_Miniapp } from 'tsrpc-miniapp';
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { serviceProto as ServiceProtoMatch } from "../../../tsrpc/protocols/ServiceProtoMatch";
import { ServiceType as ServiceTypeRoom } from "../../../tsrpc/protocols/ServiceProtoRoom";
import { config } from "../../common/config/Config";

/** 框架对外调用接口（单例对象） */
@ecs.register('RoomModelNet')
export class RoomModelNetComp extends ecs.Comp {
    /** 匹配服务器连接器 */
    hc = new (WECHAT ? HttpClient_Miniapp : HttpClient_Browser)(ServiceProtoMatch, {
        server: config.game.server.match,
        logger: console,
        json: config.game.server.json
    });

    /** 房间服务器连接器 */
    wsc: WsClient_Miniapp<ServiceTypeRoom> | WsClient_Browser<ServiceTypeRoom> = null!;

    reset(): void {

    }
}

/*
 * @Author: dgflash
 * @Date: 2022-06-24 10:09:49
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-24 20:29:42
 */
import { WECHAT } from "cc/env";
import { HttpClient as HttpClient_Browser } from 'tsrpc-browser';
import { HttpClient as HttpClient_Miniapp } from 'tsrpc-miniapp';
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { serviceProto as ServiceProtoGate } from "../../../tsrpc/protocols/ServiceProtoGate";
import { config } from "../../common/config/Config";

/** 网管网络对象 */
@ecs.register('GateNet')
export class GateNetComp extends ecs.Comp {
    /** 网关服务器连接器 */
    hc = new (WECHAT ? HttpClient_Miniapp : HttpClient_Browser)(ServiceProtoGate, {
        server: config.game.server.gate,
        logger: console,
        json: config.game.server.json
    });

    /** 数据层组件移除时，重置所有数据为默认值 */
    reset() {

    }
}
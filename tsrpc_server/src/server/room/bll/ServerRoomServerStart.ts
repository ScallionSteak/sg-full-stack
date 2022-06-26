/*
 * @Author: dgflash
 * @Date: 2022-05-06 11:44:11
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-23 10:23:00
 */
import chalk from "chalk";
import path from "path";
import { HttpClient, WsServer, WsServerOptions } from "tsrpc";
import { ecs } from "../../../core/ecs/ECS";
import { CommonAdminTokenComp } from "../../../module/common/bll/CommonAdminToken";
import { CommonUtil } from "../../../module/common/CommonUtil";
import { Config } from "../../../module/config/Config";
import { serviceProto as ServiceProtoMatch } from "../../../tsrpc/protocols/ServiceProtoMatch";
import { serviceProto as ServiceProtoRoom, ServiceType } from "../../../tsrpc/protocols/ServiceProtoRoom";
import { ServerRoom } from "../ServerRoom";
import { ServerRoomCheckLoginComp } from "./ServerRoomCheckLogin";
import { ServerRoomDisconnectComp } from "./ServerRoomDisconnect";
import { ServerRoomEmptyClearComp } from "./ServerRoomEmptyClear";
import { ServerRoomJoinMathServerComp } from "./ServerRoomServerJoinMatch";

/** 启动匹配服务器 */
@ecs.register('ServerRoomServerStart')
export class ServerRoomServerStartComp extends ecs.Comp {
    reset(): void { }
}

export class ServerRoomServerStartSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(ServerRoomServerStartComp);
    }

    async entityEnter(e: ServerRoom) {
        // 创建房间服务器 WebSocket 服务器
        let serverRoomPort = parseInt(Config.room.default_port);
        let options: Partial<WsServerOptions<ServiceType>> = {
            port: serverRoomPort,
            logMsg: Config.room.logMsg,
            json: Config.json,
            wss: CommonUtil.getCertificate()
        }
        let wsSrever = new WsServer(ServiceProtoRoom, options);
        e.ServerRoomModel.wsSrever = wsSrever;

        // 创建请求匹配服务器 HTTP 客户端
        // let serverUrlMatch = `${Config.https ? "https" : "http"}://${Config.room.default_match_server_url_http}/`;
        let hcMatch = new HttpClient(ServiceProtoMatch, { server: Config.room.default_match_server_url_http });
        e.ServerRoomModel.hcMatch = hcMatch;

        wsSrever.logger.log("匹配服务器HTTP地址", Config.room.default_match_server_url_http);
        wsSrever.logger.log("房间服务器Websocket地址", Config.room.default_match_server_url_ws);

        // 自定义管线
        e.add(CommonAdminTokenComp).server = wsSrever;

        // 登录态校验
        e.add(ServerRoomCheckLoginComp);

        // 与匹配服务器断开后清理房间
        e.add(ServerRoomDisconnectComp);

        // 如果指定 autoImplementApi 的第 2 个参数为 true，则开启延迟挂载，即延迟到对应接口被调用时才执行挂载操作，加快冷启动速度
        await wsSrever.autoImplementApi(path.resolve(__dirname, '../api'), true);
        wsSrever.logger.log(chalk.green(`[房间服务器] 服务已初始化完成`));

        // 启动房间服务器
        await wsSrever.start();
        wsSrever.logger.log(chalk.green(`[房间服务器] 成功启动`));

        // 定时检测加入匹配服务
        e.add(ServerRoomJoinMathServerComp);

        // 定时清除闲置的房间
        e.add(ServerRoomEmptyClearComp);

        e.remove(ServerRoomServerStartComp);
    }
}
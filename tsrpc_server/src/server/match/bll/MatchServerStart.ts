/*
 * @Author: dgflash
 * @Date: 2022-05-11 13:53:35
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-23 10:21:23
 */
import chalk from "chalk";
import path from "path";
import { HttpServer, HttpServerOptions } from "tsrpc";
import { ecs } from "../../../core/ecs/ECS";
import { CommonAdminTokenComp } from "../../../module/common/bll/CommonAdminToken";
import { CommonUtil } from "../../../module/common/CommonUtil";
import { Config } from "../../../module/config/Config";
import { serviceProto as ServiceProtoMatch, ServiceType } from "../../../tsrpc/protocols/ServiceProtoMatch";
import { ServerMatch } from "../ServerMatch";
import { MatchStartComp } from "./MatchStart";

/** 启动匹配服务器 */
@ecs.register('MatchServerStart')
export class MatchServerStartComp extends ecs.Comp {
    reset(): void { }
}

export class MatchServerStartSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(MatchServerStartComp);
    }

    async entityEnter(e: ServerMatch) {
        // 创建匹配 HTTP 服务器
        let options: Partial<HttpServerOptions<ServiceType>> = {
            port: parseInt(process.env['PORT'] || '3000'),
            json: Config.json,
            https: CommonUtil.getCertificate()
        }
        let server = new HttpServer(ServiceProtoMatch, options);
        e.MatchModel.hs = server;

        // 验证管理员授权
        e.add(CommonAdminTokenComp).server = server;

        // 如果指定 autoImplementApi 的第 2 个参数为 true，则开启延迟挂载，即延迟到对应接口被调用时才执行挂载操作，加快冷启动速度
        await server.autoImplementApi(path.resolve(__dirname, '../api'), true);
        server.logger.log(chalk.green(`[匹配服务器] 服务已初始化完成`));

        // 启动匹配服务器
        await server.start();
        server.logger.log(chalk.green(`[匹配服务器] 成功启动`));

        // 定时 log 播报房间状态
        var rooms = e.MatchModel.rooms;
        setInterval(() => {
            server.logger.log(`
[匹配服务器状态播报]
- 房间已连接数量 = ${rooms.count(v => !!v.state)}
- 房间连接中数量 = ${rooms.count(v => !v.state)}
- 房间总数　　　 = ${rooms.sum(v => v.state?.rooms.length ?? 0)}
- 房内用户数　　 = ${rooms.sum(v => v.state?.rooms.sum(v => v.playerNum) ?? 0)}`);
        }, Config.match.match_interval_logger);

        // 定时匹配验证（考虑修改为触发时匹配验证）
        e.add(MatchStartComp);
    }
}
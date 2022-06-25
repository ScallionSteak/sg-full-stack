/*
 * @Author: dgflash
 * @Date: 2022-06-22 18:32:20
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-23 17:45:43
 */
import chalk from "chalk";
import path from "path";
import { HttpServer, HttpServerOptions } from "tsrpc";
import { ecs } from "../../../core/ecs/ECS";
import { CommonUtil } from "../../../module/common/CommonUtil";
import { Config } from "../../../module/config/Config";
import { MongoDB } from "../../../module/mongodb/MongoDB";
import { serviceProto as ServiceProtoGate, ServiceType } from "../../../tsrpc/protocols/ServiceProtoGate";
import { ServerGate } from "../ServerGate";

/** 启动网关服务器 */
@ecs.register('GateServerStart')
export class GateServerStartComp extends ecs.Comp {
    reset(): void { }
}

export class GateServerStartSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(GateServerStartComp);
    }

    async entityEnter(e: ServerGate) {
        // 创建网关 HTTP 服务器
        let options: Partial<HttpServerOptions<ServiceType>> = {
            port: parseInt(process.env['PORT'] || '2000'),
            json: Config.json,
            https: CommonUtil.getCertificate()
        }

        let server = new HttpServer(ServiceProtoGate, options);
        e.GateModel.hs = server;

        // 如果指定 autoImplementApi 的第 2 个参数为 true，则开启延迟挂载，即延迟到对应接口被调用时才执行挂载操作，加快冷启动速度
        await server.autoImplementApi(path.resolve(__dirname, '../api'), true);
        server.logger.log(chalk.green(`[网关服务器] 服务已初始化完成`));

        // 连接数据库
        await MongoDB.init();
        server.logger.log(chalk.green(`[匹配服务器] 数据库实始化完成`));

        // 启动匹配服务器
        await server.start();
        server.logger.log(chalk.green(`[网关服务器] 成功启动`));

        this.testMongoDB(e);
    }

    private async testMongoDB(e: ServerGate) {
        var server = e.GateModel.hs;
        let ret = await server.callApi(`Register`, {
            username: "dgflash"
        })
        if (ret.isSucc) {
            server.logger.log(chalk.green("插入", ret.res.key));
        }
        else {
            server.logger.log(chalk.green("插入", ret.err));
        }

        let retGet = await server.callApi('Login', {
            username: "dgflash1"
        });
        if (retGet.isSucc)
            server.logger.log(chalk.green("获取", retGet.res));
        else
            server.logger.log(chalk.green("获取", retGet.err));
    }
}
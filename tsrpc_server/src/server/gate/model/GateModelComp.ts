/*
 * @Author: dgflash
 * @Date: 2022-06-22 18:30:08
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-23 18:44:46
 */

import { HttpServer } from "tsrpc";
import { ecs } from "../../../core/ecs/ECS";

/** 匹配数据 */
@ecs.register('GateModel')
export class GateModelComp extends ecs.Comp {
    /** 服务管理器 */
    hs: HttpServer = null!

    /** 游戏区服配置 */
    area: any = [
        { name: "艾欧尼亚(HTTP)", server: `http://127.0.0.1:3000/` },
        { name: "诺克萨斯(HTTPS)", server: `https://127.0.0.1:4000/` }
    ]

    reset(): void {

    }
}
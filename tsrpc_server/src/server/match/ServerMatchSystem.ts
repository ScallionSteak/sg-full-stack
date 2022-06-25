/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:40
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-22 18:45:55
 */
import { ecs } from "../../core/ecs/ECS";
import { EcsMatchSystem } from "./ServerMatch";

/** 匹配服务器模块 */
export class ServerMatchSystem extends ecs.RootSystem {
    constructor() {
        super();
        this.add(new EcsMatchSystem());
    }
}

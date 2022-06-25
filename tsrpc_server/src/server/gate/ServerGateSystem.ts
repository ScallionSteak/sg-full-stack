/*
 * @Author: dgflash
 * @Date: 2022-06-22 18:44:51
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-22 18:45:07
 */
import { ecs } from "../../core/ecs/ECS";
import { EcsGateSystem } from "./ServerGate";

/** 网关服务器模块 */
export class ServerGateSystem extends ecs.RootSystem {
    constructor() {
        super();
        this.add(new EcsGateSystem());
    }
}

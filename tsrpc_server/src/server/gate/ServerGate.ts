/*
 * @Author: dgflash
 * @Date: 2022-05-06 14:59:29
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-22 18:44:20
 */
import { ecs } from "../../core/ecs/ECS";
import { GateServerStartComp, GateServerStartSystem } from "./bll/GateServerStart";
import { GateModelComp } from "./model/GateModelComp";

/** 网关服务器 */
export class ServerGate extends ecs.Entity {
    GateModel!: GateModelComp;

    protected init() {
        this.addComponents<ecs.Comp>(
            GateModelComp);
    }

    /** 开启网关服务器 */
    start() {
        this.add(GateServerStartComp);
    }
}

export class EcsGateSystem extends ecs.System {
    constructor() {
        super();

        this.add(new GateServerStartSystem());
    }
}
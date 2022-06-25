/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-24 21:17:01
 */
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { EcsInitializeSystem } from "../../initialize/Initialize";
import { EcsRoleSystem } from "../../role/Role";
import { EcsRoomSystem } from "../../room/Room";
import { EcsSceneSystem } from "../../scene/Scene";

/** 多模块系统组件注册 */
export class CommonSystem extends ecs.System {
    constructor() {
        super();

        this.add(new EcsInitializeSystem());
        this.add(new EcsRoomSystem());
        this.add(new EcsSceneSystem());
        this.add(new EcsRoleSystem());
    }
}

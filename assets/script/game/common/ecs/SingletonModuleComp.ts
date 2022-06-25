/*
 * @Author: dgflash
 * @Date: 2021-11-18 14:20:46
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 16:37:10
 */
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { Initialize } from "../../initialize/Initialize";
import { Room } from "../../room/Room";
import { Scene } from "../../scene/Scene";

/** 游戏模块 */
@ecs.register('SingletonModule')
export class SingletonModuleComp extends ecs.Comp {
    /** 游戏初始化模块 */
    initialize: Initialize = null!;
    /** 场景模块 */
    scene: Scene = null!;
    /** 房间模块 */
    room: Room = null!;

    reset() { }
}

export var smc = ecs.getSingleton(SingletonModuleComp);
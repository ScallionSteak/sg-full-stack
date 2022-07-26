/*
 * @Author: dgflash
 * @Date: 2021-11-18 15:56:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 16:23:12
 */

import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { Tile } from "../../scene/model/MapModelComp";

/** 
 * 角色属性数据 
 * 
 * 实现功能
 * 1、角色唯一基础数据
 * 2、角色战斗属性数据
 * 3、角色VM组件绑定数据
 * 
 * 技术分析
 * 1、使用ecs.Comp做为数据层的基类，是为了后续业务开发过程中，只要ecs.Entity对象中包含了当前数据组件，就可以通过 ecs.Entity.get(RoleModelComp) 的方式获取对应子模块的数据
 */
@ecs.register('RoleModel')
export class RoleModelComp extends ecs.Comp {
    /** 提供 VM 组件使用的数据 */
    vm: any = {};

    /** ----------基础属性---------- */
    /** 角色编号 */
    id: string = null;
    /** 资源地址 */
    res: string = `game/content/player/player`;
    /** 角色所在地形数据 */
    tile: Tile = null!;

    private _nickname: string = "";
    /** 昵称 */
    get nickname(): string {
        return this._nickname;
    }
    set nickname(value: string) {
        this._nickname = value;
        this.vm.name = value;
console.log("i'm susu");
    }

    /** 移动速度 */
    speed: number = 240;

    reset() {
        this.id = null;
        this.nickname = "";

        for (var key in this.vm) {
            this.vm[key] = 0;
        }
    }
}

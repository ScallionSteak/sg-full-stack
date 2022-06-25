/*
 * @Author: dgflash
 * @Date: 2022-06-24 09:55:51
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-24 21:08:59
 */
import { _decorator } from "cc";
import { oops } from "../../../../../extensions/oops-framework/assets/core/Oops";
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { UIID } from "../../common/config/GameUIConfig";
import { CCVMParentComp } from "../../common/ecs/view/CCVMParentComp";
import { InitializeEvent } from "../InitializeEvent";
import { GateNetComp } from "../model/GateNetComp";

const { ccclass, property } = _decorator;

/** 视图层对象 */
@ccclass('LoginViewComp')
@ecs.register('LoginView', false)
export class GameLoginViewComp extends CCVMParentComp {
    /** 视图层逻辑代码分离演示 */
    onLoad() {
        this.on(InitializeEvent.Logined, this.onHandler, this);
    }

    /** 获取区服信息 */
    async getGameArea() {
        var hs = this.ent.get(GateNetComp).hc;
        var ret = await hs.callApi(`GameArea`, {});
        if (ret.isSucc) {
            console.log(ret.res.area);
        }
    }

    /** 全局消息逻辑处理 */
    private onHandler(event: string, args: any) {
        switch (event) {
            case InitializeEvent.Logined:
            oops.gui.open(UIID.Demo_Match);

                break;
        }
    }

    /** 视图对象通过 ecs.Entity.remove(ModuleViewComp) 删除组件是触发组件处理自定义释放逻辑 */
    reset() {
        this.node.destroy();
    }
}
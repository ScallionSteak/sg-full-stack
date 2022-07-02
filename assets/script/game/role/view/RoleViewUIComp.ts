/*
 * @Author: SS
 * @Date: 2022-06-27
 */

import { EditBox, EventTouch, Label, Node, Vec3, _decorator } from 'cc';
import { DEBUG } from 'cc/env';

import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import VMLabel from '../../../../../extensions/oops-framework/assets/libs/model-view/VMLabel';
import { oops } from '../../../../../extensions/oops-framework/assets/core/Oops';

import { smc } from '../../common/ecs/SingletonModuleComp';
import { CCComp } from '../../common/ecs/view/CCComp';
import { Role } from '../Role';
import { RoleModelComp } from '../model/RoleModelComp';
const { ccclass, property } = _decorator;

/** 角色摇撼控制 */
@ccclass("RoleViewUIComp")
@ecs.register('RoleViewUIJoystick', false)
export class RoleViewUIComp extends CCComp {

    @property({ type: EditBox })
    chatContent: EditBox = null!;

    @property({ type: Node })
    labelTitle: Node = null!;

    @property({ type: Node })
    labelServerUrl: Node = null!;

    @property({type: Node})
    moveSpeedBtn: Node = null!;

    @property({ type: EditBox })
    moveSpeedContent: EditBox = null!;

    /** 控制的目标角色 */
    private target: Role = null!;

    start() {
        this.displaySpeedValue();
        if (!DEBUG) {
            this.labelServerUrl.active = false;
            this.labelTitle.getComponent(VMLabel).destroy();
            this.labelTitle.getComponent(Label).string = "点击获取源码";
            this.labelTitle.on(Node.EventType.TOUCH_END, () => {
                window.open("https://store.cocos.com/app/detail/3814", "_blank");
            }, this);
        }

        this.target = this.ent as Role;
        // this.joystick.onController = (event: EventTouch, data: JoystickDataType) => {
        //     if (this.target.RoleView.isNoMove) return;

        //     switch (data.type) {
        //         case SpeedType.NORMAL:
        //         case SpeedType.FAST:
        //             smc.room.playerMove(data.vector, data.angle);
        //             this.target.RoleView.moveJoystick(data);
        //             break;
        //         case SpeedType.STOP:
        //             smc.room.playerMove();
        //             this.target.RoleView.idle();
        //             break;
        //     }
        // }

        // this.get("skill")!.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    // private onTouchEnd(event: EventTouch) {
    //     if (this.target.RoleView.isNoMove) return;

    //     /** 找到最新的目标 */
    //     var a = Number.MAX_VALUE;
    //     var current: number;
    //     var t: Role;
    //     smc.room.RoomModel.players.forEach(p => {
    //         if (this.target != p && p.RoleView.isNoMove == false) {
    //             current = Vec3.distance(p.RoleView.node.position, this.target.RoleView.node.position)
    //             if (a > current) {
    //                 a = current;
    //                 t = p;
    //             }
    //         }
    //     });

    //     if (t) {
    //         smc.room.playerMoveTarget(t.RoleView.node.worldPosition);

    //         var d = Vec3.distance(t.RoleView.node.worldPosition, this.target.RoleView.node.worldPosition);
    //         if (d <= 5) {
    //             this.target.RoleView.moveTouch(t.RoleView.node.worldPosition, 5, () => {
    //                 smc.room.playerAttack(this.target, t, 1);
    //             });
    //         }
    //         else {
    //             this.target.RoleView.moveTouch(t.RoleView.node.worldPosition, 5, () => {
    //                 smc.room.playerAttack(this.target, t, 1);
    //             });
    //         }
    //     }
    //     else {
    //         oops.gui.toast("游戏中没有其它玩家可攻击，攻击时会优先攻击距离最近玩家")
    //     }
    // }

    displaySpeedValue() {
        this.moveSpeedContent.string = String(this.ent.get(RoleModelComp).speed);
    }

    updateSpeedValue() {
        var newSpeed = this.moveSpeedContent.string;
        this.ent.get(RoleModelComp).speed = Number(newSpeed);
    }

    private exit() {
        smc.room.leave();
    }

    /** 聊天 */
    private chat() {
        if (this.chatContent.string != "") {
            smc.room.chat(this.chatContent.string);
            this.chatContent.string = "";
        }
    }

    reset(): void {

    }
}
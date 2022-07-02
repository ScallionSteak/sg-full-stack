/*
 * @Author: dgflash
 * @Date: 2022-03-22 17:53:34
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-22 09:41:10
 */
import { Component, Vec3, _decorator, Node, Label } from "cc";
import { MoveTo } from "../../../../../extensions/oops-framework/assets/core/game/move/MoveTo";
import { MoveTranslate } from "../../../../../extensions/oops-framework/assets/core/game/move/MoveTranslate";
import { RoleModelComp } from "../model/RoleModelComp";
import { Role } from "../Role";
import { RoleKeyboard } from "./RoleKeyboard";
import { RoleViewAnimator } from "./RoleViewAnimator";
import { RoleViewComp } from "./RoleViewComp";

const { ccclass, property } = _decorator;

/** 角色显示组件 */
@ccclass('RoleViewCharactor')
export class RoleViewCharactor extends Component {
    
    @property({ type: Node })
    roleTempName: Node = null!;

    /** 角色动画组件 */
    rva: RoleViewAnimator = null!;
    /** 角色键盘控制 */
    rkb: RoleKeyboard = null!;

    start() {
        this.roleTempName.getComponent(Label).string = localStorage.getItem("walletAddress");
        this.rva = this.getComponent(RoleViewAnimator);
        this.rkb = this.getComponent(RoleKeyboard);
    }

    /** 待机动画 */
    idle() {
        this.rva.idle();
        this.stop();
    }

    /** 移动动画 */
    run(data) {
        this.rva.run(data);
    }

    /**
     * 摇杆移动
     * @param role      控制的角色
     * @param data      摇杆数据
     */
    moveJoystick(role: Role, data: any) {
        // 移除直线移动组件
        var moveTo = this.getComponent(MoveTo);
        if (moveTo) {
            moveTo.destroy();
            this.rva.idle();
        }

        // 摇杆移动
        var move = this.getComponent(MoveTranslate) || this.addComponent(MoveTranslate);

        if (move) {
            move.speed = this.getComponent(RoleViewComp).ent.get(RoleModelComp).speed;
            move.velocity.x = data.vector.x;
            move.velocity.y = data.vector.y;
            this.rva.run(data);
        }
    }

    /** 待机动画 */
    stop() {
        var move = this.getComponent(MoveTranslate);

        if (move) {
            move.speed = 0;
            move.velocity.set(Vec3.ZERO);
        }

        // 待机动画
        this.rva.idle();                             // 播放待机动作
    }
}

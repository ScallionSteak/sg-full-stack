/*
 * @Author: dgflash
 * @Date: 2021-11-18 17:42:59
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-24 14:04:35
 */

import { Label, Node, Sprite, SpriteAtlas, tween, TweenSystem, Vec3, _decorator } from "cc";
import { MoveTo } from "../../../../../extensions/oops-framework/assets/core/game/move/MoveTo";
import { HttpRequestForDS } from "../../../../../extensions/oops-framework/assets/core/network/http";
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { PlayerPosition } from "../../../tsrpc/types/PlayerState";
import { smc } from "../../common/ecs/SingletonModuleComp";
import { CCComp } from "../../common/ecs/view/CCComp";
import { RoleModelComp } from "../model/RoleModelComp";
import { Role } from "../Role";
import { RoleViewCharactor } from "./RoleViewCharactor";

const { ccclass, property } = _decorator;

/** 角色显示组件 */
@ccclass('RoleViewComp')
@ecs.register('RoleView', false)
export class RoleViewComp extends CCComp {
    /** 角色控制器 */
    rvc: RoleViewCharactor = null;

    @property(Node)
    playerNameLabel: Node = null;

    @property(Node)
    playerPortrait: Node = null;

    @property(SpriteAtlas)
    UIAtlas: SpriteAtlas = null;

    onLoad() {
        super.onLoad();

        this.rvc = this.getComponent(RoleViewCharactor);

    }

    setPlayerOutlook(player: Role) {
        this.playerNameLabel.getComponent(Label).string = player.RoleModel.nickname;
        smc.room.RoomModel.players.forEach((p)=> {
            if (player.RoleModel.id == p.RoleModel.id) {                
                this.playerPortrait.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame("main/R0" + String(p.RoleModel.userModelID));
            }
        })
        
        
    }

    /** 待机动画 */
    idle() {
        this.rvc.idle();
    }

    /** 攻击动画 */
    run(data) {
        this.rvc.run(data);
    }

    move(target: Vec3) {
        // 触摸移动
        var moveTo = this.getComponent(MoveTo) || this.addComponent(MoveTo);
        moveTo.node = this.node;
        moveTo.target = target;
        moveTo.speed = this.ent.get(RoleModelComp).speed;
        moveTo.hasYAxis = true;
        moveTo.onStart = () => {
            this.rvc.run(target);                 // 播放跑步动作
        }
        moveTo.onComplete = () => {
            this.stop();
        };
    }

    /** 待机动画 */
    stop() {
        this.rvc.stop();
    }

    /** 缓动移动（网络延时时系统自动使用） */
    moveTween(pos: PlayerPosition) {
        TweenSystem.instance.ActionManager.removeAllActionsFromTarget(this.node.position as any);

        // 位移
        tween(this.node.position).to(0.1, pos, {
            onUpdate: (v, ratio) => {
                this.node.position = this.node.position;
            }
        }).start();
    }

    /**
     * 摇杆移动
     * @param data      摇杆数据
     */
    moveJoystick(data: any) {
        this.rvc.moveJoystick(this.ent as Role, data);
    }


    reset() {
        TweenSystem.instance.ActionManager.removeAllActionsFromTarget(this.node.position as any);
        this.node.destroy();
    }
}
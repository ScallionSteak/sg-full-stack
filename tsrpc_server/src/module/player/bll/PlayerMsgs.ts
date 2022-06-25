/*
 * @Author: dgflash
 * @Date: 2022-05-20 14:07:18
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-27 11:43:49
 */
import { ecs } from "../../../core/ecs/ECS";
import { Player } from "../Player";
import { MsgPlayerAttackComp } from "./MsgPlayerAttack";
import { MsgPlayerMoveComp } from "./MsgPlayerMove";
import { MsgPlayerStateComp } from "./MsgPlayerState";

/** 
 * 玩家连接对象管理 
 * 1、处理各种游戏协议逻辑
 */
@ecs.register('PlayerMsgs')
export class PlayerMsgsComp extends ecs.Comp {
    reset(): void { }
}

export class PlayerMsgsSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem, ecs.IEntityRemoveSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(PlayerMsgsComp);
    }

    entityEnter(e: Player): void {
        e.add(MsgPlayerStateComp);
        e.add(MsgPlayerMoveComp);
        e.add(MsgPlayerAttackComp);
    }

    entityRemove(e: Player): void {
        e.remove(MsgPlayerStateComp);
        e.remove(MsgPlayerMoveComp);
        e.remove(MsgPlayerAttackComp);
    }
}
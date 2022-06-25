/*
 * @Author: dgflash
 * @Date: 2022-05-27 11:33:44
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-27 11:55:48
 */
import { ecs } from "../../../core/ecs/ECS";
import { Player } from "../Player";

/** 接受客户端攻击命令并转发给房间其它玩家 */
@ecs.register('MsgPlayerAttack')
export class MsgPlayerAttackComp extends ecs.Comp {
    reset(): void { }
}

export class MsgPlayerAttackSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem, ecs.IEntityRemoveSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(MsgPlayerAttackComp);
    }

    entityEnter(e: Player): void {
        e.PlayerModel.conn.listenMsg(`server/PlayerAttack`, call => {
            e.PlayerModel.conn.room.broadcastMsg(`server/PlayerAttack`, call.msg);
        });
    }

    entityRemove(e: Player): void {
        e.PlayerModel.conn.unlistenMsgAll(`server/PlayerAttack`);
    }
}
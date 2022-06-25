/*
 * @Author: dgflash
 * @Date: 2022-05-17 10:58:13
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 16:43:16
 */
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { Room } from "../Room";
import { MsgPlayerAttackComp } from "./MsgPlayerAttack";
import { MsgPlayerChatComp } from "./MsgPlayerChat";
import { MsgPlayerJoinComp } from "./MsgPlayerJoin";
import { MsgPlayerLeaveComp } from "./MsgPlayerLeave";
import { MsgPlayerMoveComp } from "./MsgPlayerMove";
import { MsgRoomPlayerStateComp } from "./MsgRoomPlayerState";

/** 自己创建房间 */
@ecs.register('RoomNetMsg')
export class RoomNetMsgComp extends ecs.Comp {
    reset(): void { }
}

export class RoomNetMsgSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem, ecs.IEntityRemoveSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(RoomNetMsgComp);
    }

    entityEnter(e: Room): void {
        e.add(MsgRoomPlayerStateComp);     // 监视服务器玩家状态数据
        e.add(MsgPlayerJoinComp);          // 监视它玩家加入房间
        e.add(MsgPlayerLeaveComp);         // 监视它玩家离开房间
        e.add(MsgPlayerChatComp);          // 监视玩家聊天
        e.add(MsgPlayerMoveComp);           // 监视玩家状态
        e.add(MsgPlayerAttackComp);        // 监视玩家攻击命令
    }

    entityRemove(e: Room): void {
        e.RoomModelNet.wsc.disconnect();

        e.remove(MsgRoomPlayerStateComp);
        e.remove(MsgPlayerJoinComp);
        e.remove(MsgPlayerLeaveComp);
        e.remove(MsgPlayerChatComp);
        e.remove(MsgPlayerMoveComp);
        e.remove(MsgPlayerAttackComp);
    }
}
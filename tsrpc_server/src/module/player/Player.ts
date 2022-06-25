/*
 * @Author: dgflash
 * @Date: 2022-05-20 14:03:53
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-27 11:45:36
 */

import { ecs } from "../../core/ecs/ECS";
import { MsgPlayerStateSystem } from "./bll/MsgPlayerState";
import { MsgPlayerMoveSystem } from "./bll/MsgPlayerMove";
import { PlayerMsgsComp, PlayerMsgsSystem } from "./bll/PlayerMsgs";
import { PlayerLeaveRoomComp, PlayerLeaveRoomSystem } from "./bll/PlayerLeaveRoom";
import { PlayerModelComp } from "./model/PlayerModelComp";
import { MsgPlayerAttackSystem } from "./bll/MsgPlayerAttack";

/** 房间中玩家连接对象 */
export class Player extends ecs.Entity {
    PlayerModel!: PlayerModelComp;

    protected init() {
        this.addComponents<ecs.Comp>(
            PlayerModelComp,
        );
    }

    /** 离开房间 */
    leave() {
        this.add(PlayerLeaveRoomComp);
    }

    /** 添加监听消息 */
    addMsgs() {
        this.add(PlayerMsgsComp);
    }

    /** 删除监听消息 */
    removeMsgs() {
        this.remove(PlayerMsgsComp);
    }
}

export class EcsPlayerSystem extends ecs.System {
    constructor() {
        super();

        this.add(new PlayerMsgsSystem());
        this.add(new MsgPlayerStateSystem());
        this.add(new MsgPlayerMoveSystem());
        this.add(new MsgPlayerAttackSystem());
        this.add(new PlayerLeaveRoomSystem());
    }
}
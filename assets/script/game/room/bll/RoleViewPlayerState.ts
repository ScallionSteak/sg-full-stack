/*
 * @Author: dgflash
 * @Date: 2022-05-17 17:13:02
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-24 14:02:11
 */
import { Component, _decorator } from "cc";
import { MoveTo } from "../../../../../extensions/oops-framework/assets/core/game/move/MoveTo";
import { MoveTranslate } from "../../../../../extensions/oops-framework/assets/core/game/move/MoveTranslate";
import { MsgPlayerState } from "../../../tsrpc/protocols/room/client/MsgPlayerState";
import { config } from "../../common/config/Config";
import { smc } from "../../common/ecs/SingletonModuleComp";
import { Role } from "../../role/Role";
import { RoleViewComp } from "../../role/view/RoleViewComp";
import { RoleCollision } from "../../role/view/RoleCollision";

const { ccclass, property } = _decorator;

/** 同步自己的状态给服务器 */
@ccclass('RoleViewPlayerState')
export class RoleViewPlayerState extends Component {
    role: Role = null;

    onLoad() {
        this.role = this.getComponent(RoleViewComp).ent as Role;
        this.schedule(this.updateState, config.game.server.player_state_update_rate);
    }

    updateState() {
        let move = this.getComponent(RoleCollision);
        let action;
        if (move) {
            if (move.speed > 0)
                action = "run";
            else
                action = "idle";
        }
        else {
            let moveTo = this.getComponent(MoveTo);
            if (moveTo)
                action = "run";
            else
                action = "idle";
        }

        var msg: MsgPlayerState = {
            pos: this.node.position,
            rotation: this.node.rotation,
            action
        }
        smc.room.RoomModelNet.wsc.sendMsg(`client/PlayerState`, msg);
    }
}
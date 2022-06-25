/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:45
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 16:45:12
 */

import { Vec3 } from "cc";
import { Logger } from "../../../../extensions/oops-framework/assets/core/common/log/Logger";
import { ecs } from "../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { MsgPlayerMove } from "../../tsrpc/protocols/room/client/MsgPlayerMove";
import { Role } from "../role/Role";
import { MsgPlayerAttackSystem } from "./bll/MsgPlayerAttack";
import { MsgPlayerChatSystem } from "./bll/MsgPlayerChat";
import { MsgPlayerJoinSystem } from "./bll/MsgPlayerJoin";
import { MsgPlayerLeaveSystem } from "./bll/MsgPlayerLeave";
import { MsgPlayerMoveSystem } from "./bll/MsgPlayerMove";
import { MsgRoomPlayerStateSystem } from "./bll/MsgRoomPlayerState";
import { RoomNetFlowSystem } from "./bll/RoomNetFlow";
import { RoomNetMsgSystem } from "./bll/RoomNetMsg";
import { RoomOwnerCreateComp, RoomOwnerCreateSystem } from "./bll/RoomOwnerCreate";
import { RoomOwnerJoinSystem } from "./bll/RoomOwnerJoin";
import { RoomOwnerLeaveComp, RoomOwnerLeaveSystem } from "./bll/RoomOwnerLeave";
import { RoomOwnerMatchStartComp, RoomOwnerMatchStartSystem } from "./bll/RoomOwnerMatchStart";
import { RoomServerConnectComp, RoomServerConnectSystem } from "./bll/RoomServerConnect";
import { RoomModelComp } from "./model/RoomModelComp";
import { RoomModelNetComp } from "./model/RoomModelNetComp";

/** 房间管理 */
export class Room extends ecs.Entity {
    // 数据层
    RoomModelNet!: RoomModelNetComp;
    RoomModel!: RoomModelComp;

    protected init() {
        this.addComponents<ecs.Comp>(
            RoomModelNetComp,
            RoomModelComp);
    }

    /**
     * 开始匹配
     * @param playerName  玩家名
     */
    matchStart(playerName: string) {
        this.add(RoomOwnerMatchStartComp).playerName = playerName;
    }

    /** 停止匹配 */
    matchStop() {

    }

    /**
     * 创建房间
     * @param roomName    房间名
     * @param playerName  玩家名
     */
    create(roomName: string, playerName: string) {
        var comp = this.add(RoomOwnerCreateComp);
        comp.roomName = roomName;
        comp.playerName = playerName;
    }

    /**
     * 加入房间
     * @param roomId        房间编号
     * @param serverUrl     房间服地址
     * @param playerName    玩家名
     */
    join(roomId?: string, serverUrl?: string, playerName?: string) {
        if (roomId) this.RoomModel.roomId = roomId;
        if (serverUrl) this.RoomModel.serverUrl = serverUrl;
        if (playerName) this.RoomModel.playerName = playerName;
        this.add(RoomServerConnectComp);
    }

    /** 离开房间 */
    leave() {
        this.add(RoomOwnerLeaveComp);
    }

    /** 房间聊天 */
    async chat(content: string) {
        let ret = await this.RoomModelNet.wsc.callApi(`RoomChat`, {
            content: content
        });

        if (!ret.isSucc) {
            Logger.logBusiness("【房间】发送聊天信息失败");
        }
    }

    playerMove(vector?: Vec3, angle?: number) {
        var data: MsgPlayerMove = {};
        if (vector) {
            data = {
                action: `run`,
                vector,
                angle
            }
        }
        this.RoomModelNet.wsc.sendMsg(`client/PlayerMove`, data);
    }

    playerMoveTarget(target: Vec3) {
        var data: MsgPlayerMove = { target };
        this.RoomModelNet.wsc.sendMsg(`client/PlayerMove`, data);
    }

    playerAttack(attacker: Role, target: Role, skilleId: number) {
        this.RoomModelNet.wsc.sendMsg(`server/PlayerAttack`, {
            uid: attacker.RoleModel.id,
            targetId: target.RoleModel.id,
            skillId: skilleId
        });
    }
}

export class EcsRoomSystem extends ecs.System {
    constructor() {
        super();

        this.add(new RoomNetFlowSystem());
        this.add(new RoomNetMsgSystem());
        this.add(new RoomServerConnectSystem());
        this.add(new RoomOwnerMatchStartSystem());
        this.add(new RoomOwnerCreateSystem());
        this.add(new RoomOwnerJoinSystem());
        this.add(new RoomOwnerLeaveSystem());
        this.add(new MsgRoomPlayerStateSystem());
        this.add(new MsgPlayerJoinSystem());
        this.add(new MsgPlayerLeaveSystem());
        this.add(new MsgPlayerChatSystem());
        this.add(new MsgPlayerMoveSystem());
        this.add(new MsgPlayerAttackSystem());
    }
}
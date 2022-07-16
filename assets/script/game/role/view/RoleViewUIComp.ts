/*
 * @Author: SS
 * @Date: 2022-06-27
 */

import { EditBox, EventTouch, instantiate, Label, Node, Prefab, Sprite, SpriteAtlas, Vec3, _decorator } from 'cc';
import { DEBUG } from 'cc/env';

import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import VMLabel from '../../../../../extensions/oops-framework/assets/libs/model-view/VMLabel';
import { oops } from '../../../../../extensions/oops-framework/assets/core/Oops';

import { smc } from '../../common/ecs/SingletonModuleComp';
import { CCComp } from '../../common/ecs/view/CCComp';
import { Role } from '../Role';
import { RoleModelComp } from '../model/RoleModelComp';
import { UIID } from '../../common/config/GameUIConfig';
import { UICallbacks } from '../../../../../extensions/oops-framework/assets/core/gui/layer/Defines';
import { RoomUtil } from '../../room/bll/RoomUtil';
import { RoomReenterDaoBtnList } from '../../room/view/RoomReenterDaoBtnList';
const { ccclass, property } = _decorator;

/** 角色摇撼控制 */
@ccclass("RoleViewUIComp")
@ecs.register('RoleViewUIComp', false)
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

    @property(Prefab)
    prefabEnterDaoBtnListItem!: Prefab;

    /** 控制的目标角色 */
    private target: Role = null!;

    start() {
        this.displaySpeedValue();
        this.target = this.ent as Role;
        this.loadRoomList();
    }

    displaySpeedValue() {
        this.moveSpeedContent.string = String(this.ent.get(RoleModelComp).speed);
    }

    updateSpeedValue() {
        var newSpeed = this.moveSpeedContent.string;
        this.ent.get(RoleModelComp).speed = Number(newSpeed);
    }

    openChatWindow() {
        oops.gui.open(UIID.Demo_Chat);
    }

    /** 刷新房间列表 */
    async loadRoomList() {
        let ret = await smc.room.RoomModelNet.hc.callApi('RoomList', {});
        if (ret.isSucc) {
            try {
                for (let roomInfo of ret.res.rooms) {
                    let btnNode = instantiate(this.prefabEnterDaoBtnListItem);
                    btnNode.getComponent(RoomReenterDaoBtnList).initRoomInfo(roomInfo);
                    btnNode.parent = this.node.getChildByName('daoListLayer');
                }
            }
            catch (e) {
                console.log("登录界面已释放")
            }
        }
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
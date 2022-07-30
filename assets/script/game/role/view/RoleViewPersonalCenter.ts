/*
 * @Author: SS
 * @Date: 2022-06-27
 */

import { AudioSource, EditBox, EventTouch, Label, Node, Sprite, SpriteAtlas, v3, Vec3, _decorator } from 'cc';
import { DEBUG } from 'cc/env';

import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import VMLabel from '../../../../../extensions/oops-framework/assets/libs/model-view/VMLabel';
import { oops } from '../../../../../extensions/oops-framework/assets/core/Oops';

import { smc } from '../../common/ecs/SingletonModuleComp';
import { CCComp } from '../../common/ecs/view/CCComp';
import { Role } from '../Role';
import { RoleModelComp } from '../model/RoleModelComp';
import { UIID } from '../../common/config/GameUIConfig';
import { MapViewControl } from '../../scene/view/MapViewControl';
const { ccclass, property } = _decorator;

/** 角色摇撼控制 */
@ccclass("RoleViewPersonalCenter")
@ecs.register('RoleViewPersonalCenter', false)
export class RoleViewPersonalCenter extends CCComp {

    @property({ type: Node })
    playerPortrait: Node = null!;
    @property({ type: Node })
    playerName: Node = null!;
    @property({ type: Node })
    playerSelfIntro: Node = null!;
    @property({ type: SpriteAtlas })
    UIAtlas: SpriteAtlas = null!;

    onLoad() {
        this.updatePlayerInfo();
    }

    updatePlayerInfo() {
        var playerName = smc.room.RoomModel.owner.RoleModel.userDBName;
        var playerModel = String(smc.room.RoomModel.owner.RoleModel.userModelID);
        this.playerName.getComponent(Label).string = playerName;
        this.playerPortrait.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame("main/R0" + playerModel);
    }

    closeSelf() {
        oops.gui.remove(UIID.Demo_personalCenter);
    }

    reset(): void {

    }
}
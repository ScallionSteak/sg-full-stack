/*
 * @Author: SS
 * @Date: 2022-06-27
 */

import { EditBox, EventTouch, instantiate, Label, Node, Prefab, Sprite, SpriteAtlas, UITransformComponent, Vec3, _decorator } from 'cc';
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
import { MapViewControl } from '../../scene/view/MapViewControl';
import { RoomEnterDaoBtnList } from '../../room/view/RoomEnterDaoBtnList';
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

    @property({ type: Node })
    moveSpeedBtn: Node = null!;

    @property({ type: EditBox })
    moveSpeedContent: EditBox = null!;

    @property(Prefab)
    prefabEnterDaoBtnListItem!: Prefab;

    @property({ type: Node })
    miniMapSprite: Node = null!;

    @property({ type: Node })
    playerOnMiniMap: Node = null!;

    @property({ type: SpriteAtlas })
    UIAtlas: SpriteAtlas = null!;

    @property({ type: Node })
    mapIntroductionLayer: Node = null!;

    @property({ type: Node })
    introductionOne: Node = null!;

    /** 控制的目标角色 */
    private target: Role = null!;
    public mvc = null;
    // public mvc = smc.scene.MapView.node.getComponent(MapViewControl);

    start() {
        this.displaySpeedValue();
        this.target = this.ent as Role;
        this.loadRoomList();
        this.initMiniMap();
    }

    displaySpeedValue() {
        this.moveSpeedContent.string = String(this.ent.get(RoleModelComp).speed);
    }

    updateSpeedValue() {
        var newSpeed = this.moveSpeedContent.string;
        this.ent.get(RoleModelComp).speed = Number(newSpeed);
    }

    initMiniMap() {
        this.mvc = smc.scene.MapView.node.getComponent(MapViewControl);
        var mapName = smc.room.RoomModel.roomName;
        this.miniMapSprite.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('mini' + mapName);
    }

    updatePlayerOnMiniMap() {
        var playerPos = this.mvc.getFollowPosition();
        var miniX = - playerPos.x * (this.miniMapSprite.getComponent(UITransformComponent).width / this.mvc.width);
        var miniY = - playerPos.y * (this.miniMapSprite.getComponent(UITransformComponent).height / this.mvc.height);
        this.playerOnMiniMap.setPosition(miniX, miniY, 0);
    }

    openChatWindow() {
        oops.gui.open(UIID.Demo_Chat);
    }

    showMapIntroduction() {
        if (this.mapIntroductionLayer.active) {
            this.mapIntroductionLayer.active = false;
        } else {
            this.mapIntroductionLayer.active = true;
        }
    }

    closeMapIntroduction() {
        this.mapIntroductionLayer.active = false;
    }

    showBuildingIntroduction() {
        if (this.introductionOne.active) {
            this.introductionOne.active = false;
        } else {
            this.introductionOne.active = true;
        }

    }

    /** 刷新房间列表 */
    async loadRoomList() {
        let ret = await smc.room.RoomModelNet.hc.callApi('RoomList', {});
        if (ret.isSucc) {
            try {
                for (let roomInfo of ret.res.rooms) {
                    let btnNode = instantiate(this.prefabEnterDaoBtnListItem);
                    let btnList = btnNode.getComponent(RoomReenterDaoBtnList);
                    btnList.initRoomInfo(roomInfo);
                    btnNode.parent = this.node.getChildByName('daoListLayer');
                }
            }
            catch (e) {
                console.log("登录界面已释放")
            }
        }
    }

    ringSomeone() {
        // smc.room.playerAttack();  这里获取玩家与目标对象传值
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

    update() {
        this.updatePlayerOnMiniMap();
    }

    reset(): void {

    }
}
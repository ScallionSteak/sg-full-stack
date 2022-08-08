/*
 * @Author: SS
 * @Date: 2022-06-27
 */

import { AudioSource, EditBox, EventTouch, instantiate, Label, Node, Prefab, v3, Vec3, _decorator } from 'cc';
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
import { RoleViewChannelItem } from './RoleViewChannelItem';
const { ccclass, property } = _decorator;

/** 角色摇撼控制 */
@ccclass("RoleViewChannelPopup")
@ecs.register('RoleViewChannelPopup', false)
export class RoleViewChannelPopup extends CCComp {

    @property({ type: EditBox })
    chatContent: EditBox = null!;
    @property({ type: Node })
    channelActiveRoomListGroup: Node = null!;
    @property({ type: Node })
    channelActiveRoomListContentLayer: Node = null!;
    @property({ type: Node })
    channelDetailsGroup: Node = null!;
    @property({ type: Node })
    channelDetailsContentLayer: Node = null!;
    @property({ type: Node })
    channelMyRoomListGroup: Node = null!;
    @property({ type: Node })
    channelMyRoomListContentLayer: Node = null!;
    @property({ type: Prefab })
    channelItem: Prefab = null!;
    @property({ type: Node })
    tagPanel: Node = null!;

    onLoad() {
        this.initData(smc.room.RoomModel.channelStatus);
    }

    initData(status: number) {
        switch (status) {
            case 1:
                this.channelActiveRoomListGroup.active = true;                
                break;
            case 2:
                this.channelMyRoomListGroup.active = true; 
                break;
            case 3:
                this.channelDetailsGroup.active = true;    
                break;
            default:
                break;
        }
        var dataArr = smc.room.RoomModel.channelInfoArr;
        var parentNodeArr = [];
        parentNodeArr.push(this.channelActiveRoomListContentLayer, this.channelDetailsContentLayer, this.channelMyRoomListContentLayer);
        for (var j = 0; j< parentNodeArr.length; j++) {
            var parentNode = parentNodeArr[j];
            for (var i = 0; i < dataArr.length; i++) {
                var node = instantiate(this.channelItem);
                node.getComponent(RoleViewChannelItem).initData(dataArr[i].name, dataArr[i].attendeeCount, dataArr[i].belongTo, dataArr[i].date);
                node.parent = parentNode;
            }
        }
    }

    closeSelf() {
        oops.gui.remove(UIID.Demo_channelPopup);
    }

    openCreateChannelDialog() {
        oops.gui.open(UIID.Demo_createChannel);
    }

    openChannelPopup() {
        oops.gui.open(UIID.Demo_channelPopup);
    }

    showTagPanel() {
        this.tagPanel.active = true;
    }

    closeTagPanel() {
        this.tagPanel.active = false;
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
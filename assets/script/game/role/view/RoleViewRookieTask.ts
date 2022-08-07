/*
 * @Author: SS
 * @Date: 2022-06-27
 */

import { AudioSource, EditBox, EventTouch, Label, Node, sys, tween, UIOpacity, v3, Vec3, WebView, _decorator } from 'cc';
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
import { DelegateComponent } from '../../../../../extensions/oops-framework/assets/core/gui/layer/DelegateComponent';
const { ccclass, property } = _decorator;

/** 角色摇撼控制 */
@ccclass("RoleViewRookieTask")
@ecs.register('RoleViewRookieTask', false)
export class RoleViewRookieTask extends CCComp {

    @property({ type: Node })
    taskDesc: Node = null!;
    
    private id = 0;
    private guildID = 0;

    onLoad() {
        this.id = this.node.getComponent(DelegateComponent).viewParams.params;
        if (smc.room.RoomModel.roomName == 'SeeDAORoom') {
            switch (this.id) {
                case 12:
                    this.guildID = 0;
                    break;
                case 15:
                    this.guildID = 1;
                    break;
                case 18:
                    this.guildID = 2;
                    break;
                case 20:
                    this.guildID = 3;
                    break;
                case 23:
                    this.guildID = 4;
                    break;
                case 26:
                    this.guildID = 5;
                    break;
                case 29:
                    this.guildID = 6;
                    break;
                default:
                    break;
            }
            this.taskDesc.getComponent(Label).string = smc.room.RoomModel.roomGuildGuideData.json[this.guildID].rookieTaskText;
        }
    }

    closeSelf() {
        this.node.active = false;
        smc.room.RoomModel.guildGuideStatus[this.guildID] = 5; //下次打开npc dialog时，应该显示领取新手任务
        var node = this.node.parent.parent.getChildByPath('LayerGame/spaceMap');
        var x = - smc.room.RoomModel.roomGuildGuideData.json[this.guildID].blackboardX;
        var y = - smc.room.RoomModel.roomGuildGuideData.json[this.guildID].blackboardY;
        var width = smc.room.RoomModel.roomGuildGuideData.json[this.guildID].blackboardWidth;
        var height = smc.room.RoomModel.roomGuildGuideData.json[this.guildID].blackboardHeight;
        var pos: Vec3 = v3(x, y);
        node.getComponent(MapViewControl).moveCameraForGuide(pos, width, height);
        setTimeout(()=>{
            oops.gui.remove(UIID.Demo_rookieTask);
        }, 3000);
        
    }

    reset(): void {

    }
}
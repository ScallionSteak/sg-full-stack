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

    onLoad() {
        this.id = this.node.getComponent(DelegateComponent).viewParams.params;
    }

    closeSelf() {
        oops.gui.remove(UIID.Demo_rookieTask);
        if (smc.room.RoomModel.roomName == 'SeeDAORoom') {
            switch (this.id) {
                case 12:
                    smc.room.RoomModel.guildGuideStatus[0] = 5; //下次打开npc dialog时，应该显示领取新手任务
                    this.taskDesc.getComponent(Label).string = smc.room.RoomModel.roomGuildGuideData.json[0].rookieTaskText;
                    break;
                case 15:
                    smc.room.RoomModel.guildGuideStatus[1] = 5; //下次打开npc dialog时，应该显示领取新手任务
                    this.taskDesc.getComponent(Label).string = smc.room.RoomModel.roomGuildGuideData.json[1].rookieTaskText;
                    break;
                case 18:
                    smc.room.RoomModel.guildGuideStatus[2] = 5; //下次打开npc dialog时，应该显示领取新手任务
                    this.taskDesc.getComponent(Label).string = smc.room.RoomModel.roomGuildGuideData.json[2].rookieTaskText;
                    break;
                case 20:
                    smc.room.RoomModel.guildGuideStatus[3] = 5; //下次打开npc dialog时，应该显示领取新手任务
                    this.taskDesc.getComponent(Label).string = smc.room.RoomModel.roomGuildGuideData.json[3].rookieTaskText;
                    break;
                case 23:
                    smc.room.RoomModel.guildGuideStatus[4] = 5; //下次打开npc dialog时，应该显示领取新手任务
                    this.taskDesc.getComponent(Label).string = smc.room.RoomModel.roomGuildGuideData.json[4].rookieTaskText;
                    break;
                case 26:
                    smc.room.RoomModel.guildGuideStatus[5] = 5; //下次打开npc dialog时，应该显示领取新手任务
                    this.taskDesc.getComponent(Label).string = smc.room.RoomModel.roomGuildGuideData.json[5].rookieTaskText;
                    break;
                case 29:
                    smc.room.RoomModel.guildGuideStatus[6] = 5; //下次打开npc dialog时，应该显示领取新手任务
                    this.taskDesc.getComponent(Label).string = smc.room.RoomModel.roomGuildGuideData.json[6].rookieTaskText;
                    break;
                default:
                    break;
            }
        }
    }

    reset(): void {

    }
}
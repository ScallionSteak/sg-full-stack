/*
 * @Author: SS
 * @Date: 2022-06-27
 */

import { AudioSource, EditBox, EventTouch, instantiate, Label, Node, Prefab, Sprite, SpriteAtlas, v3, Vec3, _decorator } from 'cc';
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
import { RoleViewBountyDetails } from './RoleViewBountyDetails';
import { RoleViewd2dDetails } from './RoleViewd2dDetails';
const { ccclass, property } = _decorator;

/** 角色摇撼控制 */
@ccclass("RoleViewBigTowerItem")
@ecs.register('RoleViewBigTowerItem', false)
export class RoleViewBigTowerItem extends CCComp {

    @property({ type: Node })
    title: Node = null!;
    @property({ type: Node })
    roomNumber: Node = null!;
    @property({ type: Node })
    date: Node = null!;
    @property({ type: Node })
    speakerName: Node = null!;
    @property({ type: Node })
    joinBtn: Node = null!;
    @property({ type: Node })
    btnName: Node = null!;
    @property({ type: SpriteAtlas})
    UIAtlas: SpriteAtlas = null!;

    initData(meetingInfo) {
        this.title.getComponent(Label).string = meetingInfo.title;
        this.roomNumber.getComponent(Label).string = meetingInfo.roomNumber;
        this.date.getComponent(Label).string = meetingInfo.date;
        this.speakerName.getComponent(Label).string = meetingInfo.speakerName;
        switch (meetingInfo.status) {
            case '1':
                this.joinBtn.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('main/greenBtn');
                this.btnName.getComponent(Label).string = 'Join';
                break;
            case '2':
                this.joinBtn.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('main/importantBtn');
                this.btnName.getComponent(Label).string = 'Book';
                break;
            case '3':
                this.joinBtn.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('main/28264FRectNoShadow');
                this.btnName.getComponent(Label).string = 'Booked';
                break;
            default:
                break;
        }
    }

    reset(): void {

    }
}
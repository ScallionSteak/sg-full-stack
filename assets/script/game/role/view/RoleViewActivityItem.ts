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
@ccclass("RoleViewActivityItem")
@ecs.register('RoleViewActivityItem', false)
export class RoleViewActivityItem extends CCComp {

    @property({ type: Node })
    title: Node = null!;
    @property({ type: Node })
    time: Node = null!;
    @property({ type: Node })
    place: Node = null!;

    initData(activityInfo) {
        this.title.getComponent(Label).string = activityInfo.title;
        this.time.getComponent(Label).string = activityInfo.time;
        this.place.getComponent(Label).string = activityInfo.place;
    }

    reset(): void {

    }
}
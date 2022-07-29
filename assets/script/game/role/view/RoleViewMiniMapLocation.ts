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
import { RoleViewMiniMapIntroduction } from './RoleViewMiniMapIntroduction';
const { ccclass, property } = _decorator;

/** 角色摇撼控制 */
@ccclass("RoleViewMiniMapLocation")
@ecs.register('RoleViewMiniMapLocation', false)
export class RoleViewMiniMapLocation extends CCComp {

    @property({ type: Node })
    locationSprite: Node = null!;
    @property({ type: Node })
    locationName: Node = null!;
    @property({ type: Node })
    locationNameBg: Node = null!;
    @property({ type: SpriteAtlas })
    UIAtlas: SpriteAtlas = null!;

    private locationID: number;

    initLocation(name: string, type: string, id: number) {
        this.locationID = id;
        this.locationName.getComponent(Label).string = name;
        if (type == 'big') {
            this.locationSprite.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('main/bigLocationMark');
        } else if (type == 'small') {
            this.locationSprite.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('main/smallLocationMark');
            this.locationNameBg.active = false;
        }
    }

    showIntroduction() {
        this.node.parent.parent.parent.getComponent(RoleViewMiniMapIntroduction).showIntroduction(this.locationID);
    }

    reset(): void {

    }
}
/*
 * @Author: SS
 * @Date: 2022-06-27
 */

import { AudioSource, EditBox, EventTouch, Label, Node, Sprite, SpriteAtlas, Toggle, UITransform, v3, Vec3, _decorator } from 'cc';
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
        this.locationSprite.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('main/smallLocationMark');
        this.locationNameBg.getComponent(UITransform).width = this.locationName.getComponent(UITransform).width;
        if (this.node.getComponent(Toggle).isChecked) {
            this.locationSprite.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('main/bigLocationMark');    
        }
    }

    showIntroduction() {
        this.node.parent.parent.parent.getComponent(RoleViewMiniMapIntroduction).showIntroduction(this.locationID);
    }

    onLocationCheck() {
        //把自己的标签设成大标签
        this.locationNameBg.active = true;
        this.locationSprite.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('main/bigLocationMark');
        this.locationName.getComponent(Label).fontSize = 16;
        this.locationNameBg.getComponent(UITransform).width = this.locationName.getComponent(UITransform).width;
        //把之前选中的那个标签恢复成小标签
        for (var i = 0; i < this.node.parent.children.length; i++) {
            if (!this.node.parent.children[i].getComponent(Toggle).isChecked) {
                this.node.parent.children[i].getComponent(RoleViewMiniMapLocation).resetToUncheck();
            }
        }
    }

    resetToUncheck() {
        this.locationNameBg.active = false;
        this.locationSprite.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('main/smallLocationMark');
        this.locationName.getComponent(Label).fontSize = 12;
        this.locationNameBg.getComponent(UITransform).width = this.locationName.getComponent(UITransform).width;
    }

    reset(): void {

    }
}
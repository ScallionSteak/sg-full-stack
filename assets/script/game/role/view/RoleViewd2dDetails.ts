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
const { ccclass, property } = _decorator;

/** 角色摇撼控制 */
@ccclass("RoleViewd2dDetails")
@ecs.register('RoleViewd2dDetails', false)
export class RoleViewd2dDetails extends CCComp {

    @property({ type: Node })
    title: Node = null!;
    @property({ type: Node })
    publishDate: Node = null!;
    @property({ type: Node })
    endDate: Node = null!;
    @property({ type: Node })
    desc: Node = null!;
    @property({ type: Node })
    pic1: Node = null!;
    @property({ type: Node })
    pic2: Node = null!;
    @property({ type: Node })
    contactPortrait: Node = null!;
    @property({ type: Node })
    contactName: Node = null!;
    @property({ type: Node })
    contactDao: Node = null!;

    @property({ type: SpriteAtlas})
    UIAtlas: SpriteAtlas = null!;

    initData(d2dInfo: any) {
        this.title.getComponent(Label).string = d2dInfo.title;
        this.publishDate.getComponent(Label).string = d2dInfo.publishDate;
        this.endDate.getComponent(Label).string = d2dInfo.endDate;
        this.desc.getComponent(Label).string = d2dInfo.desc;
        if(d2dInfo.pic1){
            this.pic1.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('main/' + d2dInfo.pic1);
        }
        if (d2dInfo.pic2) {
            this.pic2.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('main/' + d2dInfo.pic2);
        }
        if (d2dInfo.contactPortrait) {
            this.contactPortrait.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('main/' + d2dInfo.contactPortrait);
        }
        this.contactName.getComponent(Label).string = d2dInfo.contactName;
        this.contactDao.getComponent(Label).string = d2dInfo.contactDao;
    }

    closeSelf() {
        this.node.destroy();
    }

    reset(): void {

    }
}
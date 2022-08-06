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
@ccclass("RoleViewd2dItem")
@ecs.register('RoleViewd2dItem', false)
export class RoleViewd2dItem extends CCComp {

    @property({ type: Prefab })
    d2dDetailsPrefab: Prefab = null!;
    @property({ type: Node })
    d2dTitle: Node = null!;
    @property({ type: Node })
    d2dPic1: Node = null!;
    @property({ type: Node })
    d2dPic2: Node = null!;
    @property({ type: Node })
    d2dContactPortrait: Node = null!;
    @property({ type: Node })
    d2dDate: Node = null!;
    @property({ type: SpriteAtlas})
    UIAtlas: SpriteAtlas = null!;

    private d2dInfo;
    initData(d2dListItem: any) {
        this.d2dInfo = d2dListItem;
        this.d2dTitle.getComponent(Label).string = String(d2dListItem.title).substring(0, 12) + '...';
        if(d2dListItem.pic1){
            this.d2dPic1.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('main/' + d2dListItem.pic1);
        }
        if (d2dListItem.pic2) {
            this.d2dPic2.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('main/' + d2dListItem.pic2);
        }
        if (d2dListItem.contactPortrait) {
            this.d2dContactPortrait.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('main/' + d2dListItem.contactPortrait);
        }
        var publishDate: string = d2dListItem.publishDate;
        var gapDays = this.cycleDate(publishDate);
        this.d2dDate.getComponent(Label).string = gapDays;
    }

    showDetails() {
        var node = instantiate(this.d2dDetailsPrefab);
        node.parent = this.node.parent.parent.parent.parent;
        node.getComponent(RoleViewd2dDetails).initData(this.d2dInfo);
    }

    cycleDate(oldeDate: string) {
        // time为时间戳
        let times = new Date(oldeDate).getTime();
        let delta = (new Date().getTime() - times) / 1000;
        // return `${Number(delta / (60 * 60 * 24 * 365))}年前`;
        // return `${Number(delta / (60 * 60 * 24 * 30))}个月前`;
        // return `${Number(delta / (60 * 60 * 24 * 7))}个星期前`;
        return `${Math.trunc(Number(delta / (60 * 60 * 24)))}`;
        // return `${Number(delta / (60 * 60))}个小时前`;
        //return `${Number(delta / 60)}分钟前`;
    }

    reset(): void {

    }
}
/*
 * @Author: SS
 * @Date: 2022-06-27
 */

import { AudioSource, EditBox, EventTouch, instantiate, Label, Layout, Node, Prefab, UITransformComponent, v3, Vec3, _decorator } from 'cc';
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
import { HttpRequestForDS } from '../../../../../extensions/oops-framework/assets/core/network/http';
import { RoleViewBountyListItem } from './RoleViewBountyListItem';
import { RoleViewd2dItem } from './RoleViewd2dItem';
import { RoleViewBigTowerItem } from './RoleViewBigTowerItem';
import { RoleViewActivityItem } from './RoleViewActivityItem';
const { ccclass, property } = _decorator;

/** 角色摇撼控制 */
@ccclass("RoleViewActivityBoard")
@ecs.register('RoleViewActivityBoard', false)
export class RoleViewActivityBoard extends CCComp {

    @property({ type: Node })
    activityItemListLayer: Node = null!;
    @property({ type: Prefab })
    activityItemPrefab: Prefab = null!;

    private activityItemData: {title: string, time: string, place: string}[] = [
        {
            title: '产品周会',
            time: '20:00-21:00',
            place: 'B会议室'
        },
        {
            title: 'SG周会',
            time: '22:00-24:00',
            place: 'F会议室'
        },
        {
            title: '《冬冬的假日》电影放映',
            time: '20:00-23:30',
            place: '电影院'
        },
        {
            title: '艺术X产品X开发共创会',
            time: '20:30-21:30',
            place: 'A会议室'
        },
        {
            title: '正念冥想课程',
            time: '22:00-23:00',
            place: '冥想区'
        }
    ];
    private listHeight;

    onLoad() {
        this.initList();
    }

    initList() {
        for (var i = 0; i < this.activityItemData.length; i++) {
            var node = instantiate(this.activityItemPrefab);
            node.parent = this.activityItemListLayer;
            node.getComponent(RoleViewActivityItem).initData(this.activityItemData[i]);
            this.listHeight = node.getComponent(UITransformComponent).height + this.activityItemListLayer.getComponent(Layout).spacingY;
        }
        this.activityItemListLayer.getComponent(UITransformComponent).setContentSize(this.activityItemListLayer.getComponent(UITransformComponent).width, this.listHeight * this.activityItemData.length);
    }

    closeSelf() {
        oops.gui.remove(UIID.Demo_activityBoard);
    }

    reset(): void {

    }
}
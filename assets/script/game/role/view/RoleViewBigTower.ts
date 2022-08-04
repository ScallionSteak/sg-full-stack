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
const { ccclass, property } = _decorator;

/** 角色摇撼控制 */
@ccclass("RoleViewBigTower")
    @ecs.register('RoleViewBigTower', false)
export class RoleViewBigTower extends CCComp {

    @property({ type: Node })
    towerItemListLayer: Node = null!;
    @property({ type: Prefab })
    towerItemPrefab: Prefab = null!;

    private towerItemData: {title: string, roomNumber: string, date: string, speakerName: string, status: string}[] = [
        {
            title: 'Web3创造者经济和学习导航',
            roomNumber: '6-1',
            date: '18:00-20:00 on August 8th',
            speakerName: 'baiyu',
            status: '1'
        },
        {
            title: '用光谱串起互动式内容创作从web2到web3',
            roomNumber: '2-2',
            date: '18:00-20:00 on August 12th',
            speakerName: 'Ricky',
            status: '2'
        },
        {
            title: '展览史与新媒体策展',
            roomNumber: '1-2',
            date: '20:00-22:00 on August 14th',
            speakerName: 'Tanghan',
            status: '2'
        },
        {
            title: '真正的web3离我们有多远？',
            roomNumber: '3-1',
            date: '20:00-22:00 on August 16th',
            speakerName: 'Rebecca',
            status: '3'
        }
    ];
    private listHeight;

    onLoad() {
        this.initList();
    }

    initList() {
        for (var i = 0; i < this.towerItemData.length; i++) {
            var node = instantiate(this.towerItemPrefab);
            node.parent = this.towerItemListLayer;
            node.getComponent(RoleViewBigTowerItem).initData(this.towerItemData[i]);
            this.listHeight = node.getComponent(UITransformComponent).height + this.towerItemListLayer.getComponent(Layout).spacingY;
        }
        this.towerItemListLayer.getComponent(UITransformComponent).setContentSize(this.towerItemListLayer.getComponent(UITransformComponent).width, this.listHeight * Math.trunc(1 + this.towerItemData.length / 2));
    }

    closeSelf() {
        oops.gui.remove(UIID.Demo_bigTower);
    }

    reset(): void {

    }
}
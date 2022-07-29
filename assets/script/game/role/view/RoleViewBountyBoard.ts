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
const { ccclass, property } = _decorator;

/** 角色摇撼控制 */
@ccclass("RoleViewBountyBoard")
@ecs.register('RoleViewBountyBoard', false)
export class RoleViewBountyBoard extends CCComp {

    @property({ type: Node })
    bountyListLayer: Node = null!;
    @property({ type: Prefab })
    bountyListItemPrefab: Prefab = null!;

    private bountyListData;
    private listHeight;

    onLoad() {
        this.initBountyList();
    }

    initBountyList() {
        this.bountyListLayer.destroyAllChildren();
        setTimeout(() => {
            var jsonfile = { bountyStatus: '0' };
            var _http = new HttpRequestForDS();
            var url = '/queryBountiesByBountyStatus';
            _http.postJSON(url, jsonfile, (res) => {
                this.bountyListData = JSON.parse(res);
                console.log("check bounty list -------", this.bountyListData);
                for (var i = 0; i < this.bountyListData.length; i++) {
                    var node = instantiate(this.bountyListItemPrefab);
                    node.parent = this.bountyListLayer;
                    node.getComponent(RoleViewBountyListItem).initData(this.bountyListData[i]);
                    this.listHeight = node.getComponent(UITransformComponent).height + this.bountyListLayer.getComponent(Layout).spacingY;
                }
                this.bountyListLayer.getComponent(UITransformComponent).setContentSize(this.bountyListLayer.getComponent(UITransformComponent).width, this.listHeight * this.bountyListData.length);
            });
        }, 100);
    }

    closeSelf() {
        oops.gui.remove(UIID.Demo_bountyBoard);
    }

    reset(): void {

    }
}
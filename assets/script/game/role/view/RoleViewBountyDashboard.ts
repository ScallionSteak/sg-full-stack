/*
 * @Author: SS
 * @Date: 2022-06-27
 */

import { AudioSource, EditBox, EventTouch, instantiate, Label, Node, Prefab, v3, Vec3, _decorator } from 'cc';
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
import { RoleViewMyBountyItem } from './RoleViewMyBountyItem';
const { ccclass, property } = _decorator;

/** 角色摇撼控制 */
@ccclass("RoleViewBountyDashboard")
@ecs.register('RoleViewBountyDashboard', false)
export class RoleViewBountyDashboard extends CCComp {

    @property({ type: Node })
    inProgressContent: Node = null!;
    @property({ type: Node })
    inReviewContent: Node = null!;
    @property({ type: Node })
    doneContent: Node = null!;
    @property({ type: Node })
    inProgressCount: Node = null!;
    @property({ type: Node })
    inReviewCount: Node = null!;
    @property({ type: Node })
    doneCount: Node = null!;
    @property({ type: Prefab })
    myBountyItemPrefab: Prefab = null!;

    onLoad() {
        this.initBountyList();
    }

    initBountyList() {
        this.inProgressContent.destroyAllChildren();
        this.inReviewContent.destroyAllChildren();
        this.doneContent.destroyAllChildren();

        /** 等一帧destroy */
        setTimeout(() => {
            var jsonfile = { userID: smc.room.RoomModel.owner.RoleModel.userDBID };
            var _http = new HttpRequestForDS();
            var url = '/queryPersonalBounties';
            _http.postJSON(url, jsonfile, (res) => {
                var bounties = JSON.parse(res);
                console.log("bounties -------", bounties);
                for (var i = 0; i < bounties.length; i++) {
                    var node = instantiate(this.myBountyItemPrefab);
                    node.getComponent(RoleViewMyBountyItem).initData(bounties[i]);
                    switch (bounties[i].bountyStatus) {
                        case 1:
                            node.parent = this.inProgressContent;
                            break;
                        case 2:
                            node.parent = this.inReviewContent;
                            break;
                        case 3:
                        case 4:
                            node.parent = this.doneContent;
                            break;
                        default:
                            break;
                    }
                }
                this.inProgressCount.getComponent(Label).string = String(this.inProgressContent.children.length);
                this.inReviewCount.getComponent(Label).string = String(this.inReviewContent.children.length);
                this.doneCount.getComponent(Label).string = String(this.doneContent.children.length);
            });
        }, 100);
    }

    closeSelf() {
        oops.gui.remove(UIID.Demo_bountyDashboard);
    }

    reset(): void {

    }
}
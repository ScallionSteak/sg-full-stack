/*
 * @Author: SS
 * @Date: 2022-06-27
 */

import { AudioSource, EditBox, EventTouch, Label, Layout, Node, UITransform, UITransformComponent, v3, Vec3, _decorator } from 'cc';
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
import { RoleViewBountyBoard } from './RoleViewBountyBoard';
import { RoleViewBountyDashboard } from './RoleViewBountyDashboard';
const { ccclass, property } = _decorator;

/** 角色摇撼控制 */
@ccclass("RoleViewBountyDetails")
@ecs.register('RoleViewBountyDetails', false)
export class RoleViewBountyDetails extends CCComp {

    @property({ type: Node })
    bountyName: Node = null!;
    @property({ type: Node })
    bountyDesc: Node = null!;
    @property({ type: Node })
    bountyCreator: Node = null!;
    @property({ type: Node })
    bountyPrice: Node = null!;
    @property({ type: Node })
    bountyContact: Node = null!;
    @property({ type: Node })
    bountyStatus: Node = null!;
    @property({ type: Node })
    bountyAssigneeID: Node = null!;
    @property({ type: Node })
    nextBtnText: Node = null!;
    @property({ type: Node })
    descGroupContent: Node = null!;
    @property({ type: Node })
    inPublicSpace: Node = null!;

    /** 不同状态的status文字以及对应的按钮文字，为了省时间，写的有点粗暴，就先酱吧，hhhhh */
    public bountyStatusArr = ['TO DO', 'In Process', 'In Review', 'Done', 'Done'];
    public btnTextArr = ['I am interested', 'Submit Work', 'Approve', 'Pay', 'Paid'];
    
    /** 两个入口，要刷新那边的显示 */
    public bountyDashBoard;
    public bountyBoard;

    private bountyInfo;
    initDetailsData(bountyInfo: any) {
        if(smc.room.RoomModel.roomName != 'PublicSpaceRoom') {
            this.inPublicSpace.active = true;
        }
        this.bountyInfo = bountyInfo;
        this.bountyName.getComponent(Label).string = bountyInfo.bountyName;
        this.bountyDesc.getComponent(Label).string = bountyInfo.bountyDesc;
        this.bountyCreator.getComponent(Label).string = bountyInfo.bountyCreator;
        this.bountyPrice.getComponent(Label).string = bountyInfo.bountyPrice;
        this.bountyContact.getComponent(Label).string = bountyInfo.bountyContact;
        this.bountyStatus.getComponent(Label).string = this.bountyStatusArr[bountyInfo.bountyStatus];
        this.nextBtnText.getComponent(Label).string = this.btnTextArr[bountyInfo.bountyStatus];

        if (bountyInfo.bountyAssigneeID == 0) {
            //等于是还没分配，那就直接给默认值
            this.bountyAssigneeID.getComponent(Label).string = 'Nobody';
        } else {
            let jsonfile = { userID: bountyInfo.bountyAssigneeID };
            var _http = new HttpRequestForDS();
            var url = '/queryUserName';
            _http.postJSON(url, jsonfile, (res) => {
                var jsonres = JSON.parse(res);
                this.bountyAssigneeID.getComponent(Label).string = jsonres[0].username;
            });
        }
        /** 下面这句是为了等bountyDesc改完它自己的height，它应该是需要一帧的时间 */
        setTimeout(() => {
            this.descGroupContent.getComponent(UITransformComponent).setContentSize(this.descGroupContent.getComponent(UITransformComponent).width, this.bountyDesc.getComponent(UITransformComponent).height);
        }, 100);

    }

    nextBtnCallback() {
        var nextStatusID = Number(this.bountyInfo.bountyStatus) + 1;
        var jsonfile = { bountyID: this.bountyInfo.ID, nextStatusID: nextStatusID, userID: smc.room.RoomModel.owner.RoleModel.userDBID };
        console.log("jsonfile", jsonfile);
        var _http = new HttpRequestForDS();
        var url = '/updateBountyStatus';
        _http.postJSON(url, jsonfile, (res) => {
            if (this.bountyInfo.bountyStatus == 0) {
                //说明是从bounty board点进来的，这个时候不可以在这里进一步操作，要去自己的dashboard里操作，所以这里要把界面关掉
                this.closeSelf();
            } else {
                if(nextStatusID == 5) {
                    //mvp阶段的强制重置任务的做法，服务端也写了，照理说应该都在服务端处理好，但是服务端那边不熟，就分开写了，以后记得要同时改掉
                    this.bountyStatus.getComponent(Label).string = this.bountyStatusArr[0];
                    this.nextBtnText.getComponent(Label).string = this.btnTextArr[0];
                    this.closeSelf(); //为了不要连续点下去，会出错的
                } else {
                    this.bountyStatus.getComponent(Label).string = this.bountyStatusArr[nextStatusID];
                    this.nextBtnText.getComponent(Label).string = this.btnTextArr[nextStatusID];
                }
            }
            this.bountyInfo.bountyStatus = String(Number(this.bountyInfo.bountyStatus) + 1);
            if(oops.gui.has(UIID.Demo_bountyBoard)) {
                this.bountyBoard = this.node.parent.parent;
                this.bountyBoard.getComponent(RoleViewBountyBoard).initBountyList();
            }
            if(oops.gui.has(UIID.Demo_bountyDashboard)) {
                this.bountyDashBoard = this.node.parent.parent.parent;
                this.bountyDashBoard.getComponent(RoleViewBountyDashboard).initBountyList();
            }
        });
    }

    closeSelf() {
        this.node.destroy();
    }

    reset(): void {

    }
}
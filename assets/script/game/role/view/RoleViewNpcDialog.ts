/*
 * @Author: SS
 * @Date: 2022-06-27
 */

import { AudioSource, EditBox, EventTouch, instantiate, Label, Node, Prefab, SpriteAtlas, v3, Vec3, _decorator } from 'cc';
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
import { RoomReenterDaoBtnList } from '../../room/view/RoomReenterDaoBtnList';
const { ccclass, property } = _decorator;

/** 角色摇撼控制 */
@ccclass("RoleViewNpcDialog")
@ecs.register('RoleViewNpcDialog', false)
export class RoleViewNpcDialog extends CCComp {

    @property({ type: Node })
    npcModel: Node = null!;
    @property({ type: Node })
    npcNickname: Node = null!;
    @property({ type: Node })
    dialogContent: Node = null!;
    @property({ type: Node })
    curPage: Node = null!;
    @property({ type: Node })
    totalPage: Node = null!;
    @property({ type: Node })
    confirmWin: Node = null!;
    @property({ type: Node })
    nextBtn: Node = null!;
    @property({ type: Node })
    previousBtn: Node = null!;
    @property({ type: Node })
    letsGoBtn: Node = null!;
    @property({ type: Node })
    showDaoListBtn: Node = null!;
    @property({ type: Node })
    daoListLayer: Node = null!;
    @property({ type: Node })
    dialogContentLayer: Node = null!;
    @property({ type: Prefab })
    prefabEnterDaoBtnListItem: Prefab = null!;
    @property({ type: Node })
    daosGroup: Node = null!;
    @property({ type: SpriteAtlas })
    UIAtlas: SpriteAtlas = null!;

    private publicSpaceGuideContent: string[] = [
        "Hello , Welcome to SG ~ If you are interested in Web3 but don't know how to start, if you are from DAO but lack of resources, if you are an idealist but don't know how to get started. Congratulations! You can explore DAO in SG. In fact, I would give you a special gift when you finish the tutorial. So, is there a DAO you want to enter?",
        "Welcome to the Bounty Board\r\nLet's start with the Bounty Board. This is the busiest place in SG, where any DAOs can post corresponding tasks to members.",
        "Welcome to the DaoGarden\r\nThe whole DAO garden is a small forest, and every small tree is a peaceful DAO. You can view all the stories and information here~ You can also enter the DAO space that interests you here.",
        "Welcome to the D2D Square\r\nThere is D2D Square here. If you want to ask other DAOs for help, or if you want to reach some kind of cooperation, the cooperation column is a surprise.",
        "Welcome to the Big Tower\r\nThe Big Tower is the most lively place, and everyone has interesting activities and serious meetings at the clock tower. Those who want to chat with people are also welcome.",
        "Welcome to the Projects Park\r\nHere is a propaganda project solved in dao in SG. You can find projects that you are interested in and want to participate in, or find corresponding collaborators~",
        "Welcome to the DAOEX\r\nThis is DAO EX, where you can trade all the NFTs, tokens, etc. you want to trade. Accidentally hit by a meteorite, still under renovation...",
        "Welcome to the Support Center\r\nIf you have any questions, please contact us here. A mysterious person passing by will answer your questions here~",
        "Congratulations! You have completed the whole tutorial. Welcome to SG. Let's explore Web3 together!"
    ];

    private seeDaoGuideContent: string[] = [
        "i",
        "ii",
        "iii"
    ];
    private curSpaceGuideContent: string[] = [];
    private curDao = '';
    private curPageNum = 1;

    onLoad() {
        //要在外面就判断，是否要打开这个窗口，这个窗口只要打开了那即是引导没结束
        var roomName = smc.room.RoomModel.roomName;
        this.initDialog(roomName);
        this.npcNickname.getComponent(Label).string = '55';
    }

    initDialog(roomName: string) {
        this.curDao = roomName;
        if (roomName == 'PublicSpaceRoom') {
            this.curSpaceGuideContent = this.publicSpaceGuideContent;
            this.nextBtn.active = false;
            this.letsGoBtn.active = true;
            this.showDaoListBtn.active = true;
        } else if (roomName == 'SeeDAORoom') {
            this.curSpaceGuideContent = this.seeDaoGuideContent;
        }
        this.dialogContent.getComponent(Label).string = this.curSpaceGuideContent[0];
        this.previousBtn.active = false;
        this.totalPage.getComponent(Label).string = String(this.curSpaceGuideContent.length);
    }

    showDaoList() {
        this.daoListLayer.active = true;
        this.dialogContentLayer.active = false;
        this.loadRoomList();
    }

    /** 刷新房间列表 */
    async loadRoomList() {
        let ret = await smc.room.RoomModelNet.hc.callApi('RoomList', {});
        if (ret.isSucc) {
            try {
                for (let roomInfo of ret.res.rooms) {
                    let btnNode = instantiate(this.prefabEnterDaoBtnListItem);
                    let btnList = btnNode.getComponent(RoomReenterDaoBtnList);
                    btnList.initRoomInfo(roomInfo);
                    btnNode.parent = this.daosGroup;
                }
            }
            catch (e) {
                console.log("登录界面已释放")
            }
        }
    }

    backToDialogContent() {
        this.daoListLayer.active = false;
        this.dialogContentLayer.active = true;
        this.daosGroup.removeAllChildren();
    }

    nextPage() {
        console.log(this.curPageNum);
        if (this.curPageNum == this.curSpaceGuideContent.length) {
            this.endGuide();
            oops.gui.remove(UIID.Demo_npcDialog);
        } else {
            this.curPageNum += 1;
            this.updatePageNum();
            this.dialogContent.getComponent(Label).string = this.curSpaceGuideContent[this.curPageNum-1];
            this.previousBtn.active = true;
            this.nextBtn.active = true;
            this.letsGoBtn.active = false;
            this.showDaoListBtn.active = false;
        }
    }

    previousPage() {
        this.curPageNum -= 1;
        this.updatePageNum();
        this.dialogContent.getComponent(Label).string = this.curSpaceGuideContent[this.curPageNum-1];
        if (this.curPageNum > 1) {
            this.previousBtn.active = true;
        } else {
            var roomName = smc.room.RoomModel.roomName;
            if (roomName == 'PublicSpaceRoom') {
                this.nextBtn.active = false;
                this.letsGoBtn.active = true;
                this.showDaoListBtn.active = true;
            }
            this.previousBtn.active = false;
        }
    }

    updatePageNum() {
        this.curPage.getComponent(Label).string = String(this.curPageNum);
    }

    closeSelf() {
        this.confirmWin.active = true;
    }

    confirmClose() {
        oops.gui.remove(UIID.Demo_npcDialog);
    }

    confirmNotClose() {
        this.confirmWin.active = false;
    }

    endGuide() {
        //向数据库存完成的标志
        var sgGuideStatus = '';
        var seeDaoGuideStatus = '';
        if (this.curDao == 'PublicSpaceRoom') {
            //公区
            sgGuideStatus = '1';
        } else if (this.curDao == 'SeeDAORoom') {
            //seedao
            seeDaoGuideStatus = '1';
        }
        var guidStatusJSON = { walletAddress: localStorage.getItem('walletAddress'), sgGuideStatus: sgGuideStatus, seeDaoGuideStatus: seeDaoGuideStatus };
        var _http = new HttpRequestForDS();
        var url = '/updateUserConfig';
        _http.postJSON(url, guidStatusJSON, (res) => {
            console.log("status updated", res);
        });
    }

    reset(): void {

    }
}
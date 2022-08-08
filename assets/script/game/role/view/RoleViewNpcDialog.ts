/*
 * @Author: SS
 * @Date: 2022-06-27
 */

import { AudioSource, EditBox, EventTouch, instantiate, Label, Node, Prefab, Sprite, SpriteAtlas, UITransform, v3, Vec3, _decorator } from 'cc';
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
import { DelegateComponent } from '../../../../../extensions/oops-framework/assets/core/gui/layer/DelegateComponent';
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
    @property({ type: Node })
    applyBtn: Node = null!;
    @property({ type: Node })
    checkFileBtn: Node = null!;
    @property({ type: Node })
    guildGuideOkBtn: Node = null!;
    @property({ type: Node })
    welcomeTitle: Node = null!;
    @property({ type: Node })
    rookieTaskBadgeGroup: Node = null!;

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
        "欢迎你来到SeeDAO！下面让我带你逛一下吧~跟我一起熟悉一下我们的大家庭",
        "Seedao展示馆\r\n截至目前，SeeDAO已有十个公会。社区成员接近8000人，实质贡献者超过了/600名。此外，SeeDAO已经完成了估值3000万美金的A轮融资，投资人包括HashKey Capital、HashGlobal、Nervos、Tess Venture、MaskNetwork、ChainIDE、火凤资本。这里陈列了关于seedao的历史资料和档案，你可以在这里查阅一切关于seedao的故事~",
        "风云榜\r\n社区的核心贡献者名单都显示在这里哦（期待你的上榜！）",
        "活动日历\r\n你可以在这里查看社区最近正在举办活动，积极参加活动是最快融入社区的最佳方式之一！",
        "提案板\r\n我们鼓励社区成员积极参与社区内容生态的共建，并乐于提供多方面的资源支持！你可以对上面已经显示的提案进行留言讨论；如果你已有一个非常完整的项目想法，且已经有一个小团队可以协调推进，你可以直接在此区域简述项目想法！",
        "项目看板\r\n你可以在这里查看到社区正在创造的项目以及相关详情，看到感兴趣的项目就赶紧加入一起做项目的builder吧！",
        "赏金任务\r\n这里会展示seedao社区和各公会的赏金任务，当你成为公会成员，就可以解锁这里的权限，赚取自己的第一桶金！(记得先去on boarding获取公会成员身份哦)",
        "Web3大学\r\n在Web3建设一座没有围墙的大学。让行业先驱决定方向，让学者决定方式，让学生决定课程。让“链上学术共同体”在这里发生。",
        "Web3图书馆\r\n以 Web3 形式建立 Web3 领域的图书馆，汇聚全球 Web3 世界各主题的文章、论文、视频等，编写摘要和标签，分类收录，做知识的策展，让所有人更高效地学习。并同期将所有内容译成中文，使中文世界能更便捷地获取 Web3 世界的知识。Web3 图书馆是由 SeeDAO 孵化，完全开源的知识共享平台，欢迎其他团队和 DAO 来创建自己感兴趣的主题，共建图书馆。",
        "公会办公区\r\n公会办公区是SeeDao公会的驻地，是公会成员的聚集地。目前SeeDAO有翻译、宣传、治理、设计、艺术、建筑、产品、开发、投研、NFT Club十个公会，每个公会拥有独立的土地和建筑，让更多的创意和协作发生在这里！",
        "会议区\r\n公会和社区的大小会议会在这里举行，每晚8点蹲守周会，有事没事欢迎参加~",
        "娱乐区\r\n这里有游戏室、音乐台和电影院供成员一起玩耍！对！就是这里party！party！",
        "冥想区\r\n进入冥想区，你将进入空灵状态，失去与外界的一切联系，接收不到社区任何消息提醒，直到你走出冥想区。",
        "小黑屋\r\n在社区有恶性互动的成员会被关进小黑屋，坐牢！无法与他人交流，失去所有交互行为的权限！",
        "好了，现在你对我们已经有了一定的了解了，就请开始你在SeeDAO的探索吧！"
    ];

    private publicSpaceGuideCameraData: { x: number, y: number, width: number, height: number }[] = [
        { x: 0, y: 0, width: 0, height: 0 },
        { x: -482, y: -1960, width: 135, height: 180 },
        { x: -908, y: -1733, width: 400, height: 675 },
        { x: -150, y: -1572, width: 515, height: 480 },
        { x: -158, y: -648, width: 800, height: 435 },
        { x: 618, y: -1670, width: 390, height: 535 },
        { x: 700, y: -2225, width: 207, height: 250 },
        { x: 318, y: -2214, width: 155, height: 220 }
    ];
    private seeDaoGuideCameraData: { x: number, y: number, width: number, height: number }[] = [
        { x: 0, y: 0, width: 0, height: 0 },
        { x: -160, y: -1340, width: 715, height: 590},
        { x: -1130, y: -1330, width: 330, height: 350 },
        { x: -770, y: -1510, width: 350, height: 255 },
        { x: -1195, y: -1680, width: 350, height: 295 },
        { x: -1515, y: -1155, width: 340, height: 370 },
        { x: -760, y: -1150, width: 360, height: 360 },
        { x: 500, y: -1300, width: 610, height: 520 },
        { x: -1900, y: -1520, width: 290, height: 290 },
        { x: 400, y: -780, width: 1080, height: 380 },
        { x: -400, y: 900, width: 720, height: 600 },
        { x: 530, y: 770, width: 760, height: 470 },
        { x: -2290, y: -920, width: 750, height: 580 },
        { x: 2540, y: -2050, width: 810, height: 600 }
    ];
    private curSpaceCameraData: { x: number, y: number, width: number, height: number }[] = [];
    private curSpaceGuideContent: string[] = [];
    private curDao = '';
    private curPageNum = 1;
    private seeDaoGuildGuideData: any;
    private guildID = 0;
    private isCheckFileDone = false;
    private cameraMoved = false;

    onLoad() {
        var roomName = smc.room.RoomModel.roomName;
        this.seeDaoGuildGuideData = smc.room.RoomModel.roomGuildGuideData;
        this.guildID = this.node.getComponent(DelegateComponent).viewParams.params - 1; //传0会认为是object，不懂为什么，那就这里-1匹配数组下标
        this.initDialog(roomName);
        this.initNpc(roomName);
    }

    initNpc(roomName: string) {
        switch (roomName) {
            case 'PublicSpaceRoom':
                this.npcNickname.getComponent(Label).string = '55';
                this.npcModel.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('main/sgNpc');
                break;
            case 'SeeDAORoom':
                /** 判断是公会引导还是DAO引导 */
                if (this.node.getComponent(DelegateComponent).viewParams.params > 0) {
                    this.npcNickname.getComponent(Label).string = this.seeDaoGuildGuideData.json[this.guildID].botName;
                    this.npcModel.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('main/' + this.seeDaoGuildGuideData.json[this.guildID].botPortrait);
                } else {
                    this.npcNickname.getComponent(Label).string = 'baiyu';
                    this.npcModel.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('main/seeDaoNpc');
                }
                break;
            case 'HYDAORoom':
                console.log('not supposed to be displayed here');
                break;
            case 'AMDAORoom':
                console.log('not supposed to be displayed here');
                break;
            default:
                break;
        }
    }

    initDialog(roomName: string) {
        this.curDao = roomName;
        if (roomName == 'PublicSpaceRoom') {
            this.curSpaceGuideContent = this.publicSpaceGuideContent;
            this.curSpaceCameraData = this.publicSpaceGuideCameraData;
            this.nextBtn.active = false;
            this.letsGoBtn.active = true;
            this.showDaoListBtn.active = true;
            this.dialogContent.getComponent(Label).string = this.curSpaceGuideContent[0];
            this.previousBtn.active = false;
            this.totalPage.getComponent(Label).string = String(this.curSpaceGuideContent.length);
        } else if (roomName == 'SeeDAORoom') {
            if (this.node.getComponent(DelegateComponent).viewParams.params > 0) {
                this.previousBtn.active = false;
                this.nextBtn.active = false;
               if (smc.room.RoomModel.guildGuideStatus[this.guildID] == 0) {
                    /** 刚开始公会引导 */
                   this.welcomeTitle.getComponent(Label).string = smc.room.RoomModel.playerName + this.seeDaoGuildGuideData.json[this.guildID].welcomeTitle;
                   this.dialogContent.getComponent(Label).string = this.seeDaoGuildGuideData.json[this.guildID].welcomeDesc;
                   this.dialogContent.setPosition(this.dialogContent.position.x, this.dialogContent.position.y - this.welcomeTitle.getComponent(UITransform).height);
                   this.applyBtn.active = true;
                   this.checkFileBtn.active = true;
               } else if (smc.room.RoomModel.guildGuideStatus[this.guildID] == 1) {
                    /** 准备去填第一份问卷，这个1用来控制碰撞填问卷的建筑是否有反馈 */
                   this.dialogContent.getComponent(Label).string = this.seeDaoGuildGuideData.json[this.guildID].reemphasizeText;
                   this.guildGuideOkBtn.active = true;
               } else if (smc.room.RoomModel.guildGuideStatus[this.guildID] == 2) {
                    /** 填完第一份问卷，这个2用来控制关闭问卷窗口时弹什么东西出来 */
                   this.dialogContent.getComponent(Label).string = this.seeDaoGuildGuideData.json[this.guildID].confirmTextPhase1;
                   this.guildGuideOkBtn.active = true;
               } else if (smc.room.RoomModel.guildGuideStatus[this.guildID] == 3) {
                    /** 准备去填第二份问卷，这里跳过了人工审核的过程，不然应该是人工审核后再改变status的状态，这个3用来控制碰撞填问卷的建筑是否有反馈 */
                   console.log('好像也不应该走到这个流程');
               } else if (smc.room.RoomModel.guildGuideStatus[this.guildID] == 4) {
                    /** 填完第二份问卷，这个4用来控制关闭问卷窗口时弹什么东西出来，同时也用来控制新手任务建筑可以有反馈了 */
                   this.dialogContent.getComponent(Label).string = this.seeDaoGuildGuideData.json[this.guildID].confirmTextPhase2;
                   this.guildGuideOkBtn.active = true;
               } else if (smc.room.RoomModel.guildGuideStatus[this.guildID] == 5) {
                    /** 最后一步，领badge */
                   this.dialogContent.getComponent(Label).string = this.seeDaoGuildGuideData.json[this.guildID].completeTip;
                   this.guildGuideOkBtn.active = true;
                   this.guildGuideOkBtn.children[0].getComponent(Label).string = '立即领取';
                   this.rookieTaskBadgeGroup.active = true;
               } 
            } else {
                this.curSpaceGuideContent = this.seeDaoGuideContent;
                this.curSpaceCameraData = this.seeDaoGuideCameraData;
                this.dialogContent.getComponent(Label).string = this.curSpaceGuideContent[0];
                this.previousBtn.active = false;
                this.totalPage.getComponent(Label).string = String(this.curSpaceGuideContent.length);
            }
            
        }
    }


    processGuildGuide() {
        var curStatus = smc.room.RoomModel.guildGuideStatus[this.guildID];
        switch (curStatus) {
            /** 刚开始公会引导
             * 要引去看第一个建筑
             * 这里应该是一个tween把引过去，回来，显示窗口，进度进一步都做掉
             */
            case 0:
                if (!this.cameraMoved) {
                    this.moveCamera(this.seeDaoGuildGuideData.json[this.guildID].buildingXPhase1, this.seeDaoGuildGuideData.json[this.guildID].buildingYPhase1, this.seeDaoGuildGuideData.json[this.guildID].buildingWidthPhase1, this.seeDaoGuildGuideData.json[this.guildID].buildingHeightPhase1);
                } else {
                    this.moveCameraBack(true, false);
                    smc.room.RoomModel.guildGuideStatus[this.guildID] = 1; //前进一步    
                }
                break;
            /** 接上一步，这个时候只要关闭窗口就好 */
            case 1:
                this.confirmClose();
                break;
            /** 这个2，是在填完第一份问卷关闭时改变的，照理说要等人工审核，应该依然是关窗口，但现在没人工审核，所以直接显示下一步的内容*/
            case 2:
                //todo 要做根据1|2|3判断不同公会做什么
                if (this.seeDaoGuildGuideData.json[this.guildID].totalPhases == '1|2|3') {
                    this.dialogContent.getComponent(Label).string = this.seeDaoGuildGuideData.json[this.guildID].startTextPhase2;
                    smc.room.RoomModel.guildGuideStatus[this.guildID] = 3; //前进一步
                } else if (this.seeDaoGuildGuideData.json[this.guildID].totalPhases == '1|3') {
                    this.dialogContent.getComponent(Label).string = this.seeDaoGuildGuideData.json[this.guildID].confirmTextPhase2;
                    smc.room.RoomModel.guildGuideStatus[this.guildID] = 4; //直接进到
                }
                
                break;
            /** 这个3，就是上一步变的，这里要引去看下一个建筑*/
            case 3:
                if (!this.cameraMoved) {
                    this.moveCamera(this.seeDaoGuildGuideData.json[this.guildID].buildingXPhase2, this.seeDaoGuildGuideData.json[this.guildID].buildingYPhase2, this.seeDaoGuildGuideData.json[this.guildID].buildingWidthPhase2, this.seeDaoGuildGuideData.json[this.guildID].buildingHeightPhase2);
                } else {
                    this.moveCameraBack(false, false);
                }
                break;
            /** 这个4，是在填完第二份问卷关闭时改变的，这里应该要引去看下一个建筑*/
            case 4:
                if (!this.cameraMoved) {
                    this.moveCamera(this.seeDaoGuildGuideData.json[this.guildID].buildingXPhase3, this.seeDaoGuildGuideData.json[this.guildID].buildingYPhase3, this.seeDaoGuildGuideData.json[this.guildID].buildingWidthPhase3, this.seeDaoGuildGuideData.json[this.guildID].buildingHeightPhase3);
                } else {
                    this.moveCameraBack(false, false);
                }
                break;
            case 5:
                /** 最后一步，不需要做什么了 */
                this.confirmClose();
                smc.room.RoomModel.guildGuideStatus[this.guildID] = 6; //避免重复弹出
                break;
            default:
                break;
        }
    }

    /** 单纯把镜头移动移过去，不做任何处理 */
    moveCamera(x: string, y: string, width: string, height: string) {
        var pos: Vec3 = v3( - Number(x), - Number(y));
        var node = this.node.parent.parent.getChildByPath('LayerGame/spaceMap');
        node.getComponent(MapViewControl).moveCameraForGuide(pos, Number(width), Number(height));    
        this.cameraMoved = true;    
    }

    /** 把镜头移回来，移回来的时候判断下一步要变化dialog显示的内容，或者打开新dialog */
    moveCameraBack(newDialogAfter: boolean, isCheckFile: boolean) {
        var node = this.node.parent.parent.getChildByPath('LayerGame/spaceMap');
        node.getComponent(MapViewControl).moveCameraBack();        
        setTimeout(() => {
            this.cameraMoved = false;  
            if (isCheckFile) {
                this.dialogContent.getComponent(Label).string = this.seeDaoGuildGuideData.json[this.guildID].fileEndTip;
                this.node.active = true;
                this.checkFileBtn.children[0].getComponent(Label).string = '好的';
                this.isCheckFileDone = true;
            } else {
                oops.gui.remove(UIID.Demo_npcDialog);
                if (newDialogAfter) {
                    oops.gui.open(UIID.Demo_npcDialog, this.guildID + 1); //传0不行，所以传的时候要+1
                }
            }
        }, 1000);
    }

    checkFile() {
        if (this.isCheckFileDone) {
            this.confirmClose();
        } else {
            if (!this.cameraMoved) {
                this.moveCamera(this.seeDaoGuildGuideData.json[this.guildID].fileBuildingX, this.seeDaoGuildGuideData.json[this.guildID].fileBuildingY, this.seeDaoGuildGuideData.json[this.guildID].fileBuildingWidth, this.seeDaoGuildGuideData.json[this.guildID].fileBuildingHeight);
            } else {
                this.moveCameraBack(true, true);
            }
            
        }
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
        var node = this.node.parent.parent.getChildByPath('LayerGame/spaceMap');
        if (this.curPageNum == this.curSpaceGuideContent.length) {
            // this.endGuide(); 为方便录视频，不存完成引导的状态
            oops.gui.remove(UIID.Demo_npcDialog);
        } else {
            if (this.curPageNum + 1 == this.curSpaceGuideContent.length) {
                //最后一步镜头移回来
                this.curPageNum += 1;
                this.updatePageNum();
                this.cameraMoved = false;
                node.getComponent(MapViewControl).moveCameraBack();
            } else {
                /** 移动镜头 */
                if (!this.cameraMoved) {
                    this.cameraMoved = true;
                    node.getComponent(MapViewControl).moveCameraForGuide(v3(-this.curSpaceCameraData[this.curPageNum].x, -this.curSpaceCameraData[this.curPageNum].y), this.curSpaceCameraData[this.curPageNum].width, this.curSpaceCameraData[this.curPageNum].height);
                    this.curPageNum += 1;
                    this.updatePageNum();
                } else {
                    this.cameraMoved = false;
                    node.getComponent(MapViewControl).moveCameraBack();
                }
                
            }

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
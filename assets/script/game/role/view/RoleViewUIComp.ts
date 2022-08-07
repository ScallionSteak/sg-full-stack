/*
 * @Author: SS
 * @Date: 2022-06-27
 */

import { EditBox, EventTouch, instantiate, Label, Node, Prefab, Sprite, SpriteAtlas, UITransformComponent, Vec3, _decorator } from 'cc';
import { DEBUG } from 'cc/env';

import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import VMLabel from '../../../../../extensions/oops-framework/assets/libs/model-view/VMLabel';
import { oops } from '../../../../../extensions/oops-framework/assets/core/Oops';

import { smc } from '../../common/ecs/SingletonModuleComp';
import { CCComp } from '../../common/ecs/view/CCComp';
import { Role } from '../Role';
import { RoleModelComp } from '../model/RoleModelComp';
import { UIID } from '../../common/config/GameUIConfig';
import { UICallbacks } from '../../../../../extensions/oops-framework/assets/core/gui/layer/Defines';
import { RoomUtil } from '../../room/bll/RoomUtil';
import { RoomReenterDaoBtnList } from '../../room/view/RoomReenterDaoBtnList';
import { MapViewControl } from '../../scene/view/MapViewControl';
import { RoomEnterDaoBtnList } from '../../room/view/RoomEnterDaoBtnList';
import { HttpRequestForDS } from '../../../../../extensions/oops-framework/assets/core/network/http';
import { RoleViewChannelItem } from './RoleViewChannelItem';
const { ccclass, property } = _decorator;

/** 角色摇撼控制 */
@ccclass("RoleViewUIComp")
@ecs.register('RoleViewUIComp', false)
export class RoleViewUIComp extends CCComp {

    @property({ type: EditBox })
    chatContent: EditBox = null!;
    @property({ type: Node })
    channelContentLayer: Node = null!;
    @property({ type: Prefab })
    channelItem: Prefab = null!;

    @property({ type: Node })
    labelTitle: Node = null!;

    @property({ type: Node })
    labelServerUrl: Node = null!;

    @property(Prefab)
    prefabEnterDaoBtnListItem!: Prefab;

    @property({ type: Node })
    miniMapSprite: Node = null!;

    @property({ type: Node })
    playerOnMiniMap: Node = null!;

    @property({ type: SpriteAtlas })
    UIAtlas: SpriteAtlas = null!;

    @property({ type: Node })
    playerPopupLayer: Node = null!;

    @property({ type: Node })
    daoLogoGroupLayer: Node = null!;

    @property({ type: Node })
    chatLayer: Node = null!;

    @property({ type: Node })
    playerPortrait: Node = null!;
    @property({ type: Node })
    playerName: Node = null!;
    @property({ type: Node })
    playerSelfIntro: Node = null!;

    /** 控制的目标角色 */
    private target: Role = null!;
    public mvc = null;
    public collisionSelf: Role = null;
    public collisionOther: Role = null;

    private channelInfoArr: {name: string, attendeeCount: string, belongTo: string, date: string}[] = [
        { name: 'SeeDAO公共频道', attendeeCount: '120', belongTo: 'SeeDAO', date: '2022/08/12'},
        { name: '产品公会治理讨论', attendeeCount: '18', belongTo: 'SeeDAO', date: '2022/08/12' },
        { name: '公会身份要怎么上链', attendeeCount: '33', belongTo: 'SeeDAO', date: '2022/08/12' },
        { name: '产品公会应该如何OB', attendeeCount: '3', belongTo: 'SeeDAO', date: '2022/08/12' },
        { name: '产品X开发如何搞事情', attendeeCount: '90', belongTo: 'SeeDAO', date: '2022/08/12' },
        { name: '产品公会', attendeeCount: '9', belongTo: 'SeeDAO', date: '2022/08/12' },
        { name: 'ACGN二次元地下基地', attendeeCount: '50', belongTo: 'SeeDAO', date: '2022/08/12' },
        { name: '游戏化社区-SG', attendeeCount: '10', belongTo: 'SeeDAO', date: '2022/08/12' },
        { name: 'NFT何去何从', attendeeCount: '99', belongTo: 'SeeDAO', date: '2022/08/12' },
        { name: 'DAO真的是未来吗', attendeeCount: '999', belongTo: 'SeeDAO', date: '2022/08/12' }
    ];

    start() {
        this.target = this.ent as Role;
        this.loadRoomList();
        this.initMiniMap();
        this.updatePlayerInfoOnBottomBar();
        this.initDemoChatChannel();
    }

    initDemoChatChannel() {
        for(var i = 0; i < this.channelInfoArr.length; i++) {
            var node = instantiate(this.channelItem);
            node.parent = this.channelContentLayer;
            node.getComponent(RoleViewChannelItem).initData(this.channelInfoArr[i].name, this.channelInfoArr[i].attendeeCount, this.channelInfoArr[i].belongTo, this.channelInfoArr[i].date);
        }
    }

    showCreateChannel() {
        oops.gui.open(UIID.Demo_createChannel);
    }

    showChannelPopup() {
        oops.gui.open(UIID.Demo_channelPopup);
    }

    initMiniMap() {
        this.mvc = smc.scene.MapView.node.getComponent(MapViewControl);
        var mapName = smc.room.RoomModel.roomName;
        this.miniMapSprite.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame('mini' + mapName);        
    }

    updatePlayerOnMiniMap() {
        var playerPos = this.mvc.getFollowPosition();
        var miniX = - playerPos.x * (this.miniMapSprite.getComponent(UITransformComponent).width / this.mvc.width);
        var miniY = - playerPos.y * (this.miniMapSprite.getComponent(UITransformComponent).height / this.mvc.height);
        this.playerOnMiniMap.setPosition(miniX, miniY, 0);
    }

    updatePlayerInfoOnBottomBar() {
        var playerName = smc.room.RoomModel.owner.RoleModel.userDBName;
        var playerModel = String(smc.room.RoomModel.owner.RoleModel.userModelID);
        this.playerName.getComponent(Label).string = playerName;
        this.playerPortrait.getComponent(Sprite).spriteFrame = this.UIAtlas.getSpriteFrame("main/R0" + playerModel);
    }

    checkGuide() {
        var walletAddress = { walletAddress: localStorage.getItem('walletAddress') };
        var _http = new HttpRequestForDS();
        var url = '/queryUserGuideStatus';
        _http.postJSON(url, walletAddress, (res) => {
            var resAsJson = JSON.parse(res);
            var curRoom = smc.room.RoomModel.roomName;
            var sgGuideStatus = resAsJson[0].sgOnboardingStatus;
            var seeDaoGuideStatus = resAsJson[0].seeDaoOnboardingStatus;
            if (curRoom == "PublicSpaceRoom") {
                if (sgGuideStatus == '0') {
                    oops.gui.open(UIID.Demo_npcDialog);
                }
            } else if (curRoom == "SeeDAORoom") {
                if (seeDaoGuideStatus == '0') {
                    oops.gui.open(UIID.Demo_npcDialog);
                }
            } else if (curRoom == "HYDAORoom" || curRoom == "AMDAORoom") {
                console.log('nothing should happen');
            }
        });        
    }

    openChatWindow() {
        this.chatLayer.active = true;
    }

    showMapIntroduction() {
        if (oops.gui.has(UIID.Demo_miniMapIntroduction)) {
            oops.gui.remove(UIID.Demo_miniMapIntroduction);
        } else {
            oops.gui.open(UIID.Demo_miniMapIntroduction);
        }
    }

    showMyBounties() {
        if (oops.gui.has(UIID.Demo_bountyDashboard)) {
            oops.gui.remove(UIID.Demo_bountyDashboard);
        } else {
            oops.gui.open(UIID.Demo_bountyDashboard);
        }
    }

    /** 刷新房间列表 */
    async loadRoomList() {
        let ret = await smc.room.RoomModelNet.hc.callApi('RoomList', {});
        if (ret.isSucc) {
            try {
                this.checkGuide();
                for (let roomInfo of ret.res.rooms) {
                    let btnNode = instantiate(this.prefabEnterDaoBtnListItem);
                    let btnList = btnNode.getComponent(RoomReenterDaoBtnList);
                    btnList.initRoomInfo(roomInfo);
                    btnNode.parent = this.daoLogoGroupLayer;
                }
            }
            catch (e) {
                console.log("登录界面已释放")
            }
        }
    }

    showPlayerPopupLayer() {
        this.playerPopupLayer.active = true;
        console.log("showing");
    }

    closePlayerPopupLayer() {
        this.playerPopupLayer.active = false;
        console.log("closing");
    }

    ringSomeone() {
        smc.room.playerAttack(this.collisionSelf, this.collisionOther);
    }

    openWalletWindow() {
        oops.gui.open(UIID.Demo_wallet);
    }

    openMeetingWindow() {
        oops.gui.open(UIID.Demo_meeting);
    }

    openPersonalCenterWindow() {
        oops.gui.open(UIID.Demo_personalCenter);
    }

    private exit() {
        smc.room.leave();
    }

    /** 聊天 */
    private chat() {
        if (this.chatContent.string != "") {
            smc.room.chat(this.chatContent.string);
            this.chatContent.string = "";
        }
    }

    update() {
        this.updatePlayerOnMiniMap();
    }

    reset(): void {

    }
}
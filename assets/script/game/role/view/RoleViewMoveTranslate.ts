import { Component, Node, EventKeyboard, input, Input, KeyCode, v3, Vec3, _decorator, UI, UITransform, find } from 'cc';
import { MoveTranslate } from "../../../../../extensions/oops-framework/assets/core/game/move/MoveTranslate";
import { HttpRequestForDS } from '../../../../../extensions/oops-framework/assets/core/network/http';
import { oops } from '../../../../../extensions/oops-framework/assets/core/Oops';
import { Vec3Util } from '../../../../../extensions/oops-framework/assets/core/utils/Vec3Util';
import { UIID } from '../../common/config/GameUIConfig';
import { smc } from '../../common/ecs/SingletonModuleComp';
import { RoleViewPlayerState } from '../../room/bll/RoleViewPlayerState';
import { RoleViewUIComp } from './RoleViewUIComp';
const { ccclass, property } = _decorator;

@ccclass('RoleViewMoveTranslate')
export class RoleViewMoveTranslate extends MoveTranslate {

    /** 移动方向 */
    velocity: Vec3 = Vec3Util.zero;
    /** 移动速度 */
    speed: number = 0;

    private vectorC: Vec3 = new Vec3();
    private flag: boolean = false;
    private guildFlag: boolean = false;
    private guildGuideStatus: number = 0;

    async update(dt: number) {
        if (this.speed > 0) {
            Vec3.multiplyScalar(this.vectorC, this.velocity, this.speed * dt);
            //如果node移动后的tile是障碍物，那就不移动
            var curPosX = this.node.position.x;
            var curPosY = this.node.position.y;
            var newPos = v3(curPosX, curPosY, 0).add(this.vectorC);
            var tile = smc.scene.MapModel.getPosToTile(newPos);
            if (!tile.barrier) {
                this.node.translate(this.vectorC, Node.NodeSpace.WORLD);
                //这里仅限seedao的公会onboarding，因为那些都不是障碍物，是进门就触发的
                if (smc.room.RoomModel.roomName == 'SeeDAORoom') {
                    if (tile.buildingID >= 0) {
                        /** 只有本地玩家才会拿到RoleViewPlayerState，所以理论上说后面一个if是没用的，但加个保险貌似也没问题，就先放这儿吧 */
                        if (this.node.getComponent(RoleViewPlayerState)) {
                            if (this.node.getComponent(RoleViewPlayerState).role.RoleModel.id === smc.room.RoomModel.owner.RoleModel.id) {
                                let npcDialogArr = [0,1,2,3,4,5,6,7,8,9];
                                let bookshelfArr = [30, 31, 32, 33, 34, 35, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101];
                                switch (true) {
                                    case npcDialogArr.indexOf(tile.buildingID) != -1: 
                                        var uiToOpen = UIID.Demo_npcDialog;
                                        var uiArgs = tile.buildingID + 1; //用来告诉npcDialog撞到了哪个公会
                                        break;
                                    case bookshelfArr.indexOf(tile.buildingID) != -1:
                                        var uiToOpen = UIID.Demo_webview800600;
                                        var uiArgs = tile.buildingID; //打开对应编号的URL
                                        break;
                                    default:
                                        break;
                                }

                                if (!this.flag && !oops.gui.has(uiToOpen) && uiToOpen >= 0) {
                                    this.flag = true;
                                    await oops.gui.openAsync(uiToOpen, uiArgs);
                                    this.flag = false;
                                }
                            }
                        }
                    }
                }
            } else {
                //是障碍物的话，要进一步判断是哪个building，然后判断该UI是否被打开了，没打开就打开
                if (tile.buildingID >= 0) {
                    /** 只有本地玩家才会拿到RoleViewPlayerState，所以理论上说后面一个if是没用的，但加个保险貌似也没问题，就先放这儿吧 */
                    if(this.node.getComponent(RoleViewPlayerState)) {
                        if (this.node.getComponent(RoleViewPlayerState).role.RoleModel.id === smc.room.RoomModel.owner.RoleModel.id) {
                            if (smc.room.RoomModel.roomName == 'PublicSpaceRoom') {
                                /** 
                                 * switch中的顺序要和MapLoad中把建筑物push进数组的下标顺序保持一致
                                 */
                                switch (tile.buildingID) {
                                    case 0: //d2d界面还没做
                                        var uiToOpen = UIID.Demo_d2dSquare;
                                        var uiArgs = 0; //0无意义，只是因为后面有个if判断，这样用来确认有UI要打开
                                        break;
                                    case 1:
                                        var uiToOpen = UIID.Demo_bountyBoard;
                                        break;
                                    case 2: //support center界面还没做
                                        var uiArgs = -1; //用来保证没有UI打开
                                        break;
                                    case 3: //bigtower钟楼
                                        var uiToOpen = UIID.Demo_bigTower;
                                        var uiArgs = 0; //0无意义，只是因为后面有个if判断，这样用来确认有UI要打开
                                        break;
                                    case 4: //daoex是什么？
                                        var uiArgs = -1; //用来保证没有UI打开
                                        break;
                                    case 5: //某游戏
                                        var uiToOpen = UIID.Demo_webview800600;
                                        var uiArgs = 5;
                                    case 6: //某游戏
                                        var uiToOpen = UIID.Demo_webview800600;
                                        var uiArgs = 6;
                                    case 7: //某游戏
                                        var uiToOpen = UIID.Demo_webview800600;
                                        var uiArgs = 7;
                                    case 8: //某游戏
                                        var uiToOpen = UIID.Demo_webview800600;
                                        var uiArgs = 8;
                                        break;
                                    case 9: //空的项目公园
                                        var uiToOpen = UIID.Demo_webview800600;
                                        var uiArgs = 9;
                                        break;
                                    case 10: // 公区项目
                                        var uiToOpen = UIID.Demo_projectsPark;
                                        var uiArgs = 1;
                                        break;
                                    case 11: // 海盗项目
                                        var uiToOpen = UIID.Demo_projectsPark;
                                        var uiArgs = 2;
                                        break;
                                    case 12: // amdao项目
                                        var uiToOpen = UIID.Demo_projectsPark;
                                        var uiArgs = 3;
                                        break;
                                    case 13: // seedao的cc
                                        var uiToOpen = UIID.Demo_projectsPark;
                                        var uiArgs = 4;
                                        break;
                                    case 14: // 海盗garden
                                        var uiToOpen = UIID.Demo_daoGarden;
                                        var uiArgs = 1;
                                        break;
                                    case 15: // seedao garden
                                        var uiToOpen = UIID.Demo_daoGarden;
                                        var uiArgs = 2;
                                        break;
                                    case 16: // amdao garden
                                        var uiToOpen = UIID.Demo_daoGarden;
                                        var uiArgs = 3;
                                        break;
                                    case 17: // 空garden
                                        var uiToOpen = UIID.Demo_webview800600;
                                        var uiArgs = 17;
                                        break;
                                    case 18: // 空dao的岛
                                        var uiArgs = -1; //用来保证没有UI打开
                                        break;
                                    case 19: // amdao
                                        // 打开一个提示框，然后点击直接跳转到相对应的dao
                                        var uiToOpen = UIID.Demo_popupConfirm;
                                        var uiArgs = 19;
                                        break;
                                    case 20: // haydao
                                        // 打开一个提示框，然后点击直接跳转到相对应的dao
                                        var uiToOpen = UIID.Demo_popupConfirm;
                                        var uiArgs = 20;
                                        break;
                                    case 21: // seedao
                                        // 打开一个提示框，然后点击直接跳转到相对应的dao
                                        var uiToOpen = UIID.Demo_popupConfirm;
                                        var uiArgs = 21; //用来保证没有UI打开
                                        break;
                                    default:
                                        console.log("default switch in building check. some wrong.");
                                        var uiArgs = -1; //用来保证没有UI打开
                                        break;
                                }
                            } else if (smc.room.RoomModel.roomName == 'SeeDAORoom') {
                                console.log("tile building id.......", tile.buildingID);
                                let webviewArr = [10, 11, 16, 17, 19, 21, 22, 24, 25, 27, 28, 36, 37, 38, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51];
                                let rookieTaskArr = [12, 18, 20, 23, 26, 29];
                                let bountyBoardArr = [39, 52, 53, 54, 55, 56, 57, 58, 59];
                                let activityBoardArr = [50];
                                var uiArgs = tile.buildingID;
                                switch (true) {
                                    case webviewArr.indexOf(tile.buildingID) != -1:
                                        var uiToOpen = UIID.Demo_webview800600;
                                        break;
                                    case rookieTaskArr.indexOf(tile.buildingID) != -1:
                                        var uiToOpen = UIID.Demo_rookieTask;
                                        break;
                                    case bountyBoardArr.indexOf(tile.buildingID) != -1:
                                        var uiToOpen = UIID.Demo_bountyBoard;
                                        break;
                                    case activityBoardArr.indexOf(tile.buildingID) != -1:
                                        var uiToOpen = UIID.Demo_activityBoard;
                                        break;
                                        //** 这三个是投研的，先不处理 */
                                    // case 13:
                                    //     var uiToOpen = UIID.Demo_webview800600;
                                    //     var uiArgs = 13;
                                    //     break;
                                    // case 14:
                                    //     var uiToOpen = UIID.Demo_webview800600;
                                    //     var uiArgs = 14;
                                    //     break;
                                    // case 15:
                                    //     var uiToOpen = UIID.Demo_rookieTask;
                                    //     var uiArgs = 15;
                                    //     break;
                                    default:
                                        console.log("没有这个编号的障碍物");
                                        break;
                                }
                            } else if (smc.room.RoomModel.roomName == 'HYDAORoom') {
                                let hydaoWebviewArr = [0,1,2,3,4,5,6,7,8,9,10,11]
                                switch (true) {
                                    case hydaoWebviewArr.indexOf(tile.buildingID) != -1:
                                        var uiToOpen = UIID.Demo_webview800600;
                                        var uiArgs = tile.buildingID + 1;
                                        break;
                                    default:
                                        console.log("没有这个编号的障碍物");
                                        break;
                                }
                            } else if (smc.room.RoomModel.roomName == 'AMDAORoom') {
                                switch (tile.buildingID) {
                                    case 24: //产品公会a
                                        var uiToOpen = UIID.Demo_webview800600;
                                        var uiArgs = 24;
                                        break;
                                    case 25: //产品公会b
                                        var uiToOpen = UIID.Demo_webview800600;
                                        var uiArgs = 25;
                                        break;
                                    case 26: //产品公会c
                                        var uiToOpen = UIID.Demo_rookieTask;
                                        var uiArgs = 26;
                                        break;
                                    default:
                                        console.log("没有这个编号的障碍物");
                                        break;
                                }
                            }

                            if (!this.flag && !oops.gui.has(uiToOpen) && uiToOpen >= 0) {
                                this.flag = true;
                                await oops.gui.openAsync(uiToOpen, uiArgs);
                                this.flag = false;
                            }
                        }
                    }                    
                }
            }

            /** 
             * 1. 遍历所有玩家，计算和自己的距离，在多少范围内就打开窗口，远离了就关闭
             * 2. 如果和多个玩家都在距离内，要弹出多个窗口，这个mvp里先不处理，有需要再说
             */
            if (this.node.getComponent(RoleViewPlayerState)) { //意思是如果这个模型是本地玩家，才会去帮它判断是否有需要弹窗
                smc.room.RoomModel.players.forEach(p => {
                    if (p.RoleModel.id != smc.room.RoomModel.owner.RoleModel.id) {
                        var nodePos = this.node.position;
                        var dist = Vec3.distance(p.RoleView.node.position, nodePos);
                        var role_controller = find("root/gui/LayerUI/role_controller");
                        if (role_controller) {
                            if (dist < 50) { //测下来，50左右比较接近
                                role_controller.getComponent(RoleViewUIComp).showPlayerPopupLayer();
                                role_controller.getComponent(RoleViewUIComp).collisionSelf = smc.room.RoomModel.owner;
                                role_controller.getComponent(RoleViewUIComp).collisionOther = p;
                            } else {
                                role_controller.getComponent(RoleViewUIComp).closePlayerPopupLayer();
                            }
                        }
                    }
                })
            }
        }
    }

    /** TODO 现在时间关系，先不做，以后要在碰撞时检查是否已完成公会引导 */
    async checkGuildGuideStatus(guildID: number) {
        //要把this.guildGuideStatus给改了
        var jsonfile = {username: smc.room.RoomModel.playerName, guildID: guildID};
        var _http = new HttpRequestForDS();
        var url = '/queryGuildGuideStatus';
        _http.postJSON(url, jsonfile, (res) => {
            var jsonres = JSON.parse(res);
            this.guildGuideStatus = jsonres[0].guildGuideStatus;
        }); 
    }
}
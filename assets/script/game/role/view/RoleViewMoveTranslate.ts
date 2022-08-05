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
                                switch (tile.buildingID) {
                                    case 0: 
                                        var uiToOpen = UIID.Demo_npcDialog;
                                        var uiArgs = 1; //用来告诉npcDialog撞到了哪个公会
                                        break;
                                    case 1: 
                                        var uiToOpen = UIID.Demo_npcDialog;
                                        var uiArgs = 2; //用来告诉npcDialog撞到了哪个公会
                                        break;
                                    case 2: 
                                        var uiToOpen = UIID.Demo_npcDialog;
                                        var uiArgs = 3; //用来告诉npcDialog撞到了哪个公会
                                        break;
                                    case 3: 
                                        var uiToOpen = UIID.Demo_npcDialog;
                                        var uiArgs = 4; //用来告诉npcDialog撞到了哪个公会
                                        break;
                                    case 4: 
                                        var uiToOpen = UIID.Demo_npcDialog;
                                        var uiArgs = 5; //用来告诉npcDialog撞到了哪个公会
                                        break;
                                    case 5: 
                                        var uiToOpen = UIID.Demo_npcDialog;
                                        var uiArgs = 6; //用来告诉npcDialog撞到了哪个公会
                                        break;
                                    case 6: 
                                        var uiToOpen = UIID.Demo_npcDialog;
                                        var uiArgs = 7; //用来告诉npcDialog撞到了哪个公会
                                        break;
                                    case 7: 
                                        var uiToOpen = UIID.Demo_npcDialog;
                                        var uiArgs = 8; //用来告诉npcDialog撞到了哪个公会
                                        break;
                                    case 8: 
                                        var uiToOpen = UIID.Demo_npcDialog;
                                        var uiArgs = 9; //用来告诉npcDialog撞到了哪个公会
                                        break;
                                    case 9: 
                                        var uiToOpen = UIID.Demo_npcDialog;
                                        var uiArgs = 1; //用来告诉npcDialog撞到了哪个公会
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
                                    case 3: //bigtower大概是钟楼，界面也还没做
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
                                        var uiArgs = -1; //用来保证没有UI打开
                                        break;
                                    case 20: // haidao
                                        // 打开一个提示框，然后点击直接跳转到相对应的dao
                                        var uiArgs = -1; //用来保证没有UI打开
                                        break;
                                    case 21: // seedao
                                        // 打开一个提示框，然后点击直接跳转到相对应的dao
                                        var uiArgs = -1; //用来保证没有UI打开
                                        break;
                                    default:
                                        console.log("default switch in building check. some wrong.");
                                        var uiArgs = -1; //用来保证没有UI打开
                                        break;
                                }
                            } else if (smc.room.RoomModel.roomName == 'SeeDAORoom') {
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
                                        var uiToOpen = UIID.Demo_webview800600;
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
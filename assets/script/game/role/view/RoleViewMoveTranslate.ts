import { Component, Node, EventKeyboard, input, Input, KeyCode, v3, Vec3, _decorator, UI, UITransform, find } from 'cc';
import { MoveTranslate } from "../../../../../extensions/oops-framework/assets/core/game/move/MoveTranslate";
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
            } else {
                //是障碍物的话，要进一步判断是哪个building，然后判断该UI是否被打开了，没打开就打开
                if (tile.buildingID >= 0) {
                    /** 只有本地玩家才会拿到RoleViewPlayerState，所以理论上说后面一个if是没用的，但加个保险貌似也没问题，就先放这儿吧 */
                    if(this.node.getComponent(RoleViewPlayerState)) {
                        if (this.node.getComponent(RoleViewPlayerState).role.RoleModel.id === smc.room.RoomModel.owner.RoleModel.id) {
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
                                    // var uiToOpen = UIID.Demo_projectsPark;
                                    break;
                                case 3: //bigtower大概是钟楼，界面也还没做
                                    var uiToOpen = UIID.Demo_bigTower;
                                    var uiArgs = 0; //0无意义，只是因为后面有个if判断，这样用来确认有UI要打开
                                    break;
                                case 4: //daoex是什么？
                                    // var uiToOpen = UIID.Demo_bountyBoard;
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
                                    break;
                                case 19: // amdao
                                    // 打开一个提示框，然后点击直接跳转到相对应的dao
                                    break;
                                case 20: // haidao
                                    // 打开一个提示框，然后点击直接跳转到相对应的dao
                                    break;
                                case 21: // seedao
                                    // 打开一个提示框，然后点击直接跳转到相对应的dao
                                    break;
                                default:
                                    console.log("default switch in building check. some wrong.");
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
}
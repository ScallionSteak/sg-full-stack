import { Component, Node, EventKeyboard, input, Input, KeyCode, v3, Vec3, _decorator, UI, UITransform, find } from 'cc';
import { MoveTranslate } from "../../../../../extensions/oops-framework/assets/core/game/move/MoveTranslate";
import { oops } from '../../../../../extensions/oops-framework/assets/core/Oops';
import { Vec3Util } from '../../../../../extensions/oops-framework/assets/core/utils/Vec3Util';
import { UIID } from '../../common/config/GameUIConfig';
import { smc } from '../../common/ecs/SingletonModuleComp';
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
                    if (!this.flag && !oops.gui.has(111)) {
                        this.flag = true;
                        await oops.gui.openAsync(111);
                        this.flag = false;
                    }
                }
            }

            /** 通过距离判断是否产生‘碰撞’效果，写完后需去除物理引擎代码 */
            /** 
             * 要实现的逻辑：
             * 1. 遍历所有玩家，计算和自己的距离，在多少范围内就执行某个动作
             * 2. 如果和多个玩家都在距离内，要弹出多个窗口，这个先不处理，有需要再说
             * 3. 出生的时候不要执行碰撞检测
             */
            smc.room.RoomModel.players.forEach(p => {
                if (p.RoleModel.id === smc.room.RoomModel.owner.RoleModel.id) {
                    // console.log("owner, don't compare");
                } else {
                    var nodePos = smc.room.RoomModel.owner.RoleView.node.position;
                    var dist = Vec3.distance(p.RoleView.node.position, nodePos);
                    var role_controller = find("root/gui/LayerUI/role_controller");
                    if(role_controller){
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
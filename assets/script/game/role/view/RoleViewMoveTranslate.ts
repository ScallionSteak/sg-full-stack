import { Component, Node, EventKeyboard, input, Input, KeyCode, v3, Vec3, _decorator, UI } from 'cc';
import { MoveTranslate } from "../../../../../extensions/oops-framework/assets/core/game/move/MoveTranslate";
import { oops } from '../../../../../extensions/oops-framework/assets/core/Oops';
import { Vec3Util } from '../../../../../extensions/oops-framework/assets/core/utils/Vec3Util';
import { UIID } from '../../common/config/GameUIConfig';
import { smc } from '../../common/ecs/SingletonModuleComp';
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
                //是障碍物的话，要进一步判断是哪个building
                if (tile.buildingID >= 0) {
                    if (!this.flag && !oops.gui.has(UIID.Demo_Chat)) {
                        this.flag = true;
                        await oops.gui.openAsync(UIID.Demo_Chat);
                        this.flag = false;
                    }
                }
            }

            // smc.room.RoomModel.players.forEach(p => {
            //     Vec3.distance(p.RoleView.node, )
               
            // })
        }
    }
}
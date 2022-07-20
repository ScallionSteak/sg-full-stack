
/*
 * @Author: dgflash
 * @Date: 2022-03-25 18:12:10
 * @LastEditors: dgflash
 * @LastEditTime: 2022-04-20 16:24:32
 */
import { Component, instantiate, Node, v3, Vec3, _decorator } from "cc";
import { smc } from "../../../../../../assets/script/game/common/ecs/SingletonModuleComp";
import { oops } from "../../Oops";
import { Vec3Util } from "../../utils/Vec3Util";

const { ccclass, property } = _decorator;

/** 角色坐标方式移动 */
@ccclass('MoveTranslate')
export class MoveTranslate extends Component {
    /** 移动方向 */
    velocity: Vec3 = Vec3Util.zero;
    /** 移动速度 */
    speed: number = 0;

    private vector: Vec3 = new Vec3();

    update(dt: number) {
        if (this.speed > 0) {
            Vec3.multiplyScalar(this.vector, this.velocity, this.speed * dt);
            //如果node移动后的tile是障碍物，那就不移动
            var curPosX = this.node.position.x;
            var curPosY = this.node.position.y;
            var newPos = v3(curPosX,curPosY,0).add(this.vector);
            var tile = smc.scene.MapModel.getPosToTile(newPos);
            if(!tile.barrier) {
                this.node.translate(this.vector, Node.NodeSpace.WORLD);
            } else {
                //是障碍物的话，要进一步判断是哪个building
                if (tile.buildingID >= 0) {
                    //todo 这里没法直接调用oops.gui
                }
            }
        }
    }
}

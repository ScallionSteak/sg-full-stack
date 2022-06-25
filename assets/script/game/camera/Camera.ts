/*
 * @Author: dgflash
 * @Date: 2022-02-12 11:02:21
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 16:17:58
 */
import { Node } from "cc";
import { ecs } from "../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { CameraModelComp } from "./model/CameraModelComp";

export class Camera extends ecs.Entity {
    CameraModel!: CameraModelComp;

    protected init(): void {
        this.addComponents<ecs.Comp>(
            CameraModelComp);

        this.CameraModel.init();
    }

    /** 设置跟随 */
    setFollow(target: Node) {
        this.CameraModel.orbit.target = target;
        this.CameraModel.orbit.follow();
    }
}
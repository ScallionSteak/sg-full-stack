/*
 * @Author: dgflash
 * @Date: 2022-03-24 16:46:52
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 16:20:28
 */

import { Camera } from "cc";
import { OrbitCamera } from "../../../../../extensions/oops-framework/assets/core/game/camera/OrbitCamera";
import { oops } from "../../../../../extensions/oops-framework/assets/core/Oops";
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";

/** 摄像机数据 */
@ecs.register('CameraModel')
export class CameraModelComp extends ecs.Comp {
    /** 摄像机组件 */
    camera: Camera = null!;
    /** 轨道相机 */
    orbit: OrbitCamera = null!;

    init() {
        this.camera = oops.game.root.getComponentInChildren(Camera)!;
        this.orbit = oops.game.root.getComponentInChildren(OrbitCamera)!;
    }

    reset(): void {

    }
}
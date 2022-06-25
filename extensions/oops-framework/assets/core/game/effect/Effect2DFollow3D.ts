/*
 * @Author: dgflash
 * @Date: 2022-03-31 18:03:50
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 16:36:30
 */

import { Camera, Component, Node, Vec3, _decorator } from "cc";
import { oops } from "../../Oops";

const { ccclass, property } = _decorator;

/** 2D节点跟随3D节点 */
@ccclass("Effect2DFollow3D")
export class Effect2DFollow3D extends Component {
    @property({ type: Node })
    public node3d: Node = null!;

    @property({ type: Node })
    public nodeUi: Node = null!;

    /** 三维摄像机 */
    camera: Camera = null!;

    private pos = new Vec3();

    lateUpdate(dt: number) {
        this.node3d.getWorldPosition(this.pos);
        this.camera.convertToUINode(this.pos, oops.gui.game, this.pos);
        this.nodeUi.setPosition(this.pos);
    }
}


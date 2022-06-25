/*
 * @Author: dgflash
 * @Date: 2021-11-18 17:35:40
 * @LastEditors: dgflash
 * @LastEditTime: 2022-03-03 15:46:46
 */
import { Component, Node, _decorator } from "cc";

const { ccclass, property } = _decorator;

/** 地图元素深度排序 */
@ccclass("MapViewDepthSort")
export class MapViewDepthSort extends Component {
    onLoad() {

    }

    update(dt: number): void {
        // if (e.MapModel.game) e.MapModel.game.node.children.sort(this.sort);
    }

    private sort(a: Node, b: Node) {
        let a_x = a.position.x;
        let b_x = b.position.x;
        let a_y = a.position.y;
        let b_y = b.position.y;
        return b_y - a_y + (a_x - b_x);
    }

    reset(): void {

    }
}
import { Component, _decorator, Node, Animation, Prefab } from "cc";

const { ccclass, property } = _decorator;

/** 角色动画 */
@ccclass('RoleViewAnimator')
export class RoleViewAnimator extends Component {

    @property(Node)
    player: Node = null;

    //0 播放中，1 未播放中
    private walkLeftAnimaDone = 1;
    private walkRightAnimaDone = 1;
    private walkDownAnimaDone = 1;
    private walkUpAnimaDone = 1;

    start() {

    }

    /** 待机动画 */
    idle() {
        this.player.getComponent(Animation).stop();
    }

    // 
    /** 四方向移动动画 */
    run(data: any) {
        if (data.vector.x == -1) {
            var animaName = 'roleWalkLeft';
        } else if (data.vector.x == 1) {
            var animaName = 'roleWalkRight';
        }
        if (data.vector.y == -1) {
            var animaName = 'roleWalkDown';
        } else if (data.vector.y == 1) {
            var animaName = 'roleWalkUp';
        }
        var animaComponent = this.player.getComponent(Animation);
        var animaState = animaComponent.getState(animaName);
        if (!animaState.isPlaying) {
            this.player.getComponent(Animation).play(animaName);
        }

    }
}
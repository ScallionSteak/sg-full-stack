import { Component, _decorator, Node, Animation, Prefab } from "cc";

const { ccclass, property } = _decorator;

/** 角色动画 */
@ccclass('RoleViewAnimator')
export class RoleViewAnimator extends Component {

    @property(Node)
    player: Node = null;

    //0 播放中，1 未播放中
    private animaDone = 1;

    /** 待机动画 */
    idle() {
        // switch (dir) {
        //     case 'A':
        //         this.player.getComponent(Animation).play('idleLeft');
        //         break;
        //     case 'W':
        //         this.player.getComponent(Animation).play('idleUp');
        //         break;
        //     case 'S':
        //         this.player.getComponent(Animation).play('idleDown');
        //         break;
        //     case 'D':
        //         this.player.getComponent(Animation).play('idleRight');
        //         break;

        //     default:
        //         break;
        // }
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
        animaComponent.on(Animation.EventType.FINISHED, (type, animaState) => {
            this.animaDone = 1;
            console.log(`State finished.`);
        });
        animaComponent.on(Animation.EventType.PLAY, (type, animaState) => {
            this.animaDone = 0;
            console.log(`playing`);
        });
        if (this.animaDone == 1) {
            animaComponent.play(animaName);
        }

    }
}
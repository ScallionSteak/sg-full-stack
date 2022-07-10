import { Component, _decorator, Node, Animation, Prefab, SpriteAtlas, Sprite } from "cc";

const { ccclass, property } = _decorator;

/** 角色动画 */
@ccclass('RoleViewAnimator')
export class RoleViewAnimator extends Component {

    @property(Node)
    player: Node = null;

    @property(SpriteAtlas)
    playerAtlas: SpriteAtlas = null;

    private roleModelID: string = '1'; //默认第一个模型

    start() {
        this.roleModelID = localStorage.getItem('roleModelID');
        this.player.getComponent(Sprite).spriteFrame = this.playerAtlas.getSpriteFrame('R0' + this.roleModelID + '/R0' + this.roleModelID + '_24');

    }

    /** 待机动画 */
    idle() {
        this.player.getComponent(Animation).stop();
    }

    // 
    /** 四方向移动动画 */
    run(data: any) {
        if (data.vector.x == -1) {
            var animaName = 'role0' + this.roleModelID + 'Left';
        } else if (data.vector.x == 1) {
            var animaName = 'role0' + this.roleModelID + 'Right';
        }
        if (data.vector.y == -1) {
            var animaName = 'role0' + this.roleModelID + 'Down';
        } else if (data.vector.y == 1) {
            var animaName = 'role0' + this.roleModelID + 'Up';
        }
        var animaComponent = this.player.getComponent(Animation);
        var animaState = animaComponent.getState(animaName);
        if (!animaState.isPlaying) {
            this.player.getComponent(Animation).play(animaName);
        }
    }
}
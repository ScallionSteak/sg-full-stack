/*
 * @Author: dgflash
 * @Date: 2022-05-27 16:03:19
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 16:41:54
 */

import { Logger } from "../../../../../extensions/oops-framework/assets/core/common/log/Logger";
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { MsgPlayerAttack } from "../../../tsrpc/protocols/room/server/MsgPlayerAttack";
import { Room } from "../Room";

/** 接受服务器玩家攻击命令 */
@ecs.register('MsgPlayerAttack')
export class MsgPlayerAttackComp extends ecs.Comp {
    data: MsgPlayerAttack[] = [];

    reset(): void {
        this.data.splice(0, this.data.length);
    }
}

export class MsgPlayerAttackSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem, ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(MsgPlayerAttackComp);
    }

    entityEnter(e: Room): void {
        e.RoomModelNet.wsc.listenMsg(`server/PlayerAttack`, v => {
            // e.get(MsgPlayerAttackComp).data.push(v);
            let player = e.RoomModel.players.get(v.uid);
            let target = e.RoomModel.players.get(v.targetId);
            console.log(player.RoleModel.id, target.RoleModel.id);
            if (player && target) {
                // 只让目标玩家看到提示
                if (e.RoomModel.owner.RoleModel.id == v.targetId) {
                    if (Notification.permission === 'granted') {
                        let notify = new Notification('有人找你哦', {
                            icon: '',
                            body: target.RoleModel.nickname
                        })

                        // 点击时桌面消息时触发
                        notify.onclick = () => {
                            // 跳转到当前通知的tab,如果浏览器最小化，会将浏览器显示出来
                            window.focus()
                        }
                    } else if (Notification.permission === 'default') {
                        Notification.requestPermission().then(PermissionStatus => {
                            if (PermissionStatus === 'granted') {
                                let notify = new Notification('有人找你哦', {
                                    icon: '',
                                    body: target.RoleModel.nickname
                                })

                                // 点击时桌面消息时触发
                                notify.onclick = () => {
                                    // 跳转到当前通知的tab,如果浏览器最小化，会将浏览器显示出来
                                    window.focus()
                                }
                            } else if (PermissionStatus === 'default') {
                                console.log('window closed');
                            } else {
                                console.log('user chooses to deny');
                            }
                        })
                    } else {
                        console.log('permission has already been denied');
                    }
                }
            }
        });
    }

    update(e: Room): void {
        let comp = e.get(MsgPlayerAttackComp);
        if (comp.data.length > 0) {
            let data = comp.data.splice(0, comp.data.length);
            data.forEach(d => {
                let player = e.RoomModel.players.get(d.uid);
                let target = e.RoomModel.players.get(d.targetId);
                if (player && target) {
                    // 用于解决传递消息
                }
            });
        }
    }
}
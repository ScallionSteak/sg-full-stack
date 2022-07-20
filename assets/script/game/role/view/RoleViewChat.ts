/*
 * @Author: SS
 * @Date: 2022-06-27
 */

import { AudioSource, EditBox, EventTouch, Label, Node, v3, Vec3, _decorator } from 'cc';
import { DEBUG } from 'cc/env';

import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import VMLabel from '../../../../../extensions/oops-framework/assets/libs/model-view/VMLabel';
import { oops } from '../../../../../extensions/oops-framework/assets/core/Oops';

import { smc } from '../../common/ecs/SingletonModuleComp';
import { CCComp } from '../../common/ecs/view/CCComp';
import { Role } from '../Role';
import { RoleModelComp } from '../model/RoleModelComp';
import { UIID } from '../../common/config/GameUIConfig';
import { MapViewControl } from '../../scene/view/MapViewControl';
const { ccclass, property } = _decorator;

/** 角色摇撼控制 */
@ccclass("RoleViewChat")
@ecs.register('RoleViewUIChat', false)
export class RoleViewChat extends CCComp {

    @property({ type: EditBox })
    chatContent: EditBox = null!;

    @property({ type: AudioSource })
    notificationAudio: AudioSource = null!;

    closeSelf() {
        oops.gui.remove(UIID.Demo_Chat);
    }

    testPlayAudio() {
        this.notificationAudio.play();
    }

    testNotification() {
        Notification.requestPermission(status => {
            if (status === 'granted') {
                let notify = new Notification('测试系统提示', {
                    icon: '',
                    body: '有人在找你哦'
                })

                // 桌面消息显示时
                notify.onshow = () => {
                    this.notificationAudio.play();
                }

                // 点击时桌面消息时触发
                notify.onclick = () => {
                    // 跳转到当前通知的tab,如果浏览器最小化，会将浏览器显示出来
                    window.focus()
                }
            }
        })
    }

    /** 聊天 */
    private chat() {
        if (this.chatContent.string != "") {
            smc.room.chat(this.chatContent.string);
            this.chatContent.string = "";
        }
    }

    reset(): void {

    }
}
/*
 * @Author: SS
 * @Date: 2022-06-27
 */

import { AudioSource, EditBox, EventTouch, Label, Node, sys, tween, UIOpacity, v3, Vec3, WebView, _decorator } from 'cc';
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
import { DelegateComponent } from '../../../../../extensions/oops-framework/assets/core/gui/layer/DelegateComponent';
const { ccclass, property } = _decorator;

/** 角色摇撼控制 */
@ccclass("RoleViewWebview")
@ecs.register('RoleViewWebview', false)
export class RoleViewWebview extends CCComp {

    @property({ type: Node })
    webView: Node = null!;
    @property({ type: Node })
    loading: Node = null!;
    @property({ type: Node })
    webviewGroup: Node = null!;
    @property({ type: Node })
    NewWindowLinkGroup: Node = null!;
    @property({ type: Node })
    newWindowLink: Node = null!;
    @property({ type: Node })
    confirmBtn: Node = null!;
    @property({ type: Node })
    cancelBtn: Node = null!;
    
    private id = 0;

    onLoad() {
        this.id = this.node.getComponent(DelegateComponent).viewParams.params;
        this.init();
    }

    init() {
        var roomName = smc.room.RoomModel.roomName;
        if (roomName == 'PublicSpaceRoom') {
            switch (this.id) {
                case 5: //找牛
                    this.webView.getComponent(WebView).url = 'https://findtheinvisiblecow.com/';
                    break;
                case 6: //超级玛丽
                    this.webView.getComponent(WebView).url = 'https://www.yikm.net/play?id=3501&n=L2Zjcm9tL2R6bXgvU3VwZXIgTWFyaW8gQnJvcy4gKFcpIFshXS5uZXM=&t=%E8%B6%85%E7%BA%A7%E9%A9%AC%E9%87%8C%E5%A5%A5&ac=3&p=/fcpic/2146a.png';
                    break;
                case 7: //连连看
                    this.webView.getComponent(WebView).url = 'https://lines.frvr.com/';
                    break;
                case 8: //emoji大战
                    this.webView.getComponent(WebView).url = 'https://emojia.glitch.me/';
                    break;
                case 9: //空project
                    this.webView.getComponent(WebView).url = 'https://forms.gle/impXfCz1KAkL7nqw8';
                    break;
                case 17: //空garden
                    this.webView.getComponent(WebView).url = 'https://forms.gle/gFJbT8egowUV65D69';
                    break;
                default:
                    console.log('no such webview. some wrong here.');
                    break;
            }
            this.loadingAnim();
        } else if (roomName == 'SeeDAORoom') {
            /** 这里目前只是人工确认哪个24（既哪个layer）和哪个公会对应 */
            switch (this.id) {
                case 24:
                    if (smc.room.RoomModel.roomGuildGuideData[0].link1Type == '1') {
                        this.NewWindowLinkGroup.active = false;
                        this.webviewGroup.active = true;
                        this.loadingAnim();
                        this.webView.getComponent(WebView).url = smc.room.RoomModel.roomGuildGuideData[0].link1;
                        smc.room.RoomModel.guildGuideStatus[0] = 2; //假定这个webview是第一份问卷
                    } else if (smc.room.RoomModel.roomGuildGuideData[0].link1Type == '2') {
                        this.NewWindowLinkGroup.active = true;
                        this.webviewGroup.active = false;
                        this.newWindowLink.getComponent(Label).string = smc.room.RoomModel.roomGuildGuideData[0].link1;
                    }
                    break;
                case 25:
                    if (smc.room.RoomModel.roomGuildGuideData[0].link1Type == '1') {
                        this.NewWindowLinkGroup.active = false;
                        this.webviewGroup.active = true;
                        this.loadingAnim();
                        this.webView.getComponent(WebView).url = smc.room.RoomModel.roomGuildGuideData[0].link2;
                        smc.room.RoomModel.guildGuideStatus[0] = 4; //假定这个webview是第二份问卷
                    } else if (smc.room.RoomModel.roomGuildGuideData[0].link1Type == '2') {
                        this.NewWindowLinkGroup.active = true;
                        this.webviewGroup.active = false;
                        this.newWindowLink.getComponent(Label).string = smc.room.RoomModel.roomGuildGuideData[0].link2;
                    }
                    break;
                default:
                    console.log('no such link case. some wrong here.');
                    break;
            }
        } else if (roomName == 'HYDAORoom') {
            this.NewWindowLinkGroup.active = false;
            this.webviewGroup.active = true;
            switch (this.id) {
                case 1:
                    this.webView.getComponent(WebView).url = 'https://v1.embednotion.com/embed/3868764cfb5b4e2898784039c4076ed3';
                    break;
                case 2:
                    this.webView.getComponent(WebView).url = 'https://v1.embednotion.com/embed/1e328b7586b144e9ab5f4086dee86792';
                    break;
                case 3:
                    this.webView.getComponent(WebView).url = 'https://v1.embednotion.com/embed/dc3bc0d2d0bb490cac87356655fea0f2';
                    break;
                case 4:
                    this.webView.getComponent(WebView).url = 'https://v1.embednotion.com/embed/4767b9c32c3441c78351741aa2d6127a';
                    break;
                case 5:
                    this.webView.getComponent(WebView).url = 'https://v1.embednotion.com/embed/92a0f8c122214ec2bed74407f594fb44';
                    break;
                case 6:
                    this.webView.getComponent(WebView).url = 'https://v1.embednotion.com/embed/8b3853991af54961823d9644342e30ab';
                    break;
                case 7:
                    this.webView.getComponent(WebView).url = 'https://v1.embednotion.com/embed/999974c6bb8045f38ff50c44b381a287';
                    break;
                case 8:
                    this.webView.getComponent(WebView).url = 'https://v1.embednotion.com/embed/a60409b4d6a14111a515cbb189a78111';
                    break;
                case 9:
                    this.webView.getComponent(WebView).url = 'https://v1.embednotion.com/embed/d123d3ff15f44062a5aaa92ca21b0dac';
                    break;
                case 10:
                    this.webView.getComponent(WebView).url = 'https://v1.embednotion.com/embed/7932d700197f44cdb6f342e45f4f916e';
                    break;
                case 11:
                    this.webView.getComponent(WebView).url = 'https://v1.embednotion.com/embed/65d4b472790748288f35a6feff28e157';
                    break;
                case 12:
                    this.webView.getComponent(WebView).url = 'https://v1.embednotion.com/embed/982734e6c5874dcaab7f99ac39d3ecce';
                    break;
            
                default:
                    break;
            }
            this.loadingAnim();
        } else if (roomName == 'AMDAORoom') {
            switch (this.id) {
                case 1:

                    break;

                default:
                    break;
            }
            this.loadingAnim();
        }

    }

    loadingAnim() {
        tween(this.loading.getComponent(UIOpacity))        
            .repeatForever(tween(this.loading.getComponent(UIOpacity))
                .to(0.5, { opacity: 100 })
                .to(0.5, { opacity: 255 })
                .start()).start();
    }

    openNewWindowLink() {
        sys.openURL(this.newWindowLink.getComponent(Label).string);
        this.confirmBtn.active = false;
        this.cancelBtn.active = false;
    }

    closeSelf() {
        oops.gui.remove(UIID.Demo_webview800600);
        if (smc.room.RoomModel.roomName == 'SeeDAORoom') {
            switch (this.id) {
                case 24:
                    oops.gui.open(UIID.Demo_npcDialog, 1); //传0有问题，所以这里公会ID+1
                    break;
                case 25:
                    oops.gui.open(UIID.Demo_npcDialog, 1);
                    break;
                default:
                    break;
            }
        }
    }

    reset(): void {

    }
}
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
            /** 这里目前只是人工确认哪个layer和哪个公会对应 */
            switch (this.id) {
                case 10:
                    this.fillInGuildForm(0, 1);
                    break;
                case 11:
                    this.fillInGuildForm(0, 2);
                    break;
                case 13:
                    this.fillInGuildForm(1, 1);
                    break;
                case 14:
                    this.fillInGuildForm(1, 2);
                    break;
                case 16:
                    this.fillInGuildForm(2, 1);
                    break;
                case 17:
                    this.fillInGuildForm(2, 2);
                    break;
                case 19:
                    this.fillInGuildForm(3, 1);
                    break;
                case 21:
                    this.fillInGuildForm(4, 1);
                    break;
                case 22:
                    this.fillInGuildForm(4, 2);
                    break;
                case 24:
                    this.fillInGuildForm(5, 1);
                    break;
                case 25:
                    this.fillInGuildForm(5, 2);
                    break;
                case 27:
                    this.fillInGuildForm(6, 1);
                    break;
                case 28:
                    this.fillInGuildForm(6, 2);
                    break;
                case 30:
                    this.webView.getComponent(WebView).url = 'https://v1.embednotion.com/embed/8b2e1e95151247eb8b712165fbd6b9b6';
                    break;
                case 31:
                    this.webView.getComponent(WebView).url = 'https://v1.embednotion.com/embed/85a0ef83dc464d768236cf2853e75274';
                    break;
                case 32:
                    this.webView.getComponent(WebView).url = 'https://v1.embednotion.com/embed/c7cb36a494b9442898b7b4b977391001';
                    break;
                case 33:
                    this.webView.getComponent(WebView).url = 'https://v1.embednotion.com/embed/bc2bc2bd57ad4ec890153f6a924f5502';
                    break;
                case 34:
                    this.webView.getComponent(WebView).url = 'https://v1.embednotion.com/embed/ebf5883ef4144302a72142c5dcc5f917';
                    break;
                case 35:
                    this.webView.getComponent(WebView).url = 'https://v1.embednotion.com/embed/ebf5883ef4144302a72142c5dcc5f917';
                    break;
                case 36:
                    this.webView.getComponent(WebView).url = 'https://v1.embednotion.com/embed/bba572d48ae94667bc0d0130d9b8e95c';
                    break;
                case 37:
                    this.NewWindowLinkGroup.active = true;
                    this.webviewGroup.active = false;
                    this.newWindowLink.getComponent(Label).string = 'https://forum.seedao.xyz/';
                    break;
                case 38:
                    this.NewWindowLinkGroup.active = true;
                    this.webviewGroup.active = false;
                    this.newWindowLink.getComponent(Label).string = 'https://seedao.xyz/hall';
                    break;
                case 39:
                    console.log('not supposed to be here. should open a UI window.');
                    break;
                case 40:
                    this.webView.getComponent(WebView).url = 'https://calendar.google.com/calendar/embed?src=0vfpndha1r2ic814uiddqj52g0veul38%40import.calendar.google.com&ctz=Asia%2FSingapore<iframe src="https://calendar.google.com/calendar/embed?src=0vfpndha1r2ic814uiddqj52g0veul38%40import.calendar.google.com&ctz=Asia%2FSingapore" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>';
                    break;
                case 41:
                    this.webView.getComponent(WebView).url = 'https://gartic.io/';
                    break;
                case 42:
                    this.webView.getComponent(WebView).url = 'https://bemuse.ninja/';
                    break;
                case 44:
                    this.webView.getComponent(WebView).url = 'https://tetranoid.io/';
                    break;
                case 44:
                    this.webView.getComponent(WebView).url = 'https://findtheinvisiblecow.com/';
                    break;
                case 45:
                    this.webView.getComponent(WebView).url = 'https://w.mgtv.com/b/446003/17108602.html?fpa=se&lastp=so_result';
                    break;
                case 46:
                    this.webView.getComponent(WebView).url = 'https://music.163.com/outchain/player?type=2&id=1413863166&auto=1&height=66';
                    break;
                case 47:
                    this.webView.getComponent(WebView).url = 'https://music.163.com/outchain/player?type=2&id=506259256&auto=1&height=66';
                    break;
                case 48:
                    this.webView.getComponent(WebView).url = 'https://music.163.com/outchain/player?type=2&id=1854527754&auto=1&height=66';
                    break;
                case 49:
                    this.webView.getComponent(WebView).url = 'https://music.163.com/outchain/player?type=2&id=1473981269&auto=1&height=66';
                    break;
                case 50:
                    console.log('not supposed to be here. should open a UI window.');
                    break;
                case 51:
                    this.webView.getComponent(WebView).url = 'https://app.tryeraser.com/integration/sgtest/123-abc-456?layout=canvas';
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

    fillInGuildForm(guildID: number, link1or2: number){
        if (smc.room.RoomModel.roomGuildGuideData.json[guildID].link1Type == '1') {
            this.NewWindowLinkGroup.active = false;
            this.webviewGroup.active = true;
            this.loadingAnim();
            if (link1or2 == 1) {
                console.log("link1............", smc.room.RoomModel.roomGuildGuideData.json[guildID].link1);
                this.webView.getComponent(WebView).url = smc.room.RoomModel.roomGuildGuideData.json[guildID].link1;
                smc.room.RoomModel.guildGuideStatus[guildID] = 2; //假定这个webview是第一份问卷
            } else {
                this.webView.getComponent(WebView).url = smc.room.RoomModel.roomGuildGuideData.json[guildID].link2;
                smc.room.RoomModel.guildGuideStatus[guildID] = 4; //假定这个webview是第二份问卷
            }

        } else if (smc.room.RoomModel.roomGuildGuideData.json[guildID].link1Type == '2') {
            this.NewWindowLinkGroup.active = true;
            this.webviewGroup.active = false;
            if (link1or2 == 1) {
                this.newWindowLink.getComponent(Label).string = smc.room.RoomModel.roomGuildGuideData.json[guildID].link1;
            } else {
                this.newWindowLink.getComponent(Label).string = smc.room.RoomModel.roomGuildGuideData.json[guildID].link2;
            }
            
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
                case 10:
                    oops.gui.open(UIID.Demo_npcDialog, 1); //传0有问题，所以这里公会ID+1
                case 11:
                    oops.gui.open(UIID.Demo_npcDialog, 1); //传0有问题，所以这里公会ID+1
                    break;
                case 13:
                    oops.gui.open(UIID.Demo_npcDialog, 2); //传0有问题，所以这里公会ID+1
                case 14:
                    oops.gui.open(UIID.Demo_npcDialog, 2); //传0有问题，所以这里公会ID+1
                    break;
                case 16:
                    oops.gui.open(UIID.Demo_npcDialog, 3); //传0有问题，所以这里公会ID+1
                case 17:
                    oops.gui.open(UIID.Demo_npcDialog, 3); //传0有问题，所以这里公会ID+1
                    break;
                case 19:
                    oops.gui.open(UIID.Demo_npcDialog, 4); //传0有问题，所以这里公会ID+1
                    break;
                case 21:
                    oops.gui.open(UIID.Demo_npcDialog, 5); //传0有问题，所以这里公会ID+1
                case 22:
                    oops.gui.open(UIID.Demo_npcDialog, 5); //传0有问题，所以这里公会ID+1
                    break;
                case 24:
                    oops.gui.open(UIID.Demo_npcDialog, 6); //传0有问题，所以这里公会ID+1
                case 25:
                    oops.gui.open(UIID.Demo_npcDialog, 6); //传0有问题，所以这里公会ID+1
                    break;
                case 27:
                    oops.gui.open(UIID.Demo_npcDialog, 7); //传0有问题，所以这里公会ID+1
                case 28:
                    oops.gui.open(UIID.Demo_npcDialog, 7); //传0有问题，所以这里公会ID+1
                    break;
                case 51:
                    for (var i = 0; i < smc.room.RoomModel.guildGuideStatus.length; i++) {
                        if (smc.room.RoomModel.guildGuideStatus[i] == 5) {
                            oops.gui.open(UIID.Demo_npcDialog, i + 1) //公会ID不能传0，不知道为什么
                            break;
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    }

    reset(): void {

    }
}
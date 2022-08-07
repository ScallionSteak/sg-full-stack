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
    private bookShelfUrlArr: string[] = [
        'https://v1.embednotion.com/embed/b5f2561bc43547588be2169ad8763c17',
        'https://v1.embednotion.com/embed/4af547c30c734120bfca5de465b3db65',
        'https://v1.embednotion.com/embed/b5f20fe8ba69460cba8ed3d48a2ae5cf',
        'https://v1.embednotion.com/embed/76d03686c5924ebcbc478347965c1454',
        'https://v1.embednotion.com/embed/5e4c2c2069e6403b8dfbdb560ebb8c8f',
        'https://v1.embednotion.com/embed/a446ce08945c48fb913dc724231895d0',
        'https://v1.embednotion.com/embed/57a3d80d544e4c2d8813edb01befb915',
        'https://v1.embednotion.com/embed/5ab575162e2841298fa983263b1cde28',
        'https://v1.embednotion.com/embed/618f8db630654cea8663d6fa82e5ef3b',
        'https://v1.embednotion.com/embed/d0e7dfa2d1d84905a2d621b7e31dfca3',
        'https://v1.embednotion.com/embed/eca0e3abbb5740b88dd69e61bb68aa8c',
        'https://v1.embednotion.com/embed/0536fcd98085492cb6ebcc67abb1bce6',
        'https://v1.embednotion.com/embed/d0ef0169819245e691fa63a84a3db77d',
        'https://v1.embednotion.com/embed/77f6f4a2dc674c048d2d16e4dca76cb8',
        'https://v1.embednotion.com/embed/d4a7d803fdb940e690db6c38c5408d71',
        'https://v1.embednotion.com/embed/00ad7dd7856f4e70929288efb1899c2e',
        'https://v1.embednotion.com/embed/54ac5923703a4b83b6c94e874deccd68',
        'https://v1.embednotion.com/embed/0c3d9073756c4197876f692db75bbd2f',
        'https://v1.embednotion.com/embed/ca1702b447c7401b93ea8f15410265d6',
        'https://v1.embednotion.com/embed/e7ebfa1b025443c999f4c06f4768f026',
        'https://v1.embednotion.com/embed/07e4ed0ef2c94015b662ad1e512e7edf',
        'https://v1.embednotion.com/embed/ac5b21f9c1734a9eab38743e4d918699',
        'https://v1.embednotion.com/embed/9377a465fdb146b2b37a28c934c65364',
        'https://v1.embednotion.com/embed/dc2044d8c50d4817ba90d5506e7799f2',
        'https://v1.embednotion.com/embed/d03d8619759b4730a743b94142e30335',
        'https://v1.embednotion.com/embed/a0e4b338892743de86a120286bed27f6',
        'https://v1.embednotion.com/embed/af1b6dcb970540b880f6e55457bb78ce',
        'https://v1.embednotion.com/embed/d08b7723fb784755b6d70727ee4fcdea',
        'https://v1.embednotion.com/embed/366df2d6e8e6473d9ef4514632db0f06',
        'https://v1.embednotion.com/embed/7e255d1a9e2c4c6c98c11a1be71dff7f',
        'https://v1.embednotion.com/embed/463a3ccc05304c8bba452fe6396f124f',
        'https://v1.embednotion.com/embed/8bf8c86b9aab410391f34796a69381df',
        'https://v1.embednotion.com/embed/dcc12632a22f42108e5d50f405479c24',
        'https://v1.embednotion.com/embed/500e4f1fbdf24c7baf6c6aa06bfe07c8',
        'https://v1.embednotion.com/embed/38ac9584e3bc42aea83786c5f23cc7ce',
        'https://v1.embednotion.com/embed/002607c7982f45c4a10914349706060b',
        'https://v1.embednotion.com/embed/07cb37e0e22c46be9f1d9266d9792ba6',
        'https://v1.embednotion.com/embed/6e39d2db5b78440eaec5b461cb0cca4b',
        'https://v1.embednotion.com/embed/90ac15cf7bd54255befc519207d4ed4a',
        'https://v1.embednotion.com/embed/15c6865677ea418b8c69191718932623',
        'https://v1.embednotion.com/embed/427de0b3189044e2992bcaa5d5cf855b',
        'https://v1.embednotion.com/embed/dcd1a05d424e41a7921a6cb41ee874a7'
    ];

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
                case 43:
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
                case 60:
                case 61:
                case 62:
                case 63:
                case 64:
                case 65:
                case 66:
                case 67:
                case 68:
                case 69:
                case 70:
                case 71:
                case 72:
                case 73:
                case 74:
                case 75:
                case 76:
                case 77:
                case 78:
                case 79:
                case 80:
                case 81:
                case 82:
                case 83:
                case 84:
                case 85:
                case 86:
                case 87:
                case 88:
                case 89:
                case 90:
                case 91:
                case 92:
                case 93:
                case 94:
                case 95:
                case 96:
                case 97:
                case 98:
                case 99:
                case 100:
                case 101:
                    this.webView.getComponent(WebView).url = this.bookShelfUrlArr[this.id - 60];
                    console.log(this.bookShelfUrlArr[this.id - 60]);
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
                smc.room.RoomModel.guildGuideStatus[guildID] = 2; //假定这个webview是第一份问卷
            } else {
                this.newWindowLink.getComponent(Label).string = smc.room.RoomModel.roomGuildGuideData.json[guildID].link2;
                smc.room.RoomModel.guildGuideStatus[guildID] = 4; //假定这个webview是第二份问卷
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
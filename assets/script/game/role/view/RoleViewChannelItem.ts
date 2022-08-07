/*
 * @Author: dgflash
 * @Date: 2022-04-14 17:08:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-16 10:05:54
 */
import { Animation, Component, Node, Label, UITransform, _decorator, Layout } from "cc";
import { LanguageLabel } from "../../../../../extensions/oops-framework/assets/core/gui/language/LanguageLabel";

const { ccclass, property } = _decorator;

@ccclass('RoleViewChannelItem')
export class RoleViewChannelItem extends Component {
    @property({ type: Node })
    channelName: Node = null!;
    @property({ type: Node })
    attendeeCount: Node = null!;
    @property({ type: Node })
    belongTo: Node = null!;
    @property({ type: Node })
    date: Node = null!;

    onLoad() {
    }

    initData(channelName: string, attendeeCount: string, belongTo: string, date: string) {
        this.channelName.getComponent(Label).string = channelName;
        this.attendeeCount.getComponent(Label).string = attendeeCount;
        this.belongTo.getComponent(Label).string = belongTo;
        this.date.getComponent(Label).string = date;
    }

    showChatLayer() {
        this.node.parent.parent.parent.parent.active = false; //chat channel相关的隐掉
        this.node.parent.parent.parent.parent.parent.children[0].active = true; //当中3个假头像显示出来
    }

}
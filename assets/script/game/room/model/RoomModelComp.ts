/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:45
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-21 18:22:33
 */
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { VM } from "../../../../../extensions/oops-framework/assets/libs/model-view/ViewModel";
import { Role } from "../../role/Role";

/** 房间显示数据 */
export interface IRoomVM {
    /** 服务器地址 */
    server: string,
    /** 房间名 */
    name: string,
    /** 房间可容纳的最大人数 */
    playerMax: number,
    /** 当前玩家数量 */
    playerNum: number,
    /** 延时 */
    ping: number
}

/** 房间数据 */
@ecs.register('RoomModel')
export class RoomModelComp extends ecs.Comp {
    /** 显示数据 */
    vm: IRoomVM = null!;

    /** 房间编号 */
    roomId: string = null!;
    /** 房间服务器地址 */
    serverUrl: string = null!;
    /** 玩家自己名 */
    playerName: string = null;
    /** 房间名称 */
    roomName: string = null;

    /** seedao公会引导专属，demo做法 */
    roomGuildGuideData: any;
    // guildGuideStatus: {
    //     SheJiGongHuiGuideStatus: number,
    //     ZhiLiGongHuiGuideStatus: number,
    //     TouYanGongHuiGuideStatus: number,
    //     KaiFaZheGongHuiGuideStatus: number,
    //     YiShuGongHuiGuideStatus: number,
    //     JianZhuGongHuiGuideStatus: number,
    //     XuanChuanGongHuiGuideStatus: number,
    //     ChanPinGongHuiGuideStatus: number,
    //     FanYiGongHuiGuideStatus: number,
    //     NFT_ClubGuideStatus: number
    // } = {
    //     SheJiGongHuiGuideStatus: 0,
    //     ZhiLiGongHuiGuideStatus: 0,
    //     TouYanGongHuiGuideStatus: 0,
    //     KaiFaZheGongHuiGuideStatus: 0,
    //     YiShuGongHuiGuideStatus: 0,
    //     JianZhuGongHuiGuideStatus: 0,
    //     XuanChuanGongHuiGuideStatus: 0,
    //     ChanPinGongHuiGuideStatus: 0,
    //     FanYiGongHuiGuideStatus: 0,
    //     NFT_ClubGuideStatus: 0
    // };
    guildGuideStatus: number[] = [0,0,0,0,0,0,0,0,0,0];

    /** 聊天频道的demo数据这里临时放一下 */
    channelInfoArr: { name: string, attendeeCount: string, belongTo: string, date: string }[] = [
        { name: 'SeeDAO公共频道', attendeeCount: '120', belongTo: 'SeeDAO', date: '2022/08/12' },
        { name: '产品公会治理讨论', attendeeCount: '18', belongTo: 'SeeDAO', date: '2022/08/12' },
        { name: '公会身份要怎么上链', attendeeCount: '33', belongTo: 'SeeDAO', date: '2022/08/12' },
        { name: '产品公会应该如何OB', attendeeCount: '3', belongTo: 'SeeDAO', date: '2022/08/12' },
        { name: '产品X开发如何搞事情', attendeeCount: '90', belongTo: 'SeeDAO', date: '2022/08/12' },
        { name: '产品公会', attendeeCount: '9', belongTo: 'SeeDAO', date: '2022/08/12' },
        { name: 'ACGN二次元地下基地', attendeeCount: '50', belongTo: 'SeeDAO', date: '2022/08/12' },
        { name: '游戏化社区-SG', attendeeCount: '10', belongTo: 'SeeDAO', date: '2022/08/12' },
        { name: 'NFT何去何从', attendeeCount: '99', belongTo: 'SeeDAO', date: '2022/08/12' },
        { name: 'DAO真的是未来吗', attendeeCount: '999', belongTo: 'SeeDAO', date: '2022/08/12' }
    ];
    /** channel状态demo期间这里临时存放，读取省事儿 */
    channelStatus: number = 0;
    
    /** 玩家自己 */
    owner: Role = null!;
    /** 房间所有玩家 */
    players: Map<string, Role> = new Map();

    vmAdd() {
        VM.add(this.vm, "Room");
    }

    vmRemove() {
        VM.remove("Room");
        this.vm = null;
    }

    reset(): void {
        this.vmRemove();
        this.roomId = null!;
        this.serverUrl = null!;
        this.playerName = null;
        this.owner = null;
        this.players.clear();
    }
}

/*
 * @Author: dgflash
 * @Date: 2022-05-06 10:59:28
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-19 16:41:41
 */
import { ApiCall } from "tsrpc";
import { ecs } from "../../core/ecs/ECS";
import { CommonAdminTokenComp, CommonAdminTokenSystem } from "../../module/common/bll/CommonAdminToken";
import { ReqAuth, ResAuth } from "../../tsrpc/protocols/room/admin/PtlAuth";
import { ServerRoomAuthComp, ServerRoomAuthSystem } from "./bll/ServerRoomAuth";
import { ServerRoomCheckLoginComp, ServerRoomCheckLoginSystem } from "./bll/ServerRoomCheckLogin";
import { ServerRoomDisconnectComp, ServerRoomDisconnectSystem } from "./bll/ServerRoomDisconnect";
import { ServerRoomEmptyClearComp, ServerRoomEmptyClearSystem } from "./bll/ServerRoomEmptyClear";
import { ServerRoomJoinMathServerComp, ServerRoomJoinMathServerSystem } from "./bll/ServerRoomServerJoinMatch";
import { ServerRoomServerStartComp, ServerRoomServerStartSystem } from "./bll/ServerRoomServerStart";
import { ServerRoomModelComp } from "./model/ServerRoomModelComp";

/** 房间服务器 */
export class ServerRoom extends ecs.Entity {
    ServerRoomModel!: ServerRoomModelComp;

    CommonAdminToke!: CommonAdminTokenComp;
    ServerRoomAuth!: ServerRoomAuthComp;
    ServerRoomStart!: ServerRoomServerStartComp;
    ServerRoomJoinMathServer!: ServerRoomJoinMathServerComp;
    ServerRoomCheckLogin!: ServerRoomCheckLoginComp;
    ServerRoomDisconnect!: ServerRoomDisconnectComp;
    ServerRoomEmptyClear!: ServerRoomEmptyClearComp;

    protected init() {
        this.addComponents<ecs.Comp>(
            ServerRoomModelComp
        );
    }

    /** 开启房间服务器 */
    start() {
        this.add(ServerRoomServerStartComp);
    }

    auth(call: ApiCall<ReqAuth, ResAuth>) {
        this.add(ServerRoomAuthComp).call = call;
    }
}

export class EcsServerRoomSystem extends ecs.System {
    constructor() {
        super();

        this.add(new CommonAdminTokenSystem());
        this.add(new ServerRoomAuthSystem());
        this.add(new ServerRoomServerStartSystem());
        this.add(new ServerRoomJoinMathServerSystem());
        this.add(new ServerRoomCheckLoginSystem());
        this.add(new ServerRoomDisconnectSystem());
        this.add(new ServerRoomEmptyClearSystem());
    }
}
/*
 * @Author: dgflash
 * @Date: 2022-06-24 10:13:46
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-24 21:17:26
 */
import { Message } from "../../../../../extensions/oops-framework/assets/core/common/event/MessageManager";
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { Initialize } from "../Initialize";
import { InitializeEvent } from "../InitializeEvent";

/** 游戏登录逻辑 */
@ecs.register('Login')
export class LoginComp extends ecs.Comp {
    /** 玩家帐号名 */
    username: string = null!;

    reset() {
        this.username = null!;
    }
}

export class LoginSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(LoginComp);
    }

    async entityEnter(e: Initialize) {
        this.login(e);
    }

    async login(e: Initialize) {
        let hc = e.GateNet.hc;
        let login = e.get(LoginComp);
        let retLogin = await hc.callApi(`Login`, {
            username: login.username
        });

        if (retLogin.isSucc) {
            let account = e.AccountModel;
            account.key = retLogin.res.key;
            account.username = login.username;
            e.remove(LoginComp);

            // 进入匹配大厅
            Message.dispatchEvent(InitializeEvent.Logined);
        }
        else {
            this.register(e);
        }
    }

    async register(e: Initialize) {
        let hc = e.GateNet.hc;
        let login = e.get(LoginComp);
        let retRegister = await hc.callApi(`Register`, {
            username: login.username
        });

        if (retRegister.isSucc) {
            this.login(e);
        }
    }
}
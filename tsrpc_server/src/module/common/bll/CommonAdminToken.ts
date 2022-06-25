/*
 * @Author: dgflash
 * @Date: 2022-05-11 11:28:00
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 14:30:53
 */

import { BaseServer } from "tsrpc";
import { ecs } from "../../../core/ecs/ECS";
import { Config } from "../../config/Config";

/** admin 目录下的接口，校验 adminToken */
@ecs.register('CommonAdminToken')
export class CommonAdminTokenComp extends ecs.Comp {
    server: BaseServer<any> = null!

    reset(): void {
        this.server = null!;
    }
}

export class CommonAdminTokenSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(CommonAdminTokenComp);
    }

    entityEnter(e: ecs.Entity): void {
        let comp = e.get(CommonAdminTokenComp);
        comp.server.flows.preApiCallFlow.push(call => {
            if (call.service.name.startsWith('admin/')) {
                if ((call.req as any).adminToken !== Config.adminToken) {
                    call.error('adminToken error');
                    return undefined;
                }
            }

            return call;
        });
    }
}

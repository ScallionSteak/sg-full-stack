/*
 * @Author: dgflash
 * @Date: 2022-06-24 10:09:49
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-24 21:26:09
 */
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";

/** 玩家帐号数据 */
@ecs.register('AccountModel')
export class AccountModelComp extends ecs.Comp {
    /** 唯一主键 */
    key: number = -1;
    /** 玩家名 */
    username: string = "";

    /** 数据层组件移除时，重置所有数据为默认值 */
    reset() {
        this.key = -1;
        this.username = "";
    }
}
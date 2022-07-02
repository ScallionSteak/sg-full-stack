/*
 * @Author: dgflash
 * @Date: 2022-06-24 21:11:50
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-24 21:15:21
 */
import { resLoader } from "../../../../../extensions/oops-framework/assets/core/common/loader/ResLoader";
import { AsyncQueue, NextFunction } from "../../../../../extensions/oops-framework/assets/core/common/queue/AsyncQueue";
import { oops } from "../../../../../extensions/oops-framework/assets/core/Oops";
import { ecs } from "../../../../../extensions/oops-framework/assets/libs/ecs/ECS";
import { config } from "../../common/config/Config";
import { UIID } from "../../common/config/GameUIConfig";

/** 初始化游戏公共资源 */
@ecs.register('InitRes')
export class InitResComp extends ecs.Comp {
    reset() { }
}

export class InitResSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(InitResComp);
    }

    entityEnter(e: ecs.Entity): void {
        var queue: AsyncQueue = new AsyncQueue();

        // 加载自定义资源
        this.loadCustom(queue);
        // 加载多语言包
        this.loadLanguage(queue);
        // 加载公共资源
        this.loadCommon(queue);
        // 加载游戏内容加载进度提示界面
        this.onComplete(queue);

        queue.play();

        e.remove(InitResComp);
    }

    /** 加载自定义内容（可选） */
    private loadCustom(queue: AsyncQueue) {
        queue.push(async (next: NextFunction, params: any, args: any) => {
            // 设置渠道号
            // if (config.query.channelId) SDKPlatform.setChannelId(config.query.channelId);

            // 加载多语言对应字体
            resLoader.load("language/font/" + oops.language.current, next);
        });
    }

    /** 加载化语言包（可选） */
    private loadLanguage(queue: AsyncQueue) {
        queue.push((next: NextFunction, params: any, args: any) => {
            // 设置默认语言
            let lan = oops.storage.get("language");
            if (lan == null) {
                // lan = SDKPlatform.getLanguage();
                lan = "zh";
                oops.storage.set("language", lan!);
            }

            // 设置语言包路径
            oops.language.setAssetsPath(config.game.languagePathJson, config.game.languagePathTexture);

            // 加载语言包资源
            oops.language.setLanguage(lan!, next);
        });
    }

    /** 加载公共资源（必备） */
    private loadCommon(queue: AsyncQueue) {
        queue.push((next: NextFunction, params: any, args: any) => {
            resLoader.loadDir("common", next);
        });
    }

    /** 加载完成进入游戏内容加载界面 */
    private onComplete(queue: AsyncQueue) {
        queue.complete = () => {
            // oops.gui.open(UIID.Demo_Gate);      // 打开登录界面
            oops.gui.open(UIID.Demo_Match);        // 原来的打开匹配界面，要挪到选角界面之后
            // oops.gui.open(UIID.Demo_CreateRole);    //打开选角界面，要加一个是否选过角的判断
        };
    }
}
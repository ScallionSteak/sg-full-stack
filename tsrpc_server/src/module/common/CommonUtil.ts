/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:40
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-23 10:20:52
 */

import fs from 'fs';
import path from "path";
import { ecs } from "../../core/ecs/ECS";
import { Config } from "../config/Config";

export class CommonUtil {
    /** ECS 实始化 */
    static init<T>(sys: ecs.RootSystem) {
        sys.init();

        var ms = 1000 / 1000;
        setInterval(() => {
            sys.execute(ms);
        }, ms);
    }

    /** 获取证书 */
    static getCertificate(): any {
        if (Config.https) {
            return {
                key: fs.readFileSync(path.resolve(__dirname, `../../${Config.certificate}.key`)),
                cert: fs.readFileSync(path.resolve(__dirname, `../../${Config.certificate}.crt`))
            }
        }
        return undefined;
    }
}
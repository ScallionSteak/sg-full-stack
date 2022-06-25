/*
 * @Author: dgflash
 * @Date: 2022-05-05 09:37:49
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-24 09:46:12
 */
import { CodeTemplate, TsrpcConfig } from 'tsrpc-cli';

const tsrpcConf: TsrpcConfig = {
    // 生成服务协议
    proto: [
        {
            ptlDir: 'src/tsrpc/protocols/gate',                          // 协议目录
            output: 'src/tsrpc/protocols/ServiceProtoGate.ts',           // 生成的ServiceProto的路径
            apiDir: 'src/server/gate/api',                               // API 目录
            docDir: 'docs/gate',                                         // API 文档目录
            // ptlTemplate: CodeTemplate.getExtendedPtl(),
            // msgTemplate: CodeTemplate.getExtendedMsg(),
        },
        {
            ptlDir: 'src/tsrpc/protocols/match',                         // 协议目录
            output: 'src/tsrpc/protocols/ServiceProtoMatch.ts',          // 生成的ServiceProto的路径
            apiDir: 'src/server/match/api',                              // API 目录
            docDir: 'docs/match',                                        // API 文档目录
            // ptlTemplate: CodeTemplate.getExtendedPtl(),
            // msgTemplate: CodeTemplate.getExtendedMsg(),
        },
        {
            ptlDir: 'src/tsrpc/protocols/room',                          // 协议目录
            output: 'src/tsrpc/protocols/ServiceProtoRoom.ts',           // 生成的ServiceProto的路径
            apiDir: 'src/server/room/api',                               // API 目录
            docDir: 'docs/room',                                         // API 文档目录
            ptlTemplate: CodeTemplate.getExtendedPtl(),
            // msgTemplate: CodeTemplate.getExtendedMsg(),
        },
    ],
    // 同步共享代码
    sync: [
        {
            from: 'src/tsrpc',
            to: '../assets/script/tsrpc',
            type: 'copy'                                                 // 如果您的环境不支持符号链接修改为'symlink'，否则请将此更改为'copy'
        }
    ],
    // 开发服务器
    dev: {
        autoProto: true,        // 自动服务协议
        autoSync: true,         // 文件更改时自动同步
        autoApi: true,          // 服务协议更新时自动创建API
        watch: 'src',           // 当这些文件发生更改时，重新启动dev服务器
        entry: 'src/index.ts',  // Dev server 命令：node-rts node/register{entry}
    },
    // 构建配置
    build: {
        autoProto: true,        // 构建前自动生成原型
        autoSync: true,         // 生成前自动同步
        autoApi: true,          // 生成前自动生成API
        outDir: 'dist',         // 在构建之前清理这个目录
    }
}
export default tsrpcConf;
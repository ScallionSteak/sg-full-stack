/*
 * @Author: dgflash
 * @Date: 2022-06-02 16:17:49
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-02 18:02:03
 */
module.exports = {
  apps: [
    {
      name: "match",
      script: "./dist/ServerMatch.js",
      env: {
        "NODE_ENV": "production",
        "PORT": "3000"
      },
      env_develop: {
        "NODE_ENV": "develop",
        "PORT": "3000"
      }
    },
    {
      name: "room1",
      script: "./dist/ServerRoom.js",
      env: {
        "NODE_ENV": "production",
        "PORT": "3001",
        "SERVER_URL_ROOM": "ws://47.241.9.181:3001",
        "SERVER_URL_MATCH": "http://47.241.9.181:3000/"
      },
      env_develop: {
        "NODE_ENV": "develop",
        "PORT": "3001",
        "SERVER_URL_ROOM": "ws://127.0.0.1:3001",
        "SERVER_URL_MATCH": "http://127.0.0.1:3000/"
      }
    },
    {
      name: "dataServer",
      script: "./scripts/dataServer.js",
      env: {
        "NODE_ENV": "production"
      },
      env_develop: {
        "NODE_ENV": "develop"
      }
    }
  ]
}

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
        "SERVER_URL_ROOM": "ws://43.142.65.105:3001",
        "SERVER_URL_MATCH": "http://43.142.65.105:3000/"
      },
      env_develop: {
        "NODE_ENV": "develop",
        "PORT": "3001",
        "SERVER_URL_ROOM": "ws://43.142.65.105:3001",
        "SERVER_URL_MATCH": "http://43.142.65.105:3000/"
      }
    },
    {
      name: "room2",
      script: "./dist/ServerRoom.js",
      env: {
        "NODE_ENV": "production",
        "PORT": "3002",
        "SERVER_URL_ROOM": "ws://43.142.65.105:3002",
        "SERVER_URL_MATCH": "http://43.142.65.105:3000/"
      },
      env_develop: {
        "NODE_ENV": "develop",
        "PORT": "3002",
        "SERVER_URL_ROOM": "ws://127.0.0.1:3002",
        "SERVER_URL_MATCH": "http://127.0.0.1:3000/"
      }
    }
  ]
}

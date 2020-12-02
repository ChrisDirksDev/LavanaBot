import { Client } from "discord.js";

import config from "../config.json";


let client: Client;

const initClient = () => {
  client = new Client();
  
  client.on("ready", () => {
    console.log(`Logged in as ${client.user?.username}!`);
  });
  
  client.login(config.token).then(async (res: string) => {
    if (res != undefined) {
      await sleep(60000)();
      initClient();
    }
  });

}

initClient();

//#region Util Functions
const sleep = (duration: number) => {
  return function () {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(undefined);
      }, duration);
    });
  };
};

const log = (data : string) => {
  console.log(data);
};

const randomIntFromInterval = (min : number, max : number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
//#endregion

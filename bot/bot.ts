import { Client } from "discord.js";

import config from "../config.json";


export class LevanaBot {
  client: Client | undefined;

  constructor() {
    this.client;
  }

  run = () => {
    this.initClient();
  }


  initClient = () => {
    this.client = new Client();

    this.client.on("ready", () => {
      console.log(`Logged in as ${this.client?.user?.username}!`);
    });

    this.client.login(config.token).then(async (res: string) => {
      if (res != undefined) {
        await sleep(60000)();
        this.initClient();
      }
    });
  };
}


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

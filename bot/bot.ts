import { Client, Message } from "discord.js";

import config from "../config.json";

export class LevanaBot {
  client: Client;

  constructor() {
    this.client = new Client();
  }

  run = () => {
    this.initClient();
  };

  initClient = () => {
    this.client = new Client();

    //#region Client Events
    this.client.on("ready", () => {
      console.log(`Logged in as ${this.client.user?.username}!`);
    });

    this.client.on("error", (error: Error) => {
      log("Discord js error");
      log(error.toString());
      this.client.destroy();
      this.initClient();
    });

    this.client.on("message", (msg: Message) => {
      if (config.debugMode) {
        return;
      }

      //ignore bot messages
      if (msg.author.bot) {
        return;
      }

      try {
        this.checkMessage(msg);
      } catch (err) {
        console.log(err);
      }
    });
    //#endregion

    this.client.login(config.token).then(async (res: string) => {
      if (res != config.token) {
        await sleep(60000);
        this.initClient();
      }
    });
  };

  checkMessage = async (msg: Message) => {
    msg.channel.send("HAI!");
  };
}

//#region Util Functions
const sleep = (duration: number) => {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(true);
    }, duration);
  });
};

const log = (data: string) => {
  console.log(data);
};

const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
//#endregion

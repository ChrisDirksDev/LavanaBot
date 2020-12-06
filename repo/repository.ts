const { Client } = require("pg");

interface dbConfig {
  user: string;
  host: string;
  database: string;
  password: string;
  port: string;
}

module.exports = class Repo {
  state: {
    Connected: boolean;
    RetryCooldown: number;
    ConnectionConfig: {
      user: string;
      host: string;
      database: string;
      password: string;
      port: string;
    };
    PingInterval: {};
  };
  client: any;

  constructor({ DbConnection }: { DbConnection: dbConfig }) {
    this.state = {
      Connected: false,
      RetryCooldown: Date.now(),
      ConnectionConfig: {
        user: DbConnection.user,
        host: DbConnection.host,
        database: DbConnection.database,
        password: DbConnection.password,
        port: DbConnection.port,
      },
      PingInterval: {},
    };

    this.state.PingInterval = setInterval(async () => {
      try {
        let resp = await this.ping();
        console.log(resp);
        if (resp.Error !== null || !resp.Result) {
          console.log("Connection Down. Attempting to open.");
          let resp = await this.openConnection();
          if (resp.Result) {
            console.log("Connection Established");
          } else {
            console.log(resp.Error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }, 300000);
  }

  //#region DB Connection
  async openConnection() {
    try {
      this.client = new Client({
        user: this.state.ConnectionConfig.user,
        host: this.state.ConnectionConfig.host,
        database: this.state.ConnectionConfig.database,
        password: this.state.ConnectionConfig.password,
        port: this.state.ConnectionConfig.port,
      });

      console.log("Attempting Database Connection");

      await this.client.connect();
      await this.ping();
      if (!this.state.Connected) {
        this.state.RetryCooldown = Date.now() + 300000;
      } else {
        await this.client.query("SET SCHEMA 'public'").then((res, err) => {
          if (err == null) {
            console.log("DB Schema set to 'Public'");
            this.state.Connected = true;
          } else {
            throw err;
          }
        });
      }
      return { Result: this.state.Connected, Error: null };
    } catch (error) {
      await this.closeConnection();
      return { Result: null, Error: error };
    }
  }

  async ping() {
    try {
      console.log("Ping", new Date().toLocaleTimeString());
      await this.client.query("SELECT NOW()").then((res, err) => {
        if (err == null) {
          console.log("Ping Successfull");
          this.state.Connected = true;
        } else {
          throw err;
        }
      });
      return { Result: this.state.Connected, Error: null };
    } catch (error) {
      console.log("Ping Failed");
      console.log(error);
      await this.closeConnection();
      return { Result: null, Error: error };
    }
  }

  async closeConnection() {
    try {
      await this.client.end().then(() => {
        this.state.Connected = false;
        console.log("Database Connection Closed");
      });
      return { Result: 1, Error: null };
    } catch (error) {
      this.state.Connected = false;
      console.log("Error Closing Connection", error);
      return { Result: -1, Error: error };
    }
  }
  //#endregion

  //#endregion
};

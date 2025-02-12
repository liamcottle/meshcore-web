import GlobalState from "./GlobalState.js";
import {BleConnection, Constants, SerialConnection} from "@liamcottle/meshcore.js";

class Connection {

    static async connectViaBluetooth() {
        await this.connect(await BleConnection.open());
    }

    static async connectViaSerial() {
        await this.connect(await SerialConnection.open());
    }

    static async connect(connection) {
        GlobalState.connection = connection;
        GlobalState.connection.on("connected", () => this.onConnected());
        GlobalState.connection.on("disconnected", () => this.onDisconnected());
    }

    static async disconnect() {

        // disconnect
        GlobalState.connection?.close();

        // update ui
        GlobalState.connection = null;

    }

    static async onConnected() {

        // clear previous connection state
        GlobalState.contacts = [];

        GlobalState.connection.on(Constants.PushCodes.Advert, async () => {
            console.log("Advert");
            await this.loadContacts();
        });

        GlobalState.connection.on(Constants.PushCodes.PathUpdated, async (event) => {
            console.log("PathUpdated", event);
            await this.loadContacts();
        });

        await this.loadSelfInfo();
        await this.syncDeviceTime();
        await this.loadContacts();

    }

    static async onDisconnected() {
        await this.disconnect();
    }

    static async loadSelfInfo() {
        GlobalState.selfInfo = await GlobalState.connection.getSelfInfo();
    }

    static async loadContacts() {
        GlobalState.contacts = await GlobalState.connection.getContacts();
    }

    static async syncDeviceTime() {
        const timestamp = Math.floor(Date.now() / 1000);
        await GlobalState.connection.sendCommandSetDeviceTime(timestamp);
    }

}

export default Connection;

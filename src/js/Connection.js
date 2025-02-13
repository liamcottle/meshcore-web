import GlobalState from "./GlobalState.js";
import {BleConnection, Constants, SerialConnection} from "@liamcottle/meshcore.js";
import Database from "./Database.js";
import Utils from "./Utils.js";

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

        // weird way to allow us to lock all other callbacks from doing anything, until the database is ready...
        // maybe we should use some sort of lock or mutex etc.
        // basically, we need to wait for SelfInfo to be fetched before we can init the database.
        // we use this to create a new database instance that is unique based on the devices public key.
        // initDatabase is async, which means all the other callbacks could fire before the database is ready
        // this means when we try to access the database when it isn't ready yet, we get fun errors...
        // so we need to force the callbacks to wait until the database is ready
        // we will just resolve this promise when the database is ready, and all the callbacks should be set to await it
        var onDatabaseReady = null;
        const databaseToBeReady = new Promise((resolve) => {
            onDatabaseReady = resolve;
        });

        // clear previous connection state
        GlobalState.contacts = [];

        // listen for self info, and then init database
        GlobalState.connection.once(Constants.ResponseCodes.SelfInfo, async (selfInfo) => {
            await Database.initDatabase(Utils.bytesToHex(selfInfo.publicKey));
            onDatabaseReady();
        });

        // listen for adverts
        GlobalState.connection.on(Constants.PushCodes.Advert, async () => {
            console.log("Advert");
            await databaseToBeReady;
            await this.loadContacts();
        });

        // listen for path updates
        GlobalState.connection.on(Constants.PushCodes.PathUpdated, async (event) => {
            console.log("PathUpdated", event);
            await databaseToBeReady;
            await this.loadContacts();
        });

        // listen for new message available event
        GlobalState.connection.on(Constants.PushCodes.MsgWaiting, async () => {
            console.log("MsgWaiting");
            await databaseToBeReady;
            await this.syncMessages();
        });

        // listen for message send confirmed events
        GlobalState.connection.on(Constants.PushCodes.SendConfirmed, async (event) => {
            console.log("SendConfirmed", event);
            await databaseToBeReady;
            await Database.Message.setMessageDeliveredByAckCode(event.ackCode);
        });

        // initial setup without needing database
        await this.loadSelfInfo();
        await this.syncDeviceTime();

        // wait for database to be ready
        await databaseToBeReady;

        // sync messages
        await this.loadContacts();
        await this.syncMessages();

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

    static async setAdvertName(name) {
        await GlobalState.connection.sendCommandSetAdvertName(name);
    }

    static async setRadioParams(radioFreq, radioBw, radioSf, radioCr, txPower) {
        await GlobalState.connection.sendCommandSetTxPower(txPower);
        await GlobalState.connection.sendCommandSetRadioParams(radioFreq, radioBw, radioSf, radioCr);
    }

    static async syncDeviceTime() {
        const timestamp = Math.floor(Date.now() / 1000);
        await GlobalState.connection.sendCommandSetDeviceTime(timestamp);
    }

    static async resetContactPath(publicKey) {
        await GlobalState.connection.sendCommandResetPath(publicKey);
    }

    static async removeContact(publicKey) {
        await GlobalState.connection.sendCommandRemoveContact(publicKey);
    }

    static async sendMessage(publicKey, text) {

        // send message
        const message = await GlobalState.connection.sendTextMessage(publicKey, text);

        // save to database
        return await Database.Message.insert({
            status: "sending",
            to: publicKey,
            from: GlobalState.selfInfo.publicKey,
            path_len: null,
            txt_type: Constants.TxtTypes.Plain,
            sender_timestamp: Date.now(),
            text: text,
            timestamp: Date.now(),
            expected_ack_crc: message.expectedAckCrc,
            send_type: message.result,
            error: null,
        });

    }

    static async syncMessages() {
        while(true){

            // sync messages until no more returned
            const message = await GlobalState.connection.syncNextMessage();
            if(!message){
                break;
            }

            // handle received message
            await this.onMessageReceived(message);

        }
    }

    static async onMessageReceived(message) {

        console.log("onMessageReceived", message);

        // find first contact that matches this public key prefix
        // todo, maybe use the most recently updated contact in case of collision? ideally we should be given the full hash by firmware anyway...
        const contact = GlobalState.contacts.find((contact) => {
            const messagePublicKeyPrefix = message.pubKeyPrefix;
            const contactPublicKeyPrefix = contact.publicKey.slice(0, message.pubKeyPrefix.length);
            return Utils.isUint8ArrayEqual(messagePublicKeyPrefix, contactPublicKeyPrefix);
        });

        // ensure contact exists
        // shouldn't be possible to receive a message if firmware doesn't have the contact, since keys will be missing for decryption
        // however, it could be possible that the contact doesn't exist in javascript memory when the message is received
        if(!contact){
            console.log("couldn't find contact, received message has been dropped");
            return;
        }

        await Database.Message.insert({
            status: "received",
            to: GlobalState.selfInfo.publicKey,
            from: contact.publicKey,
            path_len: message.pathLen,
            txt_type: message.txtType,
            sender_timestamp: message.senderTimestamp,
            text: message.text,
            timestamp: Date.now(),
            expected_ack_crc: null,
            error: null,
        });

    }

}

export default Connection;

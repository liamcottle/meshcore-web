import {v4} from 'uuid';
import {createRxDatabase} from 'rxdb/plugins/core';
import {getRxStorageDexie} from 'rxdb/plugins/storage-dexie';
import GlobalState from "./GlobalState.js";
import Utils from "./Utils.js";

var database = null;
async function initDatabase(publicKeyHex) {

    // close any exsiting database connection
    if(database){
        await database.close();
    }

    // create a database with a unique name per identity
    database = await createRxDatabase({
        name: `meshcore_companion_db_${publicKeyHex}`,
        storage: getRxStorageDexie(),
        allowSlowCount: true,
    });

    // add database schemas
    await database.addCollections({
        messages: {
            schema: {
                version: 0,
                primaryKey: 'id',
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        maxLength: 36,
                    },
                    status: {
                        type: 'string',
                    },
                    to: {
                        type: 'string',
                    },
                    from: {
                        type: 'string',
                    },
                    path_len: {
                        type: 'integer',
                    },
                    txt_type: {
                        type: 'integer',
                    },
                    sender_timestamp: {
                        type: 'integer',
                    },
                    text: {
                        type: 'string',
                    },
                    timestamp: {
                        type: 'integer',
                    },
                    expected_ack_crc: {
                        type: 'integer',
                    },
                    send_type: {
                        type: 'integer',
                    },
                    error: {
                        type: 'string',
                    },
                },
            }
        },
        contact_messages_read_state: {
            schema: {
                version: 0,
                primaryKey: 'id',
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        maxLength: 36,
                    },
                    timestamp: {
                        type: 'integer',
                    },
                },
            }
        },
        channel_messages: {
            schema: {
                version: 0,
                primaryKey: 'id',
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        maxLength: 36,
                    },
                    channel_idx: {
                        type: 'integer',
                    },
                    from: {
                        type: 'string',
                    },
                    path_len: {
                        type: 'integer',
                    },
                    txt_type: {
                        type: 'integer',
                    },
                    sender_timestamp: {
                        type: 'integer',
                    },
                    text: {
                        type: 'string',
                    },
                    timestamp: {
                        type: 'integer',
                    },
                },
            }
        },
    });

    // database is now ready
    GlobalState.isDatabaseReady = true;

}

class Message {

    // insert a message into the database
    static async insert(data) {
        return await database.messages.insert({
            id: v4(),
            status: data.status,
            to: Utils.bytesToHex(data.to),
            from: Utils.bytesToHex(data.from),
            path_len: data.pathLen,
            txt_type: data.txtType,
            sender_timestamp: data.sender_timestamp,
            text: data.text,
            timestamp: Date.now(),
            expected_ack_crc: data.expected_ack_crc,
            send_type: data.send_type,
            error: null,
        });
    }

    static async getMessageById(id) {
        return await database.messages.findOne({
            selector: {
                id: {
                    $eq: id,
                },
            },
        }).exec();
    }

    static async deleteMessageById(id) {
        return await database.messages.findOne({
            selector: {
                id: {
                    $eq: id,
                },
            },
        }).incrementalRemove();
    }

    // mark a message as delivered by its ack code
    static async setMessageDeliveredByAckCode(ackCode) {

        // find one latest message by ack code
        // this will prevent updating older messages that might have the same ack code
        const message = database.messages.findOne({
            selector: {
                expected_ack_crc: {
                    $eq: ackCode,
                },
            },
            sort: [
                {
                    timestamp: "desc",
                },
            ],
        });

        // patch the message state
        return await message.incrementalPatch({
            status: "delivered",
        });

    }

    // mark a message as failed by its ack code
    static async setMessageFailedById(id, reason) {

        // find one latest message by ack code
        // this will prevent updating older messages that might have the same ack code
        const message = await this.getMessageById(id);

        // do nothing if message not found
        if(!message){
            return;
        }

        // only update if still in sending state
        if(message.status !== "sending"){
            return;
        }

        // patch the message state
        await message.patch({
            status: "failed",
            error: reason,
        });

    }

    // get all messages
    static getAllMessages() {
        return database.messages.find();
    }

    // get direct messages for the provided public key
    static getContactMessages(publicKey) {
        return database.messages.find({
            selector: {
                $or: [
                    // messages from us to other contact
                    {
                        from: {
                            $eq: Utils.bytesToHex(GlobalState.selfInfo.publicKey),
                        },
                        to: {
                            $eq: Utils.bytesToHex(publicKey),
                        },
                    },
                    // messages from other contact to us
                    {
                        from: {
                            $eq: Utils.bytesToHex(publicKey),
                        },
                        to: {
                            $eq: Utils.bytesToHex(GlobalState.selfInfo.publicKey),
                        },
                    },
                ]
            },
            sort: [
                {
                    timestamp: "asc",
                },
            ],
        });
    }

    // get unread direct messages count for the provided public key
    static getContactMessagesUnreadCount(publicKey, messagesLastReadTimestamp) {
        return database.messages.count({
            selector: {
                timestamp: {
                    $gt: messagesLastReadTimestamp,
                },
                from: {
                    $eq: Utils.bytesToHex(publicKey),
                },
                to: {
                    $eq: Utils.bytesToHex(GlobalState.selfInfo.publicKey),
                },
            },
        });
    }

    // delete direct messages for the provided public key
    static async deleteContactMessages(publicKey) {
        await this.getContactMessages(publicKey).remove();
    }

}

class ContactMessagesReadState {

    // update the read state of messages for the provided public key
    static async touch(publicKey) {
        return await database.contact_messages_read_state.upsert({
            id: Utils.bytesToHex(publicKey),
            timestamp: Date.now(),
        });
    }

    // get the read state of messages for the provided public key
    static get(publicKey) {
        return database.contact_messages_read_state.findOne({
            selector: {
                id: {
                    $eq: Utils.bytesToHex(publicKey),
                },
            },
        });
    }

}

class ChannelMessage {

    // insert a channel message into the database
    static async insert(data) {
        return await database.channel_messages.insert({
            id: v4(),
            channel_idx: data.channel_idx,
            from: data.from != null ? Utils.bytesToHex(data.from) : null,
            path_len: data.path_len,
            txt_type: data.txt_type,
            sender_timestamp: data.sender_timestamp,
            text: data.text,
            timestamp: Date.now(),
        });
    }

    // get channel messages for the provided channel idx
    static getChannelMessages(channelIdx) {
        return database.channel_messages.find({
            selector: {
                channel_idx: {
                    $eq: channelIdx,
                },
            },
            sort: [
                {
                    timestamp: "asc",
                },
            ],
        });
    }

    // delete channel messages for the provided channel idx
    static async deleteChannelMessages(channelIdx) {
        await this.getChannelMessages(channelIdx).remove();
    }

}

export default {
    initDatabase,
    Message,
    ContactMessagesReadState,
    ChannelMessage,
};

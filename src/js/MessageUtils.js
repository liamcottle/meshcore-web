import GlobalState from "./GlobalState.js";
import Utils from "./Utils.js";

class MessageUtils {

    static isMessageInbound(message) {
        // inbound messages are not from us
        return message.from !== Utils.bytesToHex(GlobalState.selfInfo.publicKey);
    }

    static isMessageOutbound(message) {
        // outbound messages are from us
        return message.from === Utils.bytesToHex(GlobalState.selfInfo.publicKey);
    }

    static isMessageDelivered(message) {
        return message.status === "delivered";
    }

    static isMessageFailed(message) {
        return message.error != null;
    }

}

export default MessageUtils;

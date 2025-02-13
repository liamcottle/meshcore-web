import Utils from "./Utils.js";

class NotificationUtils {

    static async showNewMessageNotification(contact, text) {

        // request notification permission
        const result = await Notification.requestPermission();
        if(result !== "granted"){
            return;
        }

        // show notification via service worker
        if(navigator.serviceWorker){
            navigator.serviceWorker.ready.then(function(registration) {
                registration.showNotification(contact.advName, {
                    body: text,
                    icon: "/icon.png",
                    data: {
                        "vue-route-push": {
                            name: "contact.messages",
                            params: {
                                publicKey: Utils.bytesToHex(contact.publicKey),
                            },
                        },
                    },
                });
            });
        }

    }

}

export default NotificationUtils;

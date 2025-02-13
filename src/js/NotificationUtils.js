class NotificationUtils {

    static async showNotification(title, body) {

        // request notification permission
        const result = await Notification.requestPermission();
        if(result !== "granted"){
            return;
        }

        // show notification
        new window.Notification(title, {
            body: body,
            icon: "/icon.png",
        });

    }

}

export default NotificationUtils;

class NotificationUtils {

    static async showNotification(title, body) {

        // request notification permission
        const result = await Notification.requestPermission();
        if(result !== "granted"){
            return;
        }

        // show notification via service worker
        if(navigator.serviceWorker){
            navigator.serviceWorker.ready.then(function(registration) {
                registration.showNotification(title, {
                    body: body,
                    icon: "/icon.png",
                });
            });
        }

    }

}

export default NotificationUtils;

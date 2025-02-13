self.addEventListener('fetch',function() {
    // this is required to meet the requirements for an installable pwa
    // it allows the browser to ask the user if they want to install to their homescreen
});

// allow service worker to install updates without waiting force existing tabs to be closed
self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
});

// ensure we claim clients so the service worker can interact with them
self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// handle push notification click
self.addEventListener('notificationclick', function(event) {

    // dismiss it
    event.notification.close();

    // open pwa
    event.waitUntil(findClient().then((client) => {

        // if an existing client exists, focus it and then send it the notification data
        if(client){
            client.focus();
            client.postMessage({
                type: "notificationclick",
                data: event.notification.data,
            });
            return;
        }

        // otherwise open a new window
        return self.clients.openWindow("/");

    }));

});

// find any running client
const findClient = function() {
    return self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
    }).then(function(clients) {
        return clients[0];
    });
};

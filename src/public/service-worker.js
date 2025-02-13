self.addEventListener('fetch',function() {
    // this is required to meet the requirements for an installable pwa
    // it allows the browser to ask the user if they want to install to their homescreen
});

// handle push notification click
self.addEventListener('notificationclick', function(event) {

    // dismiss it
    event.notification.close();

    // open pwa
    event.waitUntil(findClient().then((client) => {

        // if an existing client exists, focus it
        if(client){
            client.focus();
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

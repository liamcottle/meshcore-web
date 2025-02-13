self.addEventListener('fetch',function() {
    // this is required to meet the requirements for an installable pwa
    // it allows the browser to ask the user if they want to install to their homescreen
});

// handle push notification click
self.addEventListener('notificationclick', function(event) {

    // dismiss it
    event.notification.close();

    // open pwa
    event.waitUntil(self.clients.openWindow("/"));

});

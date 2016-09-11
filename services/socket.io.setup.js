module.exports = function(io) {
    var app = require('express');
    var router = app.Router();

    io.on('connection', function(client) {
        console.log('Client connected...');

        client.on('join', function(data) {
            console.log(data);
        });

        client.on('messages', function(data) {
            client.emit('broad', data);
            client.broadcast.emit('broad',data);
        });

    });

    return router;
};
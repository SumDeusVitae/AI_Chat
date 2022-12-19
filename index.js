'use strict';
// Setting up express
require('dotenv').config()
const APIAI_TOKEN = process.env.APIAI_TOKEN;
const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;

const express = require('express');
const app = express();


app.use(express.static(__dirname + '/views')); // for our html file
app.use(express.static(__dirname + '/public')); // for js, css, img

const server = app.listen(5000);

const io = require('socket.io')(server);
io.on('connection', function (socket) {
    console.log('a user connected');
});
const apiai = require('apiai')(APIAI_TOKEN);

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

io.on('connection', function (socket) {
    socket.on('chat message', (text) => {
        console.log('Message: ' + text);
        // Get a reply from API.AI

        let apiaiReq = apiai.textRequest(text, {
            sessionId: APIAI_SESSION_ID
        });

        apiaiReq.on('response', (response) => {
            let aiText = response.result.fulfillment.speech;
            console.log('Bot reply: ' + aiText);
            socket.emit('bot reply', aiText); // Send the result back to the browser!
        });

        apiaiReq.on('error', (error) => {
            console.log(error);
        });

        apiaiReq.end();

    });
});

// Setting up express
const express = require('express');
const app = express();

app.use(express.static(_dirname + '/views')); // for our html file
app.use(express.static(__dirname + '/public')); // for js, css, img

const server = app.listen(5000);
app.get('/', (req, res) => {
    res.sendFile('index.html');
});
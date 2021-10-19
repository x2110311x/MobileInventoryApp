var express = require('express');
const fs = require('fs');
var app = express();


// Require any files in /calls automatically
const requests = fs.readdirSync('./calls').filter(file => file.endsWith('.js'));
for (const file of requests) {
    require(`./calls/${file}`)(app);
}

// Handle unknown requests
app.all('*', function (req, res) {
    res.status(404).send("404 - Unknown request");
});

// start Express app
var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("API listening at http://%s:%s", host, port)
 })
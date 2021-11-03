const { application } = require("express");
const fetch = require('node-fetch');

module.exports =
function login(app) {
    app.get('/tokeninfo', function (req, res) {
        const token = req.query.token;
        if (!token){
            res.sendStatus(400);
        }
        fetch('https://graph.microsoft.com/v1.0/me', {
            method: 'get',
            headers: { 'authorization': `Bearer ${token}` },
        })
        .then(response => response.json())
        .then(json => res.send(json));
    });
}
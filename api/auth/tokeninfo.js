const fetch = require('node-fetch');
const config = require("../config.json");
var express = require('express');
var router = express.Router();
var basicAuth = require('express-basic-auth');

router.use(basicAuth( { authorizer: myAuthorizer, authorizeAsync: true } ));

router.get('/', function (req, res){
    console.log("Pass");
    res.sendStatus(200);
});

/*router.get('/', function (req, res) {
    const token = req.query.token;
    if (!token){
        res.sendStatus(400);
    }
    var uid;
    var grp;
    fetch('https://graph.microsoft.com/v1.0/me', {
        method: 'get',
        headers: { 'authorization': `Bearer ${token}` },
    })
    .then(response => response.json())
    .then(json => {
        uid = json.userPrincipalName.split('@')[0];
    })
    .then(() => {
        fetch('https://graph.microsoft.com/v1.0/me/memberOf', {
            method: 'get',
            headers: { 'authorization': `Bearer ${token}` },
        })
        .then(response => response.json())
        .then(json => {
            const groups = json.value;
            for (var ugroup in groups){
                if (groups[ugroup].id == config.groups.Admin.AADID){ 
                    grp = "Admin";
                }
                if (groups[ugroup].id == config.groups.Finance.AADID){
                    grp = "Finance";

                }
                if (groups[ugroup].id == config.groups.Technician.AADID){
                    grp = "Technician";

                }
                if (groups[ugroup].id == config.groups.General.AADID) {
                    grp = "General";
                }
            }
        })
        .then(() =>{
            var respdata = {
                "uid": uid,
                "grp": grp
            };
            res.status(200).send(respdata);
            console.log("Verified Token");
        });
    })
    .catch((error) => {
        console.error(error);
        res.status(404).send("Invalid Token");
    })
});*/

function myAuthorizer(username, password, cb) {
    var uid;
    console.log("Check Token");
    fetch('https://graph.microsoft.com/v1.0/me', {
        method: 'get',
        headers: { 'authorization': `Bearer ${password}` },
    })
    .then(response => response.json())
    .then(json => {
        uid = json.userPrincipalName.split('@')[0];
        return cb(null, basicAuth.safeCompare(username, uid));
    })
    .catch((error) => {
        console.error(error);
        return false;
    })
}

module.exports = router;
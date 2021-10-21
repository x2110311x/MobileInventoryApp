const db = require("../helpers/db.js")
module.exports = 
function test(app) {
    app.get('/test', (req, res) => {
        db.testquery()
        .then(data => res.json(data)) // if successful
        .catch(err => res.status(500).json(err)); // if error
    });
}
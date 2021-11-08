const db = require("../../helpers/db");

module.exports =
function types_put(app) {
    app.put('/types/', (req, res) => {
        res.send(`Types put`);
    });
}

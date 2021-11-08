const db = require("../../helpers/db");

module.exports =
function models_put(app) {
    app.put('/models/', (req, res) => {
        res.send(`Models put`);
    });
}
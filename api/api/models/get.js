const db = require("../../helpers/db");

module.exports =
function models_get(app) {
    app.get('/models', (req, res) => {
        let pass = req.header('X-Auth');
        db(req.uid, pass, "SELECT * FROM models")
        .then((rows) =>{
            for(row in rows){
                rows[row]['url'] = `/models/${rows[row]['id']}`;
            }
            res.json(rows);
        }).catch((err)=> {
            console.error(err);
            res.status(500).send("Server Error");
        });
    });
}
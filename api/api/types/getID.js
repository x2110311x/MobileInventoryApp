const db = require("../../helpers/db");

module.exports =
function types_getID(app) {
    app.get('/types/:typeid', (req, res) => {
        let pass = req.header('X-Auth');
        db(req.uid, pass, `SELECT * FROM itemtypes WHERE typeid = ${req.params.typeid}`)
        .then((rows) =>{
            let row = rows[0];
            row['url'] = `/types/${row['typeid']}`;
            res.json(row);
        }).catch((err)=> {
            console.error(err);
            res.status(500).send("Server Error");
        });
    });
}
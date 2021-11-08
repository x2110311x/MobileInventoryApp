const db = require("../../helpers/db");

module.exports =
function companies_getID(app) {
    app.get('/companies/:companyid', (req, res) => {
        let pass = req.header('X-Auth');
        db(req.uid, pass, `SELECT * FROM companies WHERE id = ${req.params.companyid}`)
        .then((rows) =>{
            let row = rows[0];
            row['url'] = `/companies/${row['id']}`;
            res.json(row);
        }).catch((err)=> {
            console.error(err);
            res.status(500).send("Server Error");
        });
    });
}
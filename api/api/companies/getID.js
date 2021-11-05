module.exports =
function companies_getID(app) {
    app.get('/companies/:companyid', (req, res) => {
        res.send(`Company: ${req.params.companyid}`);
    });
}
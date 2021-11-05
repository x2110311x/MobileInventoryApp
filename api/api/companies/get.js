module.exports =
function companies_get(app) {
    app.get('/companies', (req, res) => {
        res.send("Companies");
    });
}
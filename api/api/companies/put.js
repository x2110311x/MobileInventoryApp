module.exports =
function companies_put(app) {
    app.put('/companies', (req, res) => {
        res.send("Companies put");
    });
}
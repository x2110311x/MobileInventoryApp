module.exports =
function companies(app) {
    app.get('/companies', (req, res) => {
        res.send("Companies");
    });
}
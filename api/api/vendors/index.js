module.exports =
function vendors(app) {
    app.get('/vendors', (req, res) => {
        res.send("Vendors");
    });
}
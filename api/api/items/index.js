module.exports =
function items(app) {
    app.get('/items', (req, res) => {
        res.send("items");
    });
}
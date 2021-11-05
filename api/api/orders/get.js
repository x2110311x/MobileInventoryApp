module.exports =
function orders_get(app) {
    app.get('/orders', (req, res) => {
        res.send("Orders");
    });
}
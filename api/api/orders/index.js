module.exports =
function orders(app) {
    app.get('/orders', (req, res) => {
        res.send("Orders");
    });
}
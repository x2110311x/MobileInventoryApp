module.exports =
function items_get(app) {
    app.get('/items', (req, res) => {
        res.send(`Order: ${req.params.orderid}'s Items`);
    });
}
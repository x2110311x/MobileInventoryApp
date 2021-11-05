module.exports =
function orders_items_get(app) {
    app.get('/orders/:orderid/items', (req, res) => {
        res.send(`Order: ${req.params.orderid}'s Items`);
    });
}
module.exports =
function orders_getID(app) {
    app.get('/orders/:orderid', (req, res) => {
        res.send(`Order: ${req.params.orderid}`);
    });
}
module.exports =
function items(app) {
    require('./get')(app);
    require('./post')(app);
}
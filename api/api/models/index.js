module.exports =
function items(app) {
    require('./get')(app);
    require('./getID')(app);
    require('./put')(app);
    require('./post')(app);
}
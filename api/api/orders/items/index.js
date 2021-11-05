module.exports =
function items(app) {
    require('./get')(app);
    require('./put')(app);
}
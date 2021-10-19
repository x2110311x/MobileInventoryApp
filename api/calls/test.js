module.exports = 
function test(app) {
    app.get('/test', (request, response) => {
        response.send("Success");
    });
}
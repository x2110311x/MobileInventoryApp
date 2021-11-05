module.exports =
function companies_user_getID(app) {
    app.get('/companies/:companyid/users/:userid', (req, res) => {
        res.send(`Company: ${req.params.companyid}'s User: ${req.params.userid}`);
    });
}
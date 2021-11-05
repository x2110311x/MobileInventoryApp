module.exports =
function companies_user_get(app) {
    app.get('/companies/:companyid/users', (req, res) => {
        res.send(`Company: ${req.params.companyid}'s Users`);
    });
}
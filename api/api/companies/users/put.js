module.exports =
function companies_users_put(app) {
    app.put('/companies/:companyid/users', (req, res) => {
        res.send(`Company: ${req.params.companyid}'s Users'`);
    });
}
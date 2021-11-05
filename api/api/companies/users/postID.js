module.exports =
function companies_user_postID(app) {
    app.post('/companies/:companyid/users/:userid', (req, res) => {
        res.send(`Company: ${req.params.companyid}'s User: ${req.params.userid}`);
    });
}
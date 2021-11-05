module.exports =
function companies_postID(app) {
    app.post('/companies/:companyid', (req, res) => {
        res.send(`Company Post: ${req.params.companyid}`);
    });
}
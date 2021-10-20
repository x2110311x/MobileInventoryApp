const mysql = require("mysql");
const config = require('../config.json');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: config.db.MYSQL_HOST,
    user: config.db.MYSQL_USER,
    password: config.db.MYSQL_PASSWORD,
    database: config.db.MYSQL_DB,
});

module.exports = {
    testquery: function testquery() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM vendors";
            pool.query(sql, function (err, results, fields) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    }
}
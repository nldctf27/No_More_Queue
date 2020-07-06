const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var mysql =  require('mysql');
var databaseConfiguration = {
	host: 'zpfp07ebhm2zgmrm.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
	port:  3306,
	user: 'cftveua7rlnj0nqk',
	password: 'hwbtzj2f3pneo045',
	database: 'ryuhfi845aulyob7'
};

var pool =  mysql.createPool(databaseConfiguration);

var app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.route('/place')
    .get((req, res) => {
        pool.getConnection(function(err, connection) {
			if (!connection) {
				res.status(500).send('Something broke!: ' + err);
				return;
            }
            
			connection.query('SELECT id, name, email FROM place', [], function(err, result, fields) {
				if(err) {
					console.error(err);
                    res.status(500).send('Something broke!: ' + err);
				}
				connection.release();
				res.send(result);
			});
		});
    })
    .post((req, res) => {
        pool.getConnection(function(err, connection) {
			if (!connection) {
				res.status(500).send('Something broke!: ' + err);
				return;
            }

            var sqlParameters = [
                req.body.name,
                req.body.email
            ];
            
            connection.query('INSERT INTO place (`Name`, `Email`) VALUES (?, ?)', sqlParameters, function(err, result, fields) {
				if(err) {
					console.error(err);
                    res.status(500).send('Something broke!: ' + err);
				}
                console.log(err);
                connection.release();
                res.send({
                    isSuccessfull: true //result.affectedRows == 1
                });
            });
		});
    });

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
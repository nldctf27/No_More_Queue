const express = require('express')
const path = require('path')
var bodyParser = require('body-parser');
var QRCode = require('qrcode')
const fs = require('fs');


const PORT = process.env.PORT || 5000
var mysql =  require('mysql');
var databaseConfiguration = {
	host: 'zpfp07ebhm2zgmrm.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
	port:  3306,
	user: 'cftveua7rlnj0nqk',
	password: 'hwbtzj2f3pneo045',
	database: 'ryuhfi845aulyob7'
};


async function CreateQrcode(text) {
	return QRCode.toDataURL(text);
}

var pool =  mysql.createPool(databaseConfiguration);

var app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended : true}));

app.route('/place').get((req, res) => {
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
	
app.route('/auth').post((request, response) => {
		pool.getConnection(function(err, connection) {
			
			if (!connection) {
				res.status(500).send('Something broke!: ' + err);
				return;
			}

			var username = request.body.username;
			console.log('username: '+username);
			var email = request.body.email;
			console.log('email: '+email);
			if (username && email) {
				
				
				var sqlParameters = [
					request.body.username,
					request.body.email
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

					//invio la mail
					//creo il QRcode
					console.log('Creo qrcode');
					// let qrcodeImg = QRCode.toDataURL(username + email);
					

					QRCode.toDataURL(username + email, function(err, url) {
						console.log('Fatto qrcode');
						console.log(url);
						//response.send("<img style='display:block; width:100px;height:100px;' id='base64image' src='"+url+"' />") ;
						
					});
					
					// let transporter = nodemailer.createTransport({
					// 	host: "smtp.ethereal.email",
					// 	port: 587,
					// 	secure: false, // true for 465, false for other ports
					// 	auth: {
					// 	  user: testAccount.user, // generated ethereal user
					// 	  pass: testAccount.pass, // generated ethereal password
					// 	},
					//   });
					// let mailOptions = {
					// 	from: 'decristofaro.nicola@gmail.com', // sender address
					// 	to: 'decristofaro.nicola@gmail.com', // list of receivers
					// 	subject: 'Test Email Node JS', // Subject line
					// 	text: 'Halo ini dari node js', // plain text body
					// 	attachDataUrls: true,
					// 	html: 'Halo ini barcodenya </br> <img src="' + qrcodeImg + '">' // html body
					// };
				
					// transporter.sendMail(mailOptions, (error, info) => {
					// 	if (error) {
					// 		return console.log(error);
					// 	}
					// 	res.render('index');
					// });
				});

			} 
			else 
			{
				response.send('Please enter Username and Password!');
				response.end();
			}
		});
	});
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
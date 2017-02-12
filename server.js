var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({type: 'application/json'}));

app.use(express.static(__dirname + '/public'));

require("./assignment/app.js")(app);

var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = 8081;

app.listen(port, ipaddress);

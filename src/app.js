const express = require('express'),
app = express(),
bodyParser = require('body-parser'),
helmet = require('helmet');


const port = process.env.PORT || 3000;

app.set('port',port);
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./routes/index')(app);

app.listen(port);
console.log('Server started on RRB:'+ port);

module.exports = app;


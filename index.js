//-=======================================================---
//------------------ Required
//-=======================================================---

var express =             require('express');
var app =                 express();

var bodyParser =          require('body-parser');
var compression =         require('compression');

//-=======================================================---
//------------------ Setup
//-=======================================================---

// find oneself
if (process.env.LOCAL) require('./keys')();

// A fix for dealing with DNS for heroku apps
if (process.env.HEROKU) app.enable('trust proxy');

// POST'ed data is at req.body
app.use(bodyParser.json());

// compress everything
app.use(compression());

//-=======================================================---
//------------------ Iftah Ya Simsim
//-=======================================================---

app.get('/robots.txt', function(req, res){
	res.sendFile('robots.txt', { root: './', maxAge: 0 });
});

app.get('/', function(req, res){
	res.sendFile('index.html', { root: 'public', maxAge: 1000 * 60 * 60 * 24 * 3 });
});

app.post('/api/contact', require('./contact-form-handler'));

app.use(express.static('public', { maxAge: process.env.LOCAL ? 0 : 1000 * 60 * 60 * 24 * 10 }));

//-=======================================================---
//------------------ Fallback Routes
//-=======================================================---

// 404
app.use(function(req, res){

	// respond with html page
	if (req.accepts('html')){
		res.redirect('/');

		return;
	}

	// respond with json
	if (req.accepts('json')){
		res.json({error: 'Not found'});

		return;
	}

	// default to plain-text
	res.type('txt').send('Not found');

});

//-=======================================================---
//------------------ Listen, server. Listen well..
//-=======================================================---

var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log('Server Up.\nPort: ' + port + '\n' + (process.env.LOCAL ? 'Process ID: ' + process.pid : ''));
});

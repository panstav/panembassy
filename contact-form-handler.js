module.exports = function(req, res){

	var url = require('url');
	var requestJson = require('request-json');

	var newTask = url.format(
		{
			pathname: 'API/v6/add_item',
			query: {
				token: process.env.TODOIST_APIKEY,
				content: req.body.name + ' <' + req.body.email + '>',
				project_id: 144693609,
				date_string: 'tomorrow',
				note: req.body.message
			}
		}
	);

	requestJson.createClient('https://todoist.com/')
		.get(newTask, function(err, response){

			if (err || response.statusCode !== 200){
				console.log(err);

				res.status(500).end();

			} else {
				res.status(200).end();
			}

		});

};
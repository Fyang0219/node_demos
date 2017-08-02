var superagent = require('superagent'),
	cheerio = require('cheerio'),
	express = require('express');

var app = express();

app.get('/', function(req, res, next) {

	// use superagent to grab 
	superagent.get('https://cnodejs.org/')
		.end(function (err, sres) {
			// handle error
			if (err) {
				return next(err);
			}

			// sres.text save html and load with cherrio to generate jquery variables
			var $ = cheerio.load(sres.text);
			var items = [];
			$('#topic_list .topic_title').each(function (idx, element) {
				var $element = $(element);
				items.push({
					title: $element.attr('title'),
					href: $element.attr('href')
				});
			});

			res.send(items);
		});


});

app.listen(3000, function() {
	console.log('app is listening at port 3000');
});
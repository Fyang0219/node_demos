var eventproxy = require('eventproxy'),
	cheerio = require('cheerio'),
	superagent = require('superagent'),
	url = require('url'),
	express = require('express');

var app = express();

var cnodeUrl = 'https://cnodejs.org/';

superagent.get(cnodeUrl)
	.end(function (err, res) {
		/* body... */
		if (err) {
			return console.error(err);
		}

		var topicUrls = [];
		var $ = cheerio.load(res.text);

		$("#topic_list .topic_title").each(function (idx, element) {
			/* body... */
			var $element = $(element);

			// url.resolve will give full url from /topic/asdlkfoeianslf
			var href = url.resolve(cnodeUrl, $element.attr('href'));

			topicUrls.push(href);
		});

		var ep = new eventproxy();

		// incase of request limites
		topicUrls = topicUrls.slice(0, 3);

		// after will listen to topicurls.length times of topic_html
		// topics is an array include 40 times ep.emit('topic_html', pair)
		ep.after('topic_html', topicUrls.length, function(topics) {

			topics = topics.map(function (topicPair) {
				
				var topicUrl = topicPair[0];
				var comment1 = topicPair[1];
				var userHtml = topicPair[3];
				var $ = cheerio.load(userHtml);

				return ({
					title: topicPair[2],
					href: topicUrl,
					comment1: comment1,
					author1: $("div.user_big_avatar").next('.dark').text().trim(),
					score1: $("div.user_profile").find('span[class=big]').text().trim(),
				});
			});

			console.log('final:');
			console.log(topics);
		});

		topicUrls.forEach(function (topicUrl) {
			superagent.get(topicUrl)
				.end(function (err, res) {

					console.log('fetch ' + topicUrl + ' successful');
					var topicHtml = res.text;

					// load the topic html 
					var $ = cheerio.load(topicHtml);
					var topicTitle = $('.topic_full_title').text().trim();
					var commenterHref = $('.author_content a').attr('href');
					var userUrl = url.resolve(cnodeUrl, commenterHref);
					var comment1 = $(".reply_content").eq(0).text().trim();

					// get user name and user points
					superagent.get(userUrl)
						.end(function (err, res) {

							// this will be callback to topics on ep.after
							ep.emit('topic_html', [topicUrl, comment1, topicTitle, res.text]);
						});
					
				});
		});
	});

app.listen(3000);


console.log('app running at port 3000');
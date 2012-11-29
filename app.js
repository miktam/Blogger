var express = require('express');
var redis = require('redis');
var db = redis.createClient();
var app = express();

app.get('/blog/post/:id', function(req, res) {
	
	res.send( 
			{
				id:	req.params.id,
				title:	'First post for get',
				body:	'Not much as the body of the blog post'
			});
});

app.get('/blog/posts', function(req, res) {
		
	res.send( 
		[ 
			{ 
				title:	'First post', 
				body:	'This post is kind of short one'
			},
			{
				title:	'Second post',
				body:	'Not much longer in second one...'
			}
		]);
});

app.listen(3000);

console.log('Blog API started on localhost:3000');


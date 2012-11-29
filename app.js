var express = require('express');
var redis = require('redis');
var db = redis.createClient();
var app = express();
var provider = require('./routes/routes');

var app = express();
module.exports = app;

app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
});

app.get('/blog/post/:id', provider.findBlogById);

app.get('/blog/posts', provider.findAllPosts);

app.post('/blog/post/create', provider.createBlogPost);

app.put('/blog/post/:id', provider.updateBlogPost);

app.delete('/blog/post/:id', provider.deleteBlogPost);

app.listen(3000);

console.log('Blog API started on localhost:3000');
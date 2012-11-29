var redis = require('redis');
var client = redis.createClient();

var postSchema = "storage:posts"

/**
 * Store post with title as a key in hash (replace " " to "-" first)
 * Stringify whole post object (title, message, and add created date) to value
 */
exports.createBlogPost = function(req, res) {

	var title = req.param('title')
	var message = req.param('message')

	var post = {
		title: title,
		message: message,
		createdAt: new Date()
	}
	var id = post.title.replace(" ", "-");

	client.hset(postSchema, id, JSON.stringify(post));

	res.send({
		title: title,
		message: message
	});

}

/**
 * Get all posts
 * Query for all keys first, then extract values, and populate res with extracted data
 */
exports.findAllPosts = function(req, res) {

	var posts = [];

	client.hgetall(postSchema, function(err, keys) {

		for(var k in keys) {
			var value = keys[k];
			var entry = JSON.parse(value);
			posts.push({
				title: entry.title,
				message: entry.message
			})
		}

		res.send(posts)
	});
};


exports.findBlogById = function(req, res) {

	res.send({
		id: req.params.id,
		title: 'First post for get',
		body: 'Not much as the body of the blog post'
	});

};



exports.updateBlogPost = function(req, res) {

	res.send({
		id: req.params.id,
		title: req.param('title'),
		message: req.param('message')
	});

};

exports.deleteBlogPost = function(req, res) {
	res.send({
		id: req.params.id
	});
};
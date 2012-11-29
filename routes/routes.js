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
		var id = post.title.replace(" ", "-")
		client.hset(postSchema, id, JSON.stringify(post))

		res.send({
			title: title,
			message: message
		});
	};

/**
 * Get all posts
 * Query for all keys first, then extract values, and populate res with extracted data
 */
exports.findAllPosts = function(req, res) {
	var posts = []
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

/**
 * Update blog post
 *
 * @param get.id it of post to update
 * @param post.title new title to insert
 * @param post.message new message to insert
 * @return updated message if found
 *		   410 otherwise
 */
exports.updateBlogPost = function(req, res) {

	var title = req.param('title')
	var message = req.param('message')

	var id = req.params.id.replace(" ", "-")
	client.hget(postSchema, id, function(err, result) {

		if(result != undefined) {

			var post = {
				title: title,
				message: message,
				createdAt: new Date()
			}

			client.hset(postSchema, id, JSON.stringify(post))

			res.send({
				title: title,
				message: message
			});

		} else {
			res.send(410)
		}
	});
};

/**
 * Delete blog post
 *
 * @param get.id it of post to delete
 * @return 200 if post was deleted
 *		   410 post not found
 */
exports.deleteBlogPost = function(req, res) {

	var id = req.params.id.replace(" ", "-")

	client.hget(postSchema, id, function(err, result) {
		if(result != undefined) {
			client.hdel(postSchema, id)
			res.send(200);

		} else {
			res.send(410)
		}
	});
};

/**
 * Create comment for post
 * Comments are stored in SET, key for the set equals title of the post
 * If author and comment body already exist for given post, they don't be duplicated as it is SET
 *
 * @param get.id post title to add comment to
 * @param post.author	author of the comment
 * @param post.comment 	comment body
 * @return 	added comment if post exists
 *			410 otherwise
 */
exports.createCommentForPost = function(req, res) {

	var author = req.param('author')
	var comment = req.param('comment')

	var commentToStore = {
		author: author,
		comment: comment
	}

	var idOfPost = req.params.id.replace(" ", "-")

	// check if post exist, if not, skip inserting
	client.hget(postSchema, idOfPost, function(err, result) {
		if(result != undefined) {
			client.sadd(idOfPost, JSON.stringify(commentToStore))
			res.send({
				author: author,
				comment: comment
			});

		} else {
			res.send(410)
		}
	});
}

/**
 * Delete comment for given post
 * Comment is deleted when author and comment body matches
 * If post does not exist, skip deleting
 *
 * @param get.id post title to delete comment from
 * @param post.author	author of the comment to delete
 * @param post.comment 	comment body to delete
 * @return 	added comment if post exists
 *			410 otherwise
 */
exports.deleteCommentForPost = function(req, res) {

	var author = req.param('author')
	var comment = req.param('comment')

	var commentToDelete = {
		author: author,
		comment: comment
	}

	var idOfPost = req.params.id.replace(" ", "-")

	// check if post exist, if not, skip deleting
	client.hget(postSchema, idOfPost, function(err, result) {
		if(result != undefined) {
			client.srem(idOfPost, JSON.stringify(commentToDelete))
			res.send(200);
		} else {
			res.send(410)
		}
	});
}
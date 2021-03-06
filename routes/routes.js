var redis = require('redis');
var client = redis.createClient();

var postSchema = "storage:posts"

/**
 * Store post with title as a key in hash (replace " " to "-" first)
 * Stringify whole post object (title, message, and add created date) to value
 *
 * @param post.title 	title of the post
 * @param post.message	body of the post
 * @return post 		created post
 */
exports.createBlogPost = function(req, res) {

		var title = req.param('title')
		var message = req.param('message')

		var post = {
			title: title,
			message: message,
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
 * @return list of all existing posts
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


/**
 * Find blog post by id
 * If comments are linked to this post, include comments as well
 *
 * @param get.id 	id of the post
 * @return post 	found post with comment if exist
 *		  			410 otherwise
 */
exports.findBlogById = function(req, res) {

	var id = req.params.id.replace(" ", "-")
	client.hget(postSchema, id, function(err, result) {

		if(result != undefined) {
			var entry = JSON.parse(result);
			var post = {
				title: entry.title,
				message: entry.message,
			}

			// check if there is connected comments for that
			client.smembers(id, function(err, comments) {

				if(result != undefined) {
					var comments = JSON.parse(comments);
				} // else there is no comments for this post
				res.send({
					post: post,
					comments: comments
				});
			});

		} else {
			res.send(410)
		}
	});

};

/**
 * Update blog post
 *
 * @param get.id 		id of the post to update
 * @param post.title 	new title to insert
 * @param post.message 	new message to insert
 * @return post 		updated post if found
 *		   				410 otherwise
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
 * @param get.id 	id of the post to delete
 * @return status	200 if post was deleted
 *		   			410 post not found
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
 * @param get.id 		post title to add comment to
 * @param post.author	author of the comment
 * @param post.comment 	comment body
 * @return comment 		added comment if post exists
 *						410 otherwise
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
 * @param get.id 		post title to delete comment from
 * @param post.author	author of the comment to delete
 * @param post.comment 	comment body to delete
 * @return comment		added comment if post exists
 *						410 otherwise
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

/**
 * Create threaded comment (comment a comment)
 * Current implementaion assumes that there is only one comment for post exist 
 * 
 * @param get.id 	 	id of post where look for comment to thread
 * @param get.commented comment which shall be commented
 * @param post.author 	author of nested comment
 * @param post.commen 	body of nested comment
 * @return combined		object with root (rott comment) and actual nested comment if post/comment exist
 *						410 otherwise
 */
exports.createCommentForComment = function(req, res) {

	var author = req.param('author')
	var comment = req.param('comment')

	var commentToStore = {
		author: author,
		comment: comment
	}

	var idOfPost = req.params.id.replace(" ", "-")
	var idOfComment = req.params.comment

	// check if post exist, if not, skip inserting
	client.hget(postSchema, idOfPost, function(err, result) {
		if(result != undefined) {

			// check if there is connected comments for that
			client.smembers(idOfPost, function(err, comments) {

				if(result != undefined) {
					var json = JSON.parse(comments);
					json = JSON.stringify(json);

					if(json == idOfComment) {
						client.sadd(idOfComment, JSON.stringify(commentToStore))
						res.send({
							root: idOfComment,
							comment: JSON.stringify(commentToStore)
						})
					}
				} // else there is no comments for this post or comment not found
				res.send(410)
			});

		} else {
			res.send(410)
		}
	});
}
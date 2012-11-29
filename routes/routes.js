exports.findAllPosts = function(req, res) {

	res.send(
	[{
		title: 'First post',
		body: 'This post is kind of short one'
	}, {
		title: 'Second post',
		body: 'Not much longer in second one...'
	}]);

};


exports.findBlogById = function(req, res) {

	res.send({
		id: req.params.id,
		title: 'First post for get',
		body: 'Not much as the body of the blog post'
	});

};

exports.createBlogPost = function(req, res) {

	var title = req.param('title')
	var message = req.param('message')
	console.log("Create Blog Post: " + title + " with message:" + message);

	res.send({
		title: title,
		message: message
	});

}

exports.updateBlogPost = function(req, res) {

	console.log('Update blog post: ' + req.params.id);
	res.send({
		id: req.params.id,
		title: req.param('title'),
		message: req.param('message')
	});

};

exports.deleteBlogPost = function(req, res) {

	console.log('Delete blog post: ' + req.params.id);
	res.send({
		id: req.params.id
	});
};
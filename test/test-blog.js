var assert = require('assert')
var app = require('../app');
var should = require('should');
var request = require('request');

var url = 'http://127.0.0.1:3000';

var blogPostTitleToCreate = 'my title';
var blogPostMessageToCreate = 'simple message body';

var blogPostTitleSecondToCreate = 'my second title';
var blogPostMessageSecondToCreate = 'second simple message body';

describe('create a blog post', function() {
	it('should return created blog post', function(done) {
		request({
			method: 'POST',
			url: url + '/blog/post/create',
			json: true,
			body: {
				title: blogPostTitleToCreate,
				message: blogPostMessageToCreate
			}
		}, function(err, res, body) {
			if(err) {
				done(err)
			} else {
				res.statusCode.should.be.equal(200)
				body.should.be.a('object')
				body.should.have.property('title')
				body.should.have.property('message')
				assert.equal(body.title, blogPostTitleToCreate, 'returned title shall be the same as submitted')
				assert.equal(body.message, blogPostMessageToCreate, 'returned message shall be the same as submitted')
				done()
			}
		})
	})
})

var commentAuthor = 'Andrei'
var commentBody = 'Simple comment'

describe('create a comment for a blog post', function() {
	it('should return created comment', function(done) {
		request({
			method: 'POST',
			url: url + '/blog/comment/create/' + blogPostTitleToCreate,
			json: true,
			body: {
				author: commentAuthor,
				comment: commentBody
			}
		}, function(err, res, body) {
			if(err) {
				done(err)
			} else {
				res.statusCode.should.be.equal(200)
				body.should.be.a('object')
				body.should.have.property('author')
				body.should.have.property('comment')
				assert.equal(body.author, commentAuthor, 'returned author shall be the same as submitted')
				assert.equal(body.comment, commentBody, 'returned message shall be the same as submitted')
				done()
			}
		})
	})
})

var rootComment = {
	author: commentAuthor,
	comment: commentBody,
}

var nestedComment = {
	author: 'another author of comment to comment',
	comment: 'another commentBody'
}

describe('create a comment for a comment', function() {
	it('should return root and nested comment', function(done) {
		request({
			method: 'POST',
			url: url + '/blog/comment/comment/' + blogPostTitleToCreate + '/' + JSON.stringify(rootComment),
			json: true,
			body: nestedComment
		}, function(err, res, body) {
			if(err) {
				done(err)
			} else {
				res.statusCode.should.be.equal(200)
				body.should.have.property('root')
				body.should.have.property('comment')
				assert.equal(body.root, JSON.stringify(rootComment), 'root element shall be equal to root comment (commented one by submitted comment)')
				done()
			}
		})
	})
})

var notExistingRootComment = {
	author: 'not existing',
	comment: 'not existing',
}

describe('create a comment for non existing comment', function() {
	it('should return 410', function(done) {
		request({
			method: 'POST',
			url: url + '/blog/comment/comment/' + blogPostTitleToCreate + '/' + JSON.stringify(notExistingRootComment),
			json: true,
			body: nestedComment
		}, function(err, res, body) {
			if(err) {
				done(err)
			} else {
				res.statusCode.should.be.equal(410)
				done()
			}
		})
	})
})

describe('create second blog post', function() {
	it('should return created blog post', function(done) {
		request({
			method: 'POST',
			url: url + '/blog/post/create',
			json: true,
			body: {
				title: blogPostTitleSecondToCreate,
				message: blogPostMessageSecondToCreate
			}
		}, function(err, res, body) {
			if(err) {
				done(err)
			} else {
				res.statusCode.should.be.equal(200)
				body.should.be.a('object')
				body.should.have.property('title')
				body.should.have.property('message')
				assert.equal(body.title, blogPostTitleSecondToCreate, 'returned title shall be the same as submitted')
				assert.equal(body.message, blogPostMessageSecondToCreate, 'returned message shall be the same as submitted')
				done()
			}
		})
	})
})

describe('list all posts', function() {
	it("should return all created posts", function(done) {
		request(url + '/blog/posts', function(err, resp, body) {
			assert.equal(resp.statusCode, 200)
			should.exist(body)
			var posts = JSON.parse(body)
			assert.equal(2, posts.length, "len shall be 2")
			var post = posts[0]
			assert.equal(post.title, blogPostTitleSecondToCreate, "title does not match")
			done()
		});
	});

});

describe('show a post', function() {
	it("return a post if exist and comment if exist", function(done) {
		request(url + '/blog/post/' + blogPostTitleToCreate, function(err, resp, body) {
			assert.equal(resp.statusCode, 200)
			var obj = JSON.parse(body)
			obj.should.be.a('object')
			obj.should.have.property('post')
			obj.should.have.property('comments')
			done()
		});
	});

});



var blogPostTitleToUpdate = 'new title'
var blogPostMessageToUpdate = 'new simple message body'

describe('update a blog post', function() {
	it('should return updated blog post', function(done) {
		request({
			method: 'PUT',
			url: url + '/blog/post/' + blogPostTitleToCreate,
			json: true,
			body: {
				title: blogPostTitleToUpdate,
				message: blogPostMessageToUpdate
			}
		}, function(err, res, body) {
			if(err) {
				done(err)
			} else {
				res.statusCode.should.be.equal(200)
				body.should.be.a('object')
				body.should.have.property('title')
				body.should.have.property('message')
				assert.equal(body.title, blogPostTitleToUpdate, 'returned title shall be the same as submitted')
				assert.equal(body.message, blogPostMessageToUpdate, 'returned message shall be the same as submitted')
				done()
			}
		})
	})
})

describe('update a non existing blog post', function() {
	it('should return error', function(done) {
		request({
			method: 'PUT',
			url: url + '/blog/post/' + 'non existing entry',
			json: true,
			body: {
				title: blogPostTitleToUpdate,
				message: blogPostMessageToUpdate
			}
		}, function(err, res, body) {
			if(err) {
				done(err)
			} else {
				res.statusCode.should.be.equal(410)
				done()
			}
		})
	})
})

describe('delete a blog post', function() {
	it('should return 200', function(done) {
		request({
			method: 'DELETE',
			url: url + '/blog/post/' + blogPostTitleSecondToCreate,
		}, function(err, res, body) {
			if(err) {
				done(err)
			} else {
				res.statusCode.should.be.equal(200)
				done()
			}
		})
	})
})

describe('delete a non-existing blog post', function() {
	it('should return 410', function(done) {
		request({
			method: 'DELETE',
			url: url + '/blog/post/' + 'blogPostIdToDeleteDoesNotExist',
		}, function(err, res, body) {
			if(err) {
				done(err)
			} else {
				res.statusCode.should.be.equal(410)
				done()
			}
		})
	})
})

describe('create a comment for a non existing blog post', function() {
	it('should return 410', function(done) {
		request({
			method: 'POST',
			url: url + '/blog/comment/create/' + 'non existing post',
			json: true,
			body: {
				author: commentAuthor,
				comment: commentBody
			}
		}, function(err, res, body) {
			if(err) {
				done(err)
			} else {
				res.statusCode.should.be.equal(410)
				done()
			}
		})
	})
})

describe('delete a comment for a blog post', function() {
	it('should return 200', function(done) {
		request({
			method: 'DELETE',
			url: url + '/blog/comment/' + blogPostTitleToCreate,
			json: true,
			body: {
				author: commentAuthor,
				comment: commentBody
			}
		}, function(err, res, body) {
			if(err) {
				done(err)
			} else {
				res.statusCode.should.be.equal(200)
				done()
			}
		})
	})
})

describe('delete a comment for a non existing post', function() {
	it('should return 200', function(done) {
		request({
			method: 'DELETE',
			url: url + '/blog/comment/' + 'non existing',
			json: true,
			body: {
				author: commentAuthor,
				comment: commentBody
			}
		}, function(err, res, body) {
			if(err) {
				done(err)
			} else {
				res.statusCode.should.be.equal(410)
				done()
			}
		})
	})
})
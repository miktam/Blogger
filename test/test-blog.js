var assert = require('assert')
var app = require('../app');
var should = require('should');
var request = require('request');

var url = 'http://127.0.0.1:3000';

describe('list all posts', function() {
	it("GET /blog/posts should respond with list of blog posts", function(done) {
		request(url + '/blog/posts', function(err, resp, body) {
			assert.equal(resp.statusCode, 200);
			should.exist(body);
			var posts = JSON.parse(body);

			assert.equal(2, posts.length, "len shall be 2");

			var firstPost = posts[0];
			assert.equal(firstPost.title, "First post", "title does not match");
			assert.equal(firstPost.body, "This post is kind of short one", "body does not match");

			done();
		});
	});

});

var blogPostIdToGet = 20;
describe('show a post', function() {
	it("GET /blog/post/:id should show a post", function(done) {
		request(url + '/blog/post/' + blogPostIdToGet, function(err, resp, body) {
			assert.equal(resp.statusCode, 200);
			var obj = JSON.parse(body);

			obj.should.be.a('object');
			obj.should.have.property('title');
			obj.should.have.property('body');
			done();
		});
	});

});


var blogPostTitleToCreate = 'my title';
var blogPostMessageToCreate = 'simple message body';

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

var blogPostTitleToUpdate = 'new title';
var blogPostMessageToUpdate = 'new simple message body';
var blogPostIdToUpdate = 10;

describe('update a blog post', function() {
	it('should return updated blog post', function(done) {
		request({
			method: 'PUT',
			url: url + '/blog/post/' + blogPostIdToUpdate,
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

var blogPostIdToDelete = 30;
describe('delete a blog post', function() {
	it('should return 200', function(done) {
		request({
			method: 'DELETE',
			url: url + '/blog/post/' + blogPostIdToDelete,
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

/*
uses supertest 
var requestS = require('supertest');
var server = require('../app');

describe('POST /blog/create', function() {
		it('responds with success', function(done) {
			requestS(server)
				.post('/blog/post/create')
				.send({title: 'my title', message: 'simple message body'})
				.end(function(err, res) {
					assert.equal(err, null);
					var body = res.body;
					assert.equal(body.result, 'success');
					done();
				});
		});
	});
*/
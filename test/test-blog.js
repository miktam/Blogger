var assert = require('assert')
var app = require('../app');
var should = require('should');
var request = require('request');
var assert = require('assert');

describe('test if server is running', function(){
	describe('GET /', function(){
		it("should respond with status 200", function(done){
			request('http://127.0.0.1:3000/', function(err,resp,body){
				assert.equal(resp.statusCode, 200);
				done(); 
				}); 
			}); 
		});

});

describe('list all posts', function(){
	describe('GET /blog/posts', function(){
		it("GET /blog/posts should respond with list of blog posts", function(done){
			request('http://127.0.0.1:3000/blog/posts', function(err,resp,body){
				assert.equal(resp.statusCode, 200);
				should.exist(body);
				var posts = JSON.parse(body);
				posts.should.be.a('array');

				
				done(); 
				}); 
			}); 
		});

});

describe('create a post', function(){
	describe('GET /blog/create', function(){
		it("GET /blog/create should create a post", function(done){
			request('http://127.0.0.1:3000/blog/create', function(err,resp,body){
				assert.equal(resp.statusCode, 200);
				done(); 
				}); 
			}); 
		});

});

describe('update a post', function(){
	describe('POST /blog/:id/update', function(){
		it("POST /blog/:id/update should update a post", function(done){
			request('http://127.0.0.1:3000/blog/:id/update', function(err,resp,body){
				assert.equal(resp.statusCode, 200);
				done(); 
				}); 
			}); 
		});

});

describe('delete a post', function(){
	describe('DELETE /blog/:id', function(){
		it("DELETE /blog/:id should delete a post", function(done){
			request('http://127.0.0.1:3000/blog/:id/delete', function(err,resp,body){
				assert.equal(resp.statusCode, 200);
				done(); 
				}); 
			}); 
		});

});

describe('show a post', function(){
	describe('GET /blog/:id', function(){
		it("GET /blog/:id should show a post", function(done){
			request('http://127.0.0.1:3000/blog/:id/', function(err,resp,body){
				assert.equal(resp.statusCode, 200);
				var obj = JSON.parse(body);
				obj.should.be.a('object');
				obj.should.have.property('title');
				obj.should.have.property('body');
				done(); 
				}); 
			}); 
		});

});

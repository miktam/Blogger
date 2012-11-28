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
	describe('GET /posts', function(){
		it("should respond with status 200", function(done){
			request('http://127.0.0.1:3000/', function(err,resp,body){
				assert.equal(resp.statusCode, 200);
				done(); 
				}); 
			}); 
		});

});

describe('another list all posts', function(){
	describe('GET /posts', function(){
		it("should respond with status 200", function(done){
			request('http://127.0.0.1:3000/', function(err,resp,body){
				assert.equal(resp.statusCode, 200);
				console.log("body:" + body);
				done(); 
				}); 
			}); 
		});

});

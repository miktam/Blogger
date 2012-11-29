var express = require('express');
var app = express();
var provider = require('./routes/routes');
module.exports = app;

app.configure(function() {
	app.use(express.bodyParser())
});

app.get('/blog/post/:id', provider.findBlogById)
app.get('/blog/posts', provider.findAllPosts)
app.post('/blog/post/create', provider.createBlogPost)
app.put('/blog/post/:id', provider.updateBlogPost)
app.delete('/blog/post/:id', provider.deleteBlogPost)

app.post('/blog/comment/create/:id', provider.createCommentForPost)
app.delete('/blog/comment/:id', provider.deleteCommentForPost)

app.listen(3000)

console.log('Blog API started on localhost:3000')
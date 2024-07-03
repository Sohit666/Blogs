const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/blog');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
    const posts = await Post.find();
    res.render('home', { posts });
});

app.get('/compose', (req, res) => {
    res.render('compose');
});

app.post('/compose', async (req, res) => {
    const { title, content } = req.body;
    const post = new Post({ title, content });
    await post.save();
    res.redirect('/');
});

app.get('/posts/:postId', async (req, res) => {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    res.render('post', { post });
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB', {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String,
};

const Article = mongoose.model("Article", articleSchema);

/////////////////////// Request Targetting all articles ///////////////////////////////

app.route("/articles")

.get(function (req, res) {
    Article.find()
        .then((err,foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }            
        });
})

.post(function (req, res) {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if (!err) {
            res.send("Article saved");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res){
    Article.deleteMany()
        .then( () => {
            res.send("Articles deleted");
        })
        .catch(err => {
            res.send(err);
        })
})

/////////////////////// Request Targetting A Specific Article ///////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){
    Article.findOne({title: req.params.articleTitle})
        .then((err, foundArticle) => {
            if (!err) {
                res.send(foundArticle);
            } else {
                res.send(err);
            }
        });
})

.put(function(req, res){
    Article.updateMany(
        {title: req.params.articleTitle},
        {$set: {title: req.body.title, content: req.body.content}},
        {overwrite: true}
    )
    .then( () => {
        res.send("Article updated");
    })
    .catch(err => {
        res.send(err);
    });
})

.patch(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        req.body
    )
    .then( () => {
        res.send("Article patched");
    })
    .catch(err => {
        res.send(err);
    });
})

.delete(function(req, res){
    Article.deleteOne({title: req.params.articleTitle})
    .then( () => {
        res.send("Article deleted");
    })
    .catch(err => {
        res.send(err);
    });
});







app.listen(3000, function (req, res) {
    console.log("Server started on port 3000");
});
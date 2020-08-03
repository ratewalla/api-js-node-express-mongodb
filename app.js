const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));


// Connect MongoDB at default port 27017.
mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true,}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.')
    } else {
        console.log('Error in DB connection: ' + err)
    }
});

const aritclesSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = new mongoose.model("Articles", aritclesSchema);


/////// GET, POST, PUT & PATCH, DELETE Routes ///////


app.route('/articles')
    .get((req, res) => {

        Article.find({},(err,articles)=>{
            if(err){
                res.send('Something went wrong.')
            } else{
                res.send(articles);
            }
        });

    })
    .post((req, res) => {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save((err)=>{
            if(!err){
                res.send('Successfully added new aritlces');
            } else{
                res.send(err);
            }
        });

    })
    .delete((req, res) => {

        Article.deleteMany({},(err)=>{
            if(!err){
                res.send('All articles deleted successfully!');
            } else{
                res.send(err);
            }
        });
        
    });


app.route('/articles/:title/')
    .get((req,res)=>{
        Article.findOne({title:req.params.title},(err,foundArticle)=>{
            if(!err){
                res.send(foundArticle);
            } else{
                res.send(err);
            }
        });
    })
    .put((req, res) => {
        Article.updateOne(
            {title:req.params.title},
            {title:req.body.title, content:req.body.content},
            {overwrite:true},
            (err)=>{
                if(!err){
                    res.send('Successfully updated record!');
                } else{
                    res.send(err);
                }
            });
    })
    .patch((req, res)=>{
        Article.updateOne(
            {title:req.params.title},
            {$set: req.body},
            (err)=>{
                if(!err){
                    res.send('Successfully updated record!');
                } else{
                    res.send(err);
                }
            });
    })
    .delete((req, res)=>{
        Article.deleteOne({title:req.params.title},(err)=>{
            if(!err){
                res.send('Successfully deleted record.');
            } else{
                res.send(err);
            }
        });
    });







app.listen(3000, () => {
    console.log('App listening on port 3000!');
});
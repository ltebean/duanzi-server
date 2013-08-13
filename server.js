var express = require('express') ;
var http = require('http'); 
var util = require("util");
var Step = require('step');
var db = require('./db.js').sharedDB;

var app=express();
app.configure(function () {
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use('/public', express.static(__dirname + '/public'));
	app.use(app.router);	
	app.use(function(err, req, res, next){
		res.send(500, { error: err.message});
	});
});

// ga config api
app.get('/duanzi/page/:page', function(req,res){
	Step(
		function getCollection(){
			db.collection('post', this); 
		},
		function findResult(err,collection){
			if (err) throw err;
			collection.find({}).sort({"_id":1}).skip(req.params.page*10).limit(10).toArray(this);;
		},
		function generateResponse(err, result){
			if (err) throw err;
			res.send(result);
		});
}); 

app.get('/duanzi/category/:categoryName/:page', function(req,res){
	Step(
		function getCollection(){
			db.collection('post', this); 
		},
		function findResult(err,collection){
			if (err) throw err;
			collection.find({
				"categoryName":req.params.categoryName
			}).sort({"_id":1}).skip(req.params.page*10).limit(10).toArray(this);;
		},
		function generateResponse(err, result){
			if (err) throw err;
			res.send(result);
		});
}); 


var server=http.createServer(app);
var port = 1998;
server.listen(port); 
console.log("server listening on port "+port);

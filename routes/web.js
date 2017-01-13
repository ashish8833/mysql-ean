//Dependency
var express = require('express');
var router = express.Router();
module.exports = function(){
	console.log("web module call");
	router.get("/",function(req,res,next){
			console.log("Login call");
	});
	
}

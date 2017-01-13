var queries = require("../modules/queries");
var md5 = require("md5");

var jwt = require('jsonwebtoken'); // use for jwt.sign
var passport = require("passport");
var JWTStrategy = require('../../config/passport-auth'); //passport-jwt Authorization Strategy

passport.use(JWTStrategy);
module.exports = function (app,cli) {
	cli.green("Connection database");
        cli.blue("Web API Call");
        app.get('/', function (req, res) {
            console.log("Login Page request");
            console.log("lgoin page call"+req);
            res.render('index');
        });
        app.get('/*', function(req, res) {
            res.sendfile('index'); // load the single view file (angular will handle the page changes on the front-end)
        });
        app.post('/login',function(req,res){
                var body = req.body;
                var $status = 404;
                var $message = "Something webnt wrong";
                queries.getUser(body,function(err,rows){
                    if(err)throw err
                    if(rows.length === 1){
                        var hash = md5(rows[0].iUserId + Math.random() + Date.now());
                        var payload = { 'token':hash,'device':'DeskTop' };
                        var token = jwt.sign(payload,"pemdas");
                        queries.setTocket({
                            'token': hash,
                            'iUserId': rows[0].iUserId,
                            'eDeviceType': 'Desktop'
                        },function (err,response) {
                            if (err) throw err;
                            cli.blue("After Insert");
                            $status = 200;
                            $message = "Success";
                            res.json({
                                'status':$status,'message':$message,'token':token
                            })
                        })
                    }else{
                        $status = 404;
                        $message = 'User not exists';
                        res.json({
                            'status': $status,
                            'message': $message
                        });
                    }
                });
            });

		    app.post('/user',passport.authenticate('jwt',{session:false}),function(req,res){
                res.json({message:"Its Work"});
            });
            cli.green("Success");

}
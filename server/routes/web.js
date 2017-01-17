var formidable = require("formidable");
var queries = require("../modules/queries");
var md5 = require("md5");
var path = require('path');
var validator = require("validator");
var jwt = require('jsonwebtoken'); // use for jwt.sign
var passport = require("passport");
var randomstring = require("randomstring");
var JWTStrategy = require('../../config/passport-auth'); //passport-jwt Authorization Strategy

passport.use(JWTStrategy);
module.exports = function (app,cli,mail) {
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

            app.post('/logout',passport.authenticate('jwt',{session:false}),function (req,res) {
                if(req.user.length > 0 ){
                    queries.logOut({
                        "iDeviceId":req.user[0].iDeviceId
                    },function (error,rows) {
		                cli.blue("Call for success");
                        res.json({
                            'status':200,
                            'message':'Logout Successfully'
                        });
                    });
                }else{
                        res.json({
                            "status":200,
                            'message':"Unauthorized"
                        })
                }
            })

            app.post('/cpass',passport.authenticate('jwt',{session:false}),function(req,res){

                if(req.user.length > 0 ){
                        var postData = {
                            "iUserId":req.user[0].iUserId,
                            "vNewPassword":req.body.vNewPassword,
                            "vOldPassword":req.body.vOldPassword
                        }
                        queries.checkPassword(postData,function(error,user){

                            if(user.length > 0){ cli.green("Password Check");
                                queries.changePassword(postData,function(error,rows){
                                    cli.green("Password Change");
                                    if (error) throw error;
                                    res.json({
                                        'status':200,
                                       'message':'Password Change Successfully.'
                                    });
                                })
                            }else{
                                res.json({
                                    'status':400,
                                    'message': 'Old password does not match.'
                                })
                            }
                        })
                    }else{
                    res.json({
                       'status':404,
                       'message':'Unauthorized'
                    });
                }

            });

            app.post('/fpass',function(req,res){
                if(validator.isEmail(req.body.vEmail) && !validator.isEmpty(req.body.vEmail)){
                    queries.checkEmail(req.body,function(err,resultOne){
                        cli.green("Check This one");
                        if(resultOne.length){
                            var pass = randomstring.generate(6);
                            var queryData = {
                                'vNewPassword':pass,
                                "vEmail":req.body.vEmail
                            }
                            queries.forgotPass(queryData,function(err,resultTwo){
                                if(err) throw  err;
                                var mailOptions = {
                                    from: '"Outrageous Pemdas" <info@pemdas.com>', // sender address
                                    to: req.body.vEmail, // list of receivers
                                    subject: 'Hello '+ resultOne[0].vFullName, // Subject line
                                    text: 'One time password for reset password : ' + pass // plaintext body
                                };
                                mail.sendMail(mailOptions,function(err,info){
                                    if(err){
                                        cli.red("Mail not send");
                                        console.log(err);
                                    }
                                });
                                res.status(200).json({
                                    'message':"Otp has been send Successfully, check mail"
                                })
                            })
                        }else{
                            res.json({
                                "status":404,
                                "message":'User not active'
                            });
                        }

                    });
                }else{
                    res.json({
                        "status":404,
                        "message":"Please fill all required value"
                    })
                }
            });

            app.post('/settings',passport.authenticate('jwt',{session:false}),function(req,res){
                cli.blue("Setting call");
                if(req.user.length > 0){
                    queries.getSettings(req,function(error,rows){
                        res.json({
                            'status':200,
                            'message':'Success',
                            'result':rows
                        })
                    });
                }else{
                    res.json({
                        "status":404,
                        "message":"Something went wrong"
                    })
                }
            });

            app.post('/settingspost',passport.authenticate('jwt',{session:false}),function(req,res){
                cli.blue("Setting call");
                if(req.user.length > 0){
                    cli.blue("PAth");


                    var form = new formidable.IncomingForm();
                    // specify that we want to allow the user to upload multiple files in a single request
                    //form.multiples = true;
                    // store all uploads in the /uploads directory
                    form.uploadDir = path.join(__dirname, '/uploads');


                    // every time a file has been uploaded successfully,
                    // rename it to it's orignal name
                    form.on('file', function(field, file) {
                        var filename = md5(new Date().getTime() + file.name + req.user[0].iUserId) + path.extname(file.name);
                        fs.rename(file.path, path.join(form.uploadDir, filename));
                        services.saveSettings([filename, field], function(err, row) {});

                    });
                    form.on('field', function(field, value) {
                        queries.saveSettings([value, field], function(err, row) {
                            if (err) throw err;
                        });
                    });

                    // log any errors that occur
                    form.on('error', function(err) {
                        //console.log('An error has occured: \n' + err);
                        res.status(404).json({
                            'message': err
                        });
                    });

                    // once all the files have been uploaded, send a response to the client
                    form.on('end', function() {
                        res.status(200).json({
                            'message': 'Settings has been updated successfully'
                        });
                    });

                    // parse the incoming request containing the form data
                    form.parse(req);

                }else{
                    res.json({
                        "status":404,
                        "message":"Something went wrong"
                    })
                }
            });

            //User Module

            app.post('/user',passport.authenticate('jwt',{session:false}),function(req,res){
                cli.blue("Its Work users");
                if(req.user.length > 0){
                    queries.getAllUser(req,function(error,rows){
                        res.json({
                            'status':200,
                            'message':'Success',
                            'result':rows
                        })
                    });
                }else{
                    res.json({
                        "status":404,
                        "message":"Something went wrong"
                    })
                }
            });

            app.post('/useroperation',passport.authenticate('jwt',{session:false}),function(req,res){
                if(!validator.isEmpty(req.body.id) && !validator.isEmpty(req.body.vOperation)){
                    if(req.user.length > 0 ){
                        if(req.body.vOperation == 'view'){
                            cli.blue("view call");
                            queries.getUserById({'id':req.body.id},function(error,rows){
                                if(rows.length > 0){
                                    res.json({
                                        'status':200,
                                        'message':'success',
                                        'result':rows
                                    });
                                }else{
                                    res.json({
                                        'status':404,
                                        'message':'User Not Found',
                                    })
                                }
                            });
                        }else if(req.body.vOperation == 'edit'){

                        }else if(req.body.vOperation == 'delete'){
                            queries.deleteUserById({'id':req.body.id},function(error,rows){
                                if(error) throw error;
                                res.json({
                                    'status':200,
                                    'message':'User deleted successfully.'
                                });
                            });
                        }
                    }else{
                        res.json({
                            "status":404,
                            "message":"Something webnt wrong"
                        })
                    }

                }else{

                    res.json({
                        "status":404,
                        "message":"Please fill all required value"
                    })

                }

            });

    }
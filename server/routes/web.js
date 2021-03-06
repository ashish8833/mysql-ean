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
    // app.get('/*', function(req, res) {
    //     res.sendfile('index'); // load the single view file (angular will handle the page changes on the front-end)
    // });
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
                "message":'User not active'
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
                "message":'User not active'
            })
        }
    });

    //User Module

    // app.post('/user',passport.authenticate('jwt',{session:false}),function(req,res){
    //     cli.blue("Its Work users");
    //     if(req.user.length > 0){
    //         queries.getAllUser(req,function(error,rows){
    //             res.json({
    //                 'status':200,
    //                 'message':'Success',
    //                 'result':rows
    //             })
    //         });
    //     }else{
    //         res.json({
    //             "status":404,
    //             "message":"Something went wrong"
    //         })
    //     }
    // });


    /**
     *  Data Table With Server Side Rendering Start
     */
    app.post('/user_list',function(req,res){
        var obj = {
            'vUserName': req.body.search.value, //Search Apply for default search text box
            'vEmail': req.body.search.value //Search Apply for default search text box
        };
        queries.ls_user_count(obj, function(err, record) {
            var iTotalRecords = parseInt(record[0].iTotalRecords);
            var iDisplayLength = parseInt(req.body.length);
            iDisplayLength = iDisplayLength < 0 ? iTotalRecords : iDisplayLength;
            var iDisplayStart = parseInt(req.body.start);
            var end = iDisplayStart + iDisplayLength;
            end = end > iTotalRecords ? iTotalRecords : end;
            var obj = {
                'limit': end,
                'offset': iDisplayStart,
                'vUserName': req.body.search.value,
                'vEmail': req.body.search.value,
                'sort':getSorting(req.body)
            };
            queries.ls_user_select(obj, function(err, users) {
                if (err) return err;
                var i = 0;
                var records = {};
                records['draw'] = req.body.draw;
                records['recordsTotal'] = iTotalRecords;
                records['recordsFiltered'] = iTotalRecords;
                records['data'] = [];
                for (var key in users) {
                    // var status = '<input bs-switch ng-model="'+users[i].eStatus+'" value="'+users[i].eStatus+'" class="switch-small" type="checkbox" ng-true-value="&apos;y&apos;" ng-false-value="&apos;n&apos;" ng-change="onUserStatusChange(&apos;'+users[i].eStatus+'&apos;,'+users[i].iUserId+')">';
                    var operation = '<button ng-click="userOperation('+users[i].iUserId+',&quot;view&quot;)" title="View"  class="btn btn-success btn-xs">View</button>';
                    operation+= '<button ng-click="userOperation('+users[i].iUserId+',&quot;edit&quot;)" title="Edit"  class="btn btn-warning  btn-xs">Edit</button>';
                    operation+= '<button ng-click="userOperation('+users[i].iUserId+',&quot;delete&quot;)" title="Delete"  class="btn btn-danger  btn-xs">Delete</button>';
                    records['data'][i] = {"iUserId":users[i].iUserId,"vUserName":users[i].vUserName,"vEmail":users[i].vEmail,"eStatus":users[i].eStatus,"vOperation":operation};
                    i++;
                }
                res.json(records);
            });
        });

    });
    /**
     *  Data Table With Server Side Rendering End
     */

    app.post('/useradd',passport.authenticate('jwt',{session:false}),function (req,res) {
        if(req.user.length > 0){
            cli.blue("Check Email");
            cli.blue(validator.isEmail(req.body.vEmail));
            if(!validator.isEmpty(req.body.vFullName) && validator.isEmail(req.body.vEmail)){
                checkUser(req.body.vEmail,function(error,isActive){
                    if(error) throw error;
                    if(isActive.length > 0){
                        res.json({
                            "status":404,
                            "message":"User already available"
                        });
                    }else{
                        var vPassword = randomstring.generate(6);
                        queries.addUser({"vFullName":req.body.vFullName,"vUserName":req.body.vEmail,"vEmail":req.body.vEmail,"vPassword":vPassword},function(err,rows){
                            if(err) throw err;
                            if(rows.affectedRows > 0){
                                //Send Mail
                                var mailOptions = {
                                    from: '"Pemdas" <info@pemdas.com>', // sender address
                                    to: req.body.vEmail, // list of receivers
                                    subject: 'Hello '+ req.body.vFullName, // Subject line
                                    text: 'One time password  : ' + vPassword // plaintext body
                                };
                                mail.sendMail(mailOptions,function(err,info){
                                    if(err){
                                        cli.red("Mail not send");
                                        console.log(err);
                                    }
                                });
                                //Send mail end


                                res.json({
                                    "status":200,
                                    "message":"User Insert Successfully."
                                });
                            }else{
                                res.json({
                                    "status":400,
                                    "message":"Something went wrong"
                                });
                            }
                        });
                    }
                });
            }else{
                res.json({
                    "status":404,
                    "message":"Please fill all required value"
                });
            }
        }else{
            res.json({
                "status":404,
                "message":'User not active'
            })
        }

    });
    app.post('/useroperation',passport.authenticate('jwt',{session:false}),function(req,res){
        if(!validator.isEmpty(req.body.id) && !validator.isEmpty(req.body.vOperation)){
            cli.blue("inside");
            console.log("Inside");
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
                    if(!validator.isEmpty(req.body.vFullName)){
                        cli.green("Edit call");
                        cli.red(req.body.id);
                        queries.updateUserById({'id':req.body.id,'vFullName':req.body.vFullName},function(err,rows){
                            if(err) throw err;
                            res.status(200).json({
                                'message':'User update successfully'
                            });
                        });
                    }else{
                        res.json({
                            "status":404,
                            "message":"Please fill all required value"
                        });
                    }
                }else if(req.body.vOperation == 'delete'){
                    queries.deleteUserById({'id':req.body.id},function(error,rows){
                        if(error) throw error;
                        res.json({
                            'status':200,
                            'message':'User deleted successfully.'
                        });
                    });
                }else if(req.body.vOperation == 'status'){
                    if(!validator.isEmpty(req.body.eStatus+'')){
                        queries.changeUserStatusById({'id':req.body.id,'status':req.body.eStatus},function(error,rows){
                            if(error) throw error;
                            res.json({
                                'status':200,
                                'message':'User status change successfully'
                            });
                        });
                    }else{
                        res.json({
                            "status":404,
                            "message":"Please fill all required value"
                        })
                    }
                } else{
                    res.json({
                        "status":404,
                        "message":"Please fill all required value"
                    })
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

    // User Module End


    //Question Module Start
    /**
     * Getting List of Questions
     */
    app.post('/question',passport.authenticate('jwt',{session:false}),function(req,res){
        cli.blue("Its Work users");
        if(req.user.length > 0){
            queries.listQuestion(req,function(error,rows){
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




    app.post('/list_q',function (req,res) {
        var obj = {
            'vModeName':req.body.search.value,
            'eType':req.body.search.value
        };
        queries.ls_question_count(obj,function(err,record){
            if(err) throw err;
            var iTotalRecords = parseInt(record[0].iTotalRecords);
            var iDisplayLength = parseInt(req.body.length);
            iDisplayLength = iDisplayLength < 0 ? iTotalRecords : iDisplayLength;
            var iDisplayStart = parseInt(req.body.start);
            var end = iDisplayStart + iDisplayLength;
            end = end > iTotalRecords ? iTotalRecords : end;
            var obj = {
                'limit': end,
                'offset': iDisplayStart,
                'vModeName':req.body.search.value,
                'eType':req.body.search.value,
                'sort':getSorting(req.body)
            }
            queries.ls_question_select(obj,function(err,question){
                if(err) throw err;
                var i = 0;
                var records = {};
                records['draw'] = req.body.draw;
                records['recordsTotal'] = iTotalRecords;
                records['recordsFiltered'] = iTotalRecords;
                records['data'] = [];
                for(i=0;i<question.length;i++){
                    var operation = '<button ng-click="qOperation('+question[i].iQuestionId+',&quot;view&quot;)" title="View"  class="btn btn-success btn-xs">View</button>';
                    operation+= '<button ng-click="qOperation('+question[i].iQuestionId+',&quot;edit&quot;)" title="Edit"  class="btn btn-warning  btn-xs">Edit</button>';
                    operation+= '<button ng-click="qOperation('+question[i].iQuestionId+',&quot;delete&quot;)" title="Delete"  class="btn btn-danger  btn-xs">Delete</button>';
                    records['data'][i] = {"iQuestionId":question[i].iQuestionId,
                        "vModeName":question[i].vModeName,
                        "eType":question[i].eType,
                        "vQuestion":question[i].vQuestion,
                        "vAnswer":question[i].vAnswer,
                        "eStatus":question[i].eStatus,
                        "operation":operation
                    };
                }
                res.json(records);
            })
        });
    });

    /**
     *  Question Operation View,Status,Delete
     */
    app.post('/questionoperation',passport.authenticate('jwt',{session:false}),function(req,res){
        cli.blue("Its Work users");
        if(req.user.length > 0){
            if(!validator.isEmpty(req.body.vOperation) && !validator.isEmpty(req.body.iQuestionId)){
                if(req.body.vOperation == 'status'){
                    queries.statusQuestion({"iQuestionId":req.body.iQuestionId,"eStatus":req.body.eStatus},function(err,rows){
                        if(err) throw err;
                        if(rows.affectedRows > 0){
                            res.json({
                                'status':200,
                                'message':'Question status change successfully'
                            });
                        }else{
                            res.json({
                                "status":404,
                                "message":"Something went wrong"
                            })
                        }
                    });
                }else if(req.body.vOperation == 'view'){
                    queries.viewQuestion({"iQuestionId":req.body.iQuestionId},function(err,rows){
                        if(err) throw  err;
                        if(rows.length > 0){
                            res.json({
                                'status':200,
                                'message':'success',
                                'result':rows
                            })
                        }else{
                            res.json({
                                "status":404,
                                "message":"Something went wrong"
                            });
                        }
                    });
                }else if(req.body.vOperation == 'delete'){
                    queries.deleteQuestion({"iQuestionId":req.body.iQuestionId},function(err,rows){
                        if(err) throw err;
                        if(rows.affectedRows > 0){
                            res.json({
                                'status':200,
                                'message':'Question deleted successfully.'
                            });
                        }else{
                            res.json({
                                "status":404,
                                "message":"Something went wrong"
                            });
                        }
                    });
                }else{
                    res.json({
                        "status":404,
                        "message":"Please fill all required value"
                    });
                }

            }else{
                res.json({
                    "status":404,
                    "message":"Please fill all required value"
                })
            }
        }else{
            res.json({
                "status":404,
                "message":"Something went wrong"
            })
        }
    });
    /**
     *  Question Operation View,Status,Delete Emd
     */

    /**
     * BEGIN Question Edit Operation
     */
    app.post('/questionedit',passport.authenticate('jwt',{session:false}),function(req,res){
        if(req.user.length > 0){
            if(!validator.isEmpty(req.body.question.eType)){
                if(req.body.question.eType == "MCQ"){
                    if(!validator.isEmpty(req.body.question.iAnswerId+"") &&
                        !validator.isEmpty(req.body.question.vModeName) &&
                        !validator.isEmpty(req.body.question.iQuestionId) &&
                        !validator.isEmpty(req.body.question.vQuestion) &&
                        req.body.options.length == 4 &&
                        !validator.isEmpty(req.body.options[0].iAnswerId+"") &&
                        !validator.isEmpty(req.body.options[0].vAnswer) &&
                        !validator.isEmpty(req.body.options[1].iAnswerId+"") &&
                        !validator.isEmpty(req.body.options[1].vAnswer) &&
                        !validator.isEmpty(req.body.options[2].iAnswerId+"") &&
                        !validator.isEmpty(req.body.options[2].vAnswer) &&
                        !validator.isEmpty(req.body.options[3].iAnswerId+"") &&
                        !validator.isEmpty(req.body.options[3].vAnswer)){

                        queries.updateQuestion({
                            "iAnswerId":req.body.question.iAnswerId,
                            "vModeName":req.body.question.vModeName,
                            "iQuestionId":req.body.question.iQuestionId,
                            "vQuestion":req.body.question.vQuestion,
                            "eType":"MCQ"
                        },function (err,rows) {
                            if(err) throw err;
                            if(rows.affectedRows > 0){

                                for(i =0;i<req.body.options.length;i++){
                                    queries.updateAnswer({
                                        "iAnswerId":req.body.options[i].iAnswerId,
                                        "vAnswer":req.body.options[i].vAnswer
                                    },function (error, row) {
                                        if(error) throw error;
                                    })
                                }
                                res.json({
                                    "status":200,
                                    "message":"Update Successfully."
                                })
                            }else{
                                res.json({
                                    "status": 404,
                                    "message": "Something went wrong"
                                });
                            }
                        });

                    }else{
                        res.json({
                            "status": 404,
                            "message": "Please fill all required value"
                        });
                    }
                }else{
                    cli.blue("VSQ call");
                    if(!validator.isEmpty(req.body.question.iAnswerId+"") &&
                        !validator.isEmpty(req.body.question.vModeName) &&
                        !validator.isEmpty(req.body.question.iQuestionId) &&
                        !validator.isEmpty(req.body.question.vQuestion) &&
                        req.body.options.length == 1 &&
                        !validator.isEmpty(req.body.options[0].iAnswerId+"") &&
                        !validator.isEmpty(req.body.options[0].vAnswer)){
                        cli.blue("VSQ Done");

                        queries.updateQuestion({
                            "iAnswerId":req.body.question.iAnswerId,
                            "vModeName":req.body.question.vModeName,
                            "iQuestionId":req.body.question.iQuestionId,
                            "vQuestion":req.body.question.vQuestion,
                            "eType":"VSQ"
                        },function(err,row){
                            if(err) throw err;
                            cli.blue("update question");
                            if(row.affectedRows > 0){
                                queries.updateAnswer({
                                    "iAnswerId":req.body.options[0].iAnswerId,
                                    "vAnswer":req.body.options[0].vAnswer
                                },function (error, row) {
                                    if(error) throw error;
                                    cli.blue("update answer");
                                    if(row.affectedRows > 0){
                                        res.json({
                                            "status":200,
                                            "message":"Update Successfully."
                                        })
                                    }else{
                                        res.json({
                                            "status": 404,
                                            "message": "Something went wrong"
                                        });
                                    }
                                })
                            }else{
                                res.json({
                                    "status": 404,
                                    "message": "Something went wrong"
                                });
                            }

                        });

                    }else{
                        cli.blue("VSQ required");
                        res.json({
                            "status": 404,
                            "message": "Please fill all required value"
                        });
                    }
                }
            }else{
                res.json({
                    "status":404,
                    "message":"Please fill all required value"
                });
            }
        }else{
            res.json({
                "status":404,
                "message":"User not exsits"
            })
        }
    });

    /**
     * END Question Edit Operation
     */


    /**
     * BEGIN Question Add Operataion
     */
    app.post('/questionadd',passport.authenticate('jwt',{session:false}),function(req,res){
        if(req.user.length > 0){
            if(!validator.isEmpty(req.body.question.eType)){
                if(req.body.question.eType == "MCQ"){
                    if(
                        !validator.isEmpty(req.body.question.vModeName) &&
                        !validator.isEmpty(req.body.question.vQuestion) &&
                        req.body.options.length == 4 &&
                        !validator.isEmpty(req.body.options[0].vAnswer) &&
                        !validator.isEmpty(req.body.options[0].isAnswer.toString()) &&
                        !validator.isEmpty(req.body.options[1].vAnswer) &&
                        !validator.isEmpty(req.body.options[1].isAnswer.toString()) &&
                        !validator.isEmpty(req.body.options[2].vAnswer) &&
                        !validator.isEmpty(req.body.options[2].isAnswer.toString()) &&
                        !validator.isEmpty(req.body.options[3].vAnswer) &&
                        !validator.isEmpty(req.body.options[3].isAnswer.toString())){
                        var tempiQuestionId = "";
                        queries.insertQuestion({
                            "vModeName":req.body.question.vModeName,
                            "vQuestion":req.body.question.vQuestion,
                            "eType":req.body.question.eType,
                        },function(err,row){
                            if(err) throw err;
                            if(row.insertId > 0){
                                tempiQuestionId = row.insertId;
                                for(var i = 0;i<req.body.options.length;i++){
                                    if(req.body.options[i].isAnswer == true){
                                        queries.insertAnswer({
                                            "iQuestionId":row.insertId,
                                            "vAnswer":req.body.options[i].vAnswer
                                        },function(err,info){
                                            if(err) throw err;
                                            if(info.insertId > 0){
                                                queries.updateAfterInsertQuestion({
                                                    "iAnswerId":info.insertId,
                                                    "iQuestionId":tempiQuestionId
                                                },function (errors,details) {
                                                    if(errors) throw errors;
                                                });
                                            }else{
                                                res.json({
                                                    "status": 404,
                                                    "message": "Something went wrong"
                                                });
                                            }
                                        });
                                    }else{
                                        queries.insertAnswer({
                                            "iQuestionId":row.insertId,
                                            "vAnswer":req.body.options[i].vAnswer
                                        },function(err,info){
                                            if(err) throw err;
                                        });
                                    }
                                }
                                res.json({
                                    "status":200,
                                    "message":"Question inserted successfully."
                                });
                            }else{
                                res.json({
                                    "status": 404,
                                    "message": "Something went wrong"
                                });
                            }
                        })
                    }else{
                        res.json({
                            "status": 404,
                            "message": "Please fill all required value"
                        });
                    }
                }else{
                    cli.blue("VSQ call");
                    if(!validator.isEmpty(req.body.question.vModeName) &&
                        !validator.isEmpty(req.body.question.vQuestion) &&
                        req.body.options.length == 1 &&
                        !validator.isEmpty(req.body.options[0].vAnswer)){
                        var tempiQuestionId = "";
                        queries.insertQuestion({
                            "vModeName":req.body.question.vModeName,
                            "vQuestion":req.body.question.vQuestion,
                            "eType":req.body.question.eType,
                        },function(err,row){
                            if(err) throw err;
                            if(row.insertId > 0){
                                tempiQuestionId = row.insertId;

                                queries.insertAnswer({
                                    "iQuestionId":row.insertId,
                                    "vAnswer":req.body.options[0].vAnswer
                                },function(err,info){
                                    if(err) throw err;
                                    if(info.insertId > 0){
                                        queries.updateAfterInsertQuestion({
                                            "iAnswerId":info.insertId,
                                            "iQuestionId":tempiQuestionId
                                        },function (errors,details) {
                                            if(errors) throw errors;
                                            if(details.affectedRows > 0){
                                                res.json({
                                                    "status":200,
                                                    "message":"Question inserted successfully."
                                                });
                                            }else{
                                                res.json({
                                                    "status": 404,
                                                    "message": "Something went wrong"
                                                });
                                            }
                                        });
                                    }else{
                                        res.json({
                                            "status": 404,
                                            "message": "Something went wrong"
                                        });
                                    }
                                });

                            }else{
                                res.json({
                                    "status": 404,
                                    "message": "Something went wrong"
                                });
                            }
                        })

                    }else{
                        res.json({
                            "status": 404,
                            "message": "Please fill all required value"
                        });
                    }
                }
            }else{
                res.json({
                    "status":404,
                    "message":"Please fill all required value"
                });
            }
        }else{
            res.json({
                "status":404,
                "message":"User not exsits"
            })
        }
    });



    /**
     * END Question Add Operataion
     */


    /**
     * BEGIN List Mcq question
     */

    app.post('/list_mcq',function (req,res) {
        var obj = {
            'vModeName':req.body.search.value,
            'eType':req.body.search.value
        };
        queries.ls_mcq_count(obj,function(err,record){
            if(err) throw err;
            var iTotalRecords = parseInt(record[0].iTotalRecords);
            var iDisplayLength = parseInt(req.body.length);
            iDisplayLength = iDisplayLength < 0 ? iTotalRecords : iDisplayLength;
            var iDisplayStart = parseInt(req.body.start);
            var end = iDisplayStart + iDisplayLength;
            end = end > iTotalRecords ? iTotalRecords : end;
            var obj = {
                'limit': end,
                'offset': iDisplayStart,
                'vModeName':req.body.search.value,
                'eType':req.body.search.value,
                'sort':getSorting(req.body)
            }
            queries.ls_mcq_select(obj,function(err,question){
                if(err) throw err;
                var i = 0;
                var records = {};
                records['draw'] = req.body.draw;
                records['recordsTotal'] = iTotalRecords;
                records['recordsFiltered'] = iTotalRecords;
                records['data'] = [];
                for(i=0;i<question.length;i++){
                    var operation = '<button ng-click="qOperation('+question[i].iQuestionId+',&quot;view&quot;)" title="View"  class="btn btn-success btn-xs">View</button>';
                    operation+= '<button ng-click="qOperation('+question[i].iQuestionId+',&quot;edit&quot;)" title="Edit"  class="btn btn-warning  btn-xs">Edit</button>';
                    operation+= '<button ng-click="qOperation('+question[i].iQuestionId+',&quot;delete&quot;)" title="Delete"  class="btn btn-danger  btn-xs">Delete</button>';
                    records['data'][i] = {"iQuestionId":question[i].iQuestionId,
                        "vModeName":question[i].vModeName,
                        "eType":question[i].eType,
                        "vQuestion":question[i].vQuestion,
                        "vAnswer":question[i].vAnswer,
                        "eStatus":question[i].eStatus,
                        "operation":operation
                    };
                }
                res.json(records);
            })
        });
    });


    /**
     * END List Mcq question
     */

    /**
     * Generate Exam Start
     */

    app.post('/generate_exam',passport.authenticate('jwt',{session:false}),function(req,res){
        /***
         * vTitle,vDescription
         */
        console.log(req.body.vTitle);
        req.checkBody("vTitle","Ttile must be required").notEmpty();
        req.checkBody("vDescription","Description must be required").notEmpty();
        var validatorError = req.validationErrors();
        req.getValidationResult().then(function(result) {
            if (!result.isEmpty()) {
                res.json({
                    "status": 404,
                    "message": "Please fill all required value",
                    "Data":result.mapped()
                });
            }else{
                queries.insert_exam({vTitle:req.body.vTitle,vDescription:req.body.vDescription},function(err,rows){
                    var iExamId  = rows.insertId;
                    queries.insert_exam_schedule({"iExamId":iExamId},function(err,result){
                        var iScheduleId = result.insertId;
                        res.json({
                            'status':200,
                            'message':'Success',
                            'data':{
                                "iExamId":iExamId,
                                "iScheduleId":iScheduleId
                            }
                        })
                    });
                });
            }
        });

    });

    /**
     * Generate Exam Close
     */



}

/**
 * Magic happen for data table sorting function
 * @param req
 * @returns {*}
 */
function getSorting(req) {
    var i = 0;
    var vSort = [];
    for (i = 0; i < req.order.length; i++) {
        vSort.push(req.columns[req.order[i].column].name + ' ' + req.order[i].dir);
    }
    return vSort.toString();
}

/**
 * Check Email Available or not
 * @param vEmail
 * @param cb
 */
function checkUser(vEmail,cb){
    queries.checkEmail({'vEmail':vEmail},cb);
}
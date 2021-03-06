var cli = require("../../config/config").console;
var queries = require("./queries");
var async = require("async");
var user = []; //List of OneLine User
var examUser = []; //List of Exam User
module.exports = function(app,io){
    io.on('connection', function(socket){

        socket.on('joinGame',function(data,fn){
            queries.getUserById({'id':data.iUserId},function(err,rows){
                if(err) throw err;
                user.push({
                    'socket':socket.id,
                    'iUserId':rows[0].iUserId,
                    'vFullName':rows[0].vFullName,
                    'vUserName':rows[0].vUserName,
                    'vEmail':rows[0].vEmail,
                    'isActive':false
                });
                //list of user send to angular application
                io.sockets.emit('listUser',{data:user});
            });
            fn({"message":"You are in watting state",'status':200,'socket':socket.id});
        });
        io.sockets.emit('listUser',{data:user}); //Angularjs List of Active User.



        socket.on('examUser',function(data){ //Angularjs
            cli.red("examUser");
            examUser = data.examUser;
            cli.blue(examUser);
            io.sockets.emit('examUser',data); //Unity
        });

        socket.on('ReadyForExam',function(data,fn){ //Unity
            cli.red("ReadyForExam");
            socket.join('Exam_Room');
            fn({"message":"Wait for some moment",'status':200,'socket':socket.id,'room':'Exam_Room'});
        });

        socket.on('startGame',function(startGameData){ //Angularjs
            cli.red("startGame");
            console.log(startGameData);
            queries.get_mcq_by_Ids({"iQuestionId":startGameData.examQuestion},function(err,rows){
                console.log(rows);
                var i = 0;
                var examPaper = [];
                while(i < rows.length){
                    var temp = {};
                    temp.Question = {
                        "iQuestionId":rows[i].iQuestionId,
                        "vQuestion":rows[i].vQuestion
                    };
                    temp.Answers = [];
                    for(var j = 0; j < 4; j ++){
                        temp.Answers.push({
                            "iAnswerId":rows[i].iAnswerId,
                            "vAnswer":rows[i].vAnswer
                        });
                        i++;
                    }
                    examPaper.push(temp);
                }
                console.log("Exam Paper");
                cli.blue(JSON.stringify(examPaper));
                // io.sockets.in(socket.id).emit('giveQuestion',{"data":examPaper,"iParticipantId":iParticipantId});
                startGameData.examQuestion = examPaper;
                async.forEachOf(startGameData.examUser,function(value,key,cb){
                    console.log(value);
                    console.log(key);
                    if(startGameData.examUser[key].isActive == true){
                        queries.insert_exam_participant({iScheduleId:startGameData.iScheduleId,iUserId:startGameData.examUser[key].iUserId},function (err,result) {
                            var iParticipantId = result.insertId;
                            cli.blue(iParticipantId);
                            startGameData.examUser[key].iParticipantId = iParticipantId;
                            cli.blue(JSON.stringify(startGameData));
                            cb();
                        });
                    }
                },function(err){
                    cli.blue("Callback call");
                    console.log("call back call");
                    cli.red(JSON.stringify(startGameData));
                    io.sockets.in('Exam_Room').emit('startGame',{data:startGameData});
                });
            });



            // queries.get_mcq_by_Ids({"iQuestionId":exam.Questions},function(err,rows){
            //     cli.red("Question List");
            //     console.log(rows);
            //     var tempIQuestionId = 0;
            //     var i = 0;
            //     var examPaper = [];
            //     while(i < rows.length){
            //         var temp = {};
            //         temp.Question = {
            //             "iQuestionId":rows[i].iQuestionId,
            //             "vQuestion":rows[i].vQuestion
            //         };
            //         temp.Answers = [];
            //         for(var j = 0; j < 4; j ++){
            //             temp.Answers.push({
            //                 "iAnswerId":rows[i].iAnswerId,
            //                 "vAnswer":rows[i].vAnswer
            //             });
            //             i++;
            //         }
            //         examPaper.push(temp);
            //     }
            //     console.log("Exam Paper");
            //     cli.blue(JSON.stringify(examPaper));
            //     io.sockets.in(socket.id).emit('giveQuestion',{"data":examPaper,"iParticipantId":iParticipantId});
            // });

            // io.sockets.in('Exam_Room').emit('giveQuestion',{"data":examPaper,"iParticipantId":iParticipantId});
        });

        //Disconnected Logic
        socket.on('disconnect',function (data){
            cli.red("disconnect "+socket.id);
            cli.red(getIndexUser(socket.id));
            if(getIndexUser(socket.id) != null){
                cli.blue("not null");
                if(user.length > 0){
                    user.splice(getIndexUser(socket.id),1);
                    // examUser.splice(getIndexUser(socket.id),1)
                }
                //list of user send to angular application
                io.sockets.emit('listUser',{data:user});
            }
            cli.green(JSON.stringify(user));
            cli.blue(JSON.stringify(examUser));
        });


    });
};

function getIndexUser(socketId){
    cli.blue("user lenght"+user.length);
    for(var i=0; i<user.length;i++){
        cli.blue("user deleted");
        cli.blue(i);
        cli.blue(user[i].socket);
        if(user[i].socket === socketId){
            cli.red(i);
            return i;
        }
    }
}

var db = require("./connection");
var cli = require("../../config/config").console;
var md5 = require("md5");
var dateFormat = require("dateformat"); //dateFormat(new Date(),"yyyy-mm-dd HH:mm:ss"); Currnet date time
var Users = {
    getUser:function(body,callback){
        return db.query("SELECT *  FROM `tbl_users` WHERE `vEmail` = ? AND `vPassword` = ?",[body.vEmail,md5(body.vPassword)],callback);
    },
    setTocket:function(body,callback){
        console.log("setTocken call");
        return db.query("INSERT INTO tbl_user_devices (iUserId,vAuthToken,eDeviceType) VALUES (?,?,?)",[body.iUserId, body.token, body.eDeviceType], callback);
    },
    authenticate: function(body, cb){
        console.log("authentications call");
        db.query("SELECT u.iUserId,d.iDeviceId FROM tbl_users as u INNER JOIN tbl_user_devices as d ON (d.iUserId = u.iUserId) WHERE d.vAuthToken = ? AND u.eStatus = ? AND d.eDeviceType = ?",[body.token,'y',body.device],cb);
    },
    logOut:function (body,cb) {
        console.log("Loug Out Call");
        db.query("DELETE FROM tbl_user_devices WHERE iDeviceId = ?",[body.iDeviceId],cb);
    },
    checkPassword:function(body,cb){

        db.query("SELECt * FROM tbl_users where iUserId = ? AND vPassword = ?",[body.iUserId,md5(body.vOldPassword)],cb);
    },
    changePassword:function(body,cb){
        console.log("Change PAssword call");
        console.log(body);
        db.query("UPDATE tbl_users SET vPassword = ? WHERE iUserId = ?",[md5(body.vNewPassword),body.iUserId],cb);
    },
    checkEmail:function(body,cb){
        db.query("SELECT * FROM tbl_users WHERE vEmail = ? AND eStatus = ?",[body.vEmail,'y'],cb);
    },
    forgotPass:function(body,cb){
        db.query("UPDATE tbl_users SET vPassword = ? WHERE vEmail = ?",[md5(body.vNewPassword),body.vEmail],cb);
    },
    getAllUser:function(body,callback){
        db.query('SELECT * FROM tbl_users WHERE eStatus != "d" AND vUserType = "user"',callback);
    },
    getSettings: function(body,cb){
        db.query("SELECT * FROM mst_site_settings WHERE eEditable = ? ORDER BY iFieldId",['y'], cb);
    },
    saveSettings : function(params, cb){
        db.query("UPDATE mst_site_settings SET vValue = ? WHERE iFieldId = ?", params, cb);
    },
    getUserById:function(body,cb){
      db.query("SELECT * FROM tbl_users WHERE iUserId = ?",[body.id],cb);
    },
    deleteUserById:function(body,cb){
        db.query("UPDATE tbl_users SET eStatus = ? WHERE iUserId = ?",['d',body.id],cb);
    },
    changeUserStatusById:function(body,cb){
        db.query("UPDATE tbl_users SET eStatus = ? WHERE iUserId = ?",[body.eStatus,body.id],cb);
    },
    updateUserById:function(body,cb){
        db.query("UPDATE tbl_users SET vFullName = ?, dLastActivity = ? WHERE iUserId = ? ",[body.vFullName,dateFormat(new Date(),"yyyy-mm-dd HH:mm:ss"),body.id],cb);
    },
    addUser:function (body,cb) {
        db.query("INSERT INTO tbl_users (vUserType,vFullName,vUserName,vEmail,vPassword,eStatus,dLastActivity,dCreatedDate) VALUES (?,?,?,?,?,?,?,?)",['user',body.vFullName,body.vUserName,body.vEmail,md5(body.vPassword),'y',dateFormat(new Date(),"yyyy-mm-dd HH:mm:ss"),dateFormat(new Date(),"yyyy-mm-dd HH:mm:ss")],cb);
    },
    //QUESTION MODULE START
    listQuestion:function(body,cb){
        db.query("SELECT tbl_questions.*,tbl_answers.vAnswer FROM tbl_questions JOIN tbl_answers ON tbl_answers.iAnswerId = tbl_questions.iAnswerId WHERE tbl_questions.eStatus != 'd'",cb);
    },
    viewQuestion:function(body,cb){
        db.query("SELECT tbl_questions.vModeName,tbl_questions.eType,tbl_questions.vQuestion,tbl_questions.dUpdatedDate,tbl_answers.vAnswer, IF(tbl_questions.iAnswerId = tbl_answers.iAnswerId,'y','n') as vRightAns FROM tbl_questions JOIN tbl_answers ON tbl_answers.iQuestionId = tbl_questions.iQuestionId WHERE tbl_questions.eStatus = 'y' AND tbl_questions.iQuestionId = ?  ORDER BY vRightAns DESC",body.iQuestionId,cb);
    },
    //QUESTION MODULE END
    statusQuestion:function(body,cb){
       db.query("UPDATE tbl_questions SET eStatus = ? WHERE iQuestionId = ?",[body.eStatus,body.iQuestionId],cb);
    },
    deleteQuestion:function(body,cb){
        db.query("DELETE FROM tbl_answers WHERE iQuestionId = ?",[body.iQuestionId]);
        db.query("DELETE FROM tbl_questions WHERE iQuestionId = ?",[body.iQuestionId],cb);
    },
    sr_user_count: function(body, cb){
        var sWhere = "";
        var aWhere = ['user','d'];
        if(typeof body.vUserName != 'undefined' && body.vUserName != "")
        {
            sWhere += ' AND vUserName LIKE ?';
            aWhere.push('%'+body.vUserName+'%');
        }
        if(typeof body.vEmail != "undefined" && body.vEmail != "")
        {
            sWhere += ' AND vEmail LIKE ?';
            aWhere.push('%'+body.vEmail+'%');
        }
        db.query("SELECT COUNT(*) as iTotalRecords FROM tbl_users WHERE vUserType = ? AND eStatus != ? "+sWhere,aWhere,cb);
    },
    sr_user_select: function(body, cb){
        var sWhere = "";
        var aWhere = ['user','d'];
        var sort = 'vUserName ASC';
        if(typeof body.vUserName != 'undefined' && body.vUserName != "")
        {
            sWhere += ' AND vUserName LIKE ?';
            aWhere.push('%'+body.vUserName+'%');
        }
        if(typeof body.vEmail != "undefined" && body.vEmail != "")
        {
            sWhere += ' AND vEmail LIKE ?';
            aWhere.push('%'+body.vEmail+'%');
        }
        db.query("SELECT iUserId, vUserName, vEmail FROM tbl_users WHERE vUserType = ? AND eStatus != ? "+sWhere+" LIMIT "+body.offset+", "+body.limit,aWhere,cb);
    }
};
module.exports = Users;


var db = require("./connection");
var cli = require("../../config/config").console;
var md5 = require("md5");
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
        db.query("SELECT * FROM tbl_users WHERE vEmail = ?",[body.vEmail],cb);
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
    updateUserById:function(body){
        //db.query();
    }

};
module.exports = Users;


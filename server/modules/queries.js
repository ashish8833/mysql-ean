var db = require("./connection");
var cli = require("../../config/config");
var Users = {
    getUser:function(body,callback){
        return db.query("SELECT *  FROM `tbl_users` WHERE `vEmail` = ? AND `vPassword` = ?",[body.vEmail,body.vPassword],callback);
    },
    setTocket:function(body,callback){
        console.log("setTocken call");
        return db.query("INSERT INTO tbl_user_devices (iUserId,vAuthToken,eDeviceType) VALUES (?,?,?)",[body.iUserId, body.token, body.eDeviceType], callback);
    },
    authenticate: function(body, cb){
        console.log("authentications call");
        db.query("SELECT u.iUserId,d.iDeviceId FROM tbl_users as u INNER JOIN tbl_user_devices as d ON (d.iUserId = u.iUserId) WHERE d.vAuthToken = ? AND u.eStatus = ? AND d.eDeviceType = ?",[body.token,'y',body.device],cb);
    },
};
module.exports = Users;


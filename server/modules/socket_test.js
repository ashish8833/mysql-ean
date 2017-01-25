var cli = require("../../config/config").console;
module.exports = function(app,io){
    io.on('connection', function(socket){
        console.log(socket);
        cli.blue("User Socket Connected");
        console.log('a user connected inside the socket file');

        socket.on("GTS",function(data){
            console.log(data);
            cli.blue("Game to server")
        });
        socket.emit("STG",{"msg":"Server to Game"});
    });
}

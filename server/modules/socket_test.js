var cli = require("../../config/config").console;
var roomno = 1;
var user = [];
module.exports = function(app,io){
    io.on('connection', function(socket){
        console.log(socket.id);
        user.push(socket.id);
        cli.blue("User Socket Connected");
        console.log('a user connected inside the socket file');

        socket.on("GTS",function(data){
            console.log(data);
            cli.blue("Game to server")
        });
        cli.blue(JSON.stringify(io.nsps['/'].adapter.rooms["room-"+roomno]));
        if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 4){
            console.log("new room created");
            cli.blue(JSON.stringify(io.nsps['/'].adapter.rooms["room-"+roomno]));
            roomno++;
        }
        socket.join("room-"+roomno);
        io.sockets.in("room-"+roomno).emit("connectToRoom","You are in room no "+roomno);
        socket.on('disconnect',function (data){
            console.log("Socket discunnected");
        });

        socket.emit("STG",{"msg":"Server to Game"});
        cli.green(user);
        cli.blue(JSON.stringify(socket.adapter.rooms));
    });
}

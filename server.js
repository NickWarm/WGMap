/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 2014/12/27
 * Time: 下午 8:29
 * To change this template use File | Settings | File Templates.
 */

var express = require('express'),
    http = require('http'),
    app = express();
app.use(express.static(__dirname + '/public'));
var server = http.createServer(app).listen(8007);
console.log("Server has started, http://localhost:8007")

console.log("Ricky Wang's IP:140.135.8.176 , please vist http://140.135.8.176:8007/index.html")
var io = require('socket.io'),
    io = io.listen(server);














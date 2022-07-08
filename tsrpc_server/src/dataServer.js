var express = require('express');
var mysql = require('mysql');
var multer = require('multer');
var fs = require('fs');
const { userInfo } = require('os');
var bodyParser = require('body-parser');
var app = express();
var str = "";
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

var connection = mysql.createConnection({
    host:'127.0.0.1',
    port:'3306',
    user:'root',
    password:'abc123',
    database:'sg'
});
connection.connect();
console.log("don't worry. this is working.");

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "content-type, accept");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json");
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
    next();
});

app.listen(3009);

function insertUserConfig(userInfo) {
    var sql = "INSERT INTO userconfig(ID, username, walletAddress, userModel) VALUES (?,?,?,?)";
    connection.query(sql, [0, userInfo.username, userInfo.walletAddress, userInfo.userModel], function (err, result) {
        if (err) {
            console.log('[update error]:', err.message);
        }
        str = JSON.stringify(result);
        console.log("print result", result); //look up result from the DB
    });
}

app.get('/getSomething', function (req, res) {
    console.log("req.query =======", req.query);
    //get要用req.query（待核实，但post要用req.body）
    var walletAddress = req.query.walletAddress;
    walletAddress = walletAddress.replace("?", "");
    walletAddress = "'" + walletAddress + "'";
    res.send(str);
});

var destination = 'image/'; //创建文件夹
//将图片放到服务器
var storage = multer.diskStorage({
    // 如果你提供的 destination 是一个函数，你需要负责创建文件夹
    destination,
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, file.originalname);
    }
});
var upload = multer({
    storage: storage
});

app.post('/postImg', upload.any(), function (req, res, next) {
    //拼接文件上传后的路径
    var url = destination + '/';
    res.json({
        code: true,
        msg: '上传成功',
        imageUrl: url
    })

});

app.get('/lastPaintByWallet', function (req, res) {
    var walletAddress = req.query.walletAddress;
    walletAddress = walletAddress.replace("?", "");
    res.sendFile("D:/GIT/MetaEquity/artcity_server/image/" + walletAddress + ".png");
});

app.get('/sampleUser', function (req, res) {
    var response = {
        id: 1,
        name: "test",
        age: 20
    };
    res.send(JSON.stringify(response));
});

app.post('/insertUserConfig', upload.any(), function (req, res, next) {
    insertUserConfig(req.body);

});

app.post('/queryUserConfigByWalletAddress', upload.any(), function (req, res, next) {
    //get要用req.query（待核实，但post要用req.body）
    var walletAddress = req.body.walletAddress;
    console.log("wallet from dataserver", req.body);
    // walletAddress = "'" + walletAddress + "'";
    var sql = "select * from userconfig where walletaddress = '" + walletAddress + "';";
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('[select error]:', err.message);
        }
        console.log("this is the query result ========================", result);
        if (JSON.stringify(result).length > 2) {
            str = '1';
        } else {
            str = '0';
        }
        res.send(str);
    });
});
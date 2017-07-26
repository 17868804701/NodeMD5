/**
 * Created by 黄森 on 2017/7/26.
 */
var express = require('express');
var bodyParser = require('body-parser');
var db = require('./model/db.js');
var md5 = require('./model/md5.js');
var ejs = require('ejs');
var app = express();

//bodyParser API
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('./public'));

//设置模板引擎
app.set("view engine", "ejs");

app.get('/register',function (req,res) {
   res.render('register');
});
app.get('/login',function (req,res) {
    res.render('login');
});
// 执行注册
app.post('/doRegister',function (req,res) {
   var username = req.body.username;//获取用户输入的username
   var password = req.body.password;//获取用户输入的password
   password = md5(password);//加密后的password
   db.insertOne("user",{
         "username":username,
         "password":password
   },function (err,result) {
         if(err){
            res.send('-1')
         }
         res.send('1')
   })
});

// 登录操作
app.post('/login',function (req,res) {
    var username = req.body.username;
    var password = req.body.password;
    password = md5(password);//用户输入完，加密后的password
    db.find("user",{"username":username},function (err,result) {
       console.log(result[0].password);
        if(result.length==0){
           res.send('用户不存在')
        } else if(result[0].password==password){   //数据库与用户输入的比对
            res.send("1");
        }else {
            res.send('-999');
        }
    })
});

app.listen(3000);
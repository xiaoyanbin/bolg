
var express = require('express');
var swig = require('swig');
var mongoose = require('mongoose');
//加载 bodeyparser
var bodyParser = require('body-parser');
var Cookies = require('cookies');

var app =express();

var User = require('./models/User');


//设置静态文件托管
app.use('/public',express.static(__dirname + '/public'));

//加载模板模块
app.engine('html',swig.renderFile)
//设置模板目录第一个参数固定
app.set('views','./views');
// 注册所有使用模板引擎 第一个参数必须是view engine
app.set('view engine','html');

swig.setDefaults({cache: false});

app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req,res,next){
    req.cookies = new Cookies(req,res);
    //解析登录用户的cookie信息
	req.userInfo ={};
	if(req.cookies.get('userInfo')){
           try{
               req.userInfo = JSON.parse(req.cookies.get('userInfo'));
               //获取当前登录用户类型
               User.findById(req.userInfo._id).then(function(userInfo){
                    req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                    next();
               })
           }catch(e){
           	   next();
           }
           


	}else{
		 next();
	}
    
});

app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

mongoose.connect('mongodb://localhost:27017/test',function(err){
     if(err){
            console.log("数据库链接失败");
     }else{
          console.log("数据库链接成功");
          app.listen(8081);
     }
});


//监听访问


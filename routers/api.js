var express = require("express");
var router = express.Router();
var User = require("../models/User");
var Content = require("../models/Content");
//统一返回格式
var responseData;

router.use(function(req, res, next){
	responseData = {
		code: 0,
		message: ''
	}
	next();
})
//用户注册
router.post('/user/register', function(req, res, next){
      
      var username =  req.body.username;
      var password =  req.body.password;
      var repassword =  req.body.repassword;
      if(username=="" || password==""){
            responseData.code =1;
            responseData.message ="用户名或密码不能为空";
            res.json(responseData);
            return;
      }
      if(password!=repassword){
            responseData.code =3;
            responseData.message ="两次输入的密码不一致";
            res.json(responseData);
            return;
      }      
      //用户名是否被注册
      User.findOne({
      	   username: username
      }).then(function(userInfo){
           
           if(userInfo){
             responseData.code =3;
             responseData.message ="用户名已经存在";
             res.json(responseData);
             return
           }

           //保存数据
           var user = new User({username:username,password:password});
           return user.save();
      }).then(function(newUserInfo){
            responseData.code =4;
            responseData.message ="注册成功";
            res.json(responseData);
      })


      
});

//用户登录
router.post('/user/login', function(req, res, next){
      
      var username =  req.body.username;
      var password =  req.body.password;
      if(username=="" || password==""){
            responseData.code =1;
            responseData.message ="用户名或密码不能为空";
            res.json(responseData);
            return;
      }  
      //用户名是否被注册
      User.findOne({
           username: username,
           password: password
      }).then(function(userInfo){
           
           if(!userInfo){
             responseData.code =3;
             responseData.message ="用户名或密码错误";
             res.json(responseData);
             return
           }
            console.log(userInfo);
             responseData.message ="登录成功";
             responseData.userInfo = {
                "_id":userInfo._id, 
                "username":userInfo.username
             }

             req.cookies.set('userInfo',JSON.stringify({
                "_id":userInfo._id, 
                "username":userInfo.username            
             }));
             res.json(responseData);
             return       
           
      })


      
});
//退出
router.post('/user/logout', function(req, res, next){
         req.cookies.set('userInfo',null);
         res.json(responseData);
})

//评论提交  
router.post('/comment/post', function(req, res, next){
         var contentId = req.body.contentid || '';
         var postData = {
            username: req.userInfo.username,
            postTime: new Date(),
            content: req.body.content
         }
         //cha
         Content.findOne({
           _id: contentId
         }).then(function(content){
                content.comments.push(postData);
                return content.save();
         }).then(function(newContent){
            responseData.message = '评论成功';
            responseData.data = newContent;
            res.json(responseData)
         })
})

router.get('/comment', function(req, res, next){
         var contentId = req.query.contentid || '';

         Content.findOne({
           _id: contentId
         }).then(function(content){
            responseData.message = '评论成功';
            responseData.data = content;
            res.json(responseData)
         })
})


module.exports = router;
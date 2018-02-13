

var express = require('express');
var router = express.Router();

var User = require("../models/User");
var Category = require("../models/Category");
var Content = require("../models/Content");
router.use(function(req,res,next){
	 if(!req.userInfo.isAdmin){
	 	res.send("对不起，只要管理员能登陆");
	 	return;
	 }
     next();
})

router.get('/', function(req, res, next){
      res.render('admin/index',{userInfo : req.userInfo});
});

//用户管理
// limit()
// skip(2) 
// 
router.get('/user', function(req, res, next){
      var page = Number(req.query.page) || 1;
      var limit = 10;
      var pages = 0;
      User.count().then(function(count){
      	      pages = Math.ceil(count / limit);
      	      page = Math.min(page , pages);
      	      page = Math.max(page , 1);
      	      var skip = (page -1)*limit;
			  User.find().limit(limit).skip(skip).then(function(users){
			      res.render('admin/user_index',{
			      	userInfo : req.userInfo,
			      	users: users,
			      	count: count,
			      	pages: pages,
			      	limit: limit,
			      	page: page,
              typeName: "user"
			      });
			  })
      });
});
//分类首页
router.get('/category', function(req, res, next){
      var page = Number(req.query.page) || 1;
      var limit = 10;
      var pages = 0;
      Category.count().then(function(count){
      	      pages = Math.ceil(count / limit);
      	      page = Math.min(page , pages);
      	      page = Math.max(page , 1);
      	      var skip = (page -1)*limit;
			  Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categorys){
			      res.render('admin/category_index',{
			      	userInfo : req.userInfo,
			      	categorys: categorys,
			      	count: count,
			      	pages: pages,
			      	limit: limit,
			      	page: page,
              typeName: "category"
			      });
			  })
      });        


});
//分类首添加
router.get('/category/add', function(req, res, next){
        res.render('admin/category_add',{
             userInfo: req.userInfo
        })
});
//分类首添加保存
router.post('/category/add', function(req, res, next){
       var name = req.body.name || '';
       if(name == ''){
       	  res.render('admin/error',{
       	  	  userInfo: req.userInfo,
       	  	  message:"分类名称不能为空"
       	  });
       	  return;
       }
       //数据库中是否已存在相同名称
       Category.findOne({
       	  name:name
       }).then(function(rs){
       	  if(rs){
	       	  res.render('admin/error',{
	       	  	  userInfo: req.userInfo,
	       	  	  message:"分类已经存在"
	       	  });	 
	       	  return Promise.reject(); 	
       	  }else{
              //
              return new Category({
              	 name: name
              }).save();

       	  }
       }).then(function(newCategory){
	       	  res.render('admin/success',{
	       	  	  userInfo: req.userInfo,
	       	  	  message:"分类保存成功",
	       	  	  url: '/admin/Category'
	       	  });	

       })

});
//分类修改
router.get('/category/edit', function(req, res, next){
        var id = req.query.id || '';

        Category.findOne({
        	_id: id
        }).then(function(category){
            if(!category){
		        res.render('admin/error',{
		             userInfo: req.userInfo,
		             message:"分类信息不存在"
		        })   
            }else{
	       	    res.render('admin/category_edit',{
		       	  	  userInfo: req.userInfo,
		       	  	  category:category
	       	    });		

            }
        })

});
//分类修改保存
router.post('/category/edit', function(req, res, next){
        var id = req.query.id || '';
        var name = req.body.name || '';     
        console.log(name);

        if(!name) return;
        Category.findOne({
        	_id: id
        }).then(function(category){
            if(!category){
		        res.render('admin/error',{
		             userInfo: req.userInfo,
		             message:"分类信息不存在"
		        })   
		        return Promise.reject(); 
            }else{
	       	    if(name == category.name){
			        res.render('admin/success',{
			       	  	  message:"修改成功",
			       	  	  url: '/admin/Category'
			        })   
		            return Promise.reject();          

	       	    }else{
			        return Category.findOne({
			        	_id: {$ne: id},
			        	name: name
			        });

	       	    }

            }
        }).then(function(someCategory){
             
             if(someCategory){
		        res.render('admin/error',{
		             userInfo: req.userInfo,
		             message:"数据已经存在"
		        })  
		        return Promise.reject();	
             }else{
                return Category.update({
                	_id: id
                },{
                	name: name
                });
             }

        }).then(function(){
	       	  res.render('admin/success',{
	       	  	  userInfo: req.userInfo,
	       	  	  message:"修改成功",
	       	  	  url: '/admin/category'
	       	  });	
        })
});	
//分类删除
router.get('/category/delete', function(req, res, next){
     var id = req.query.id || '';
     Category.remove({
     	_id: id
     }).then(function(){
       	  res.render('admin/success',{
       	  	  userInfo: req.userInfo,
       	  	  message:"删除成功",
       	  	  url: '/admin/category'
       	  });	
     })
});

//内容首页
router.get('/content', function(req, res, next){


      var page = Number(req.query.page) || 1;
      var limit = 10;
      var pages = 0;
      Content.count().then(function(count){
              pages = Math.ceil(count / limit);
              page = Math.min(page , pages);
              page = Math.max(page , 1);
              var skip = (page -1)*limit;
        Content.find().limit(limit).skip(skip).populate(['category','user']).sort({addTime:-1}).then(function(contents){
            console.log(contents);
            res.render('admin/content_index',{
              userInfo : req.userInfo,
              contents: contents,
              count: count,
              pages: pages,
              limit: limit,
              page: page,
              typeName: "content"
            });
        })
      });


});
//内容首页
router.get('/content/add', function(req, res, next){

      Category.find().sort({_id:-1}).then(function(categories){
          res.render('admin/content_add',{
              userInfo: req.userInfo,
              categories:categories
          }); 
      })

});
//内容提交
router.post('/content/add', function(req, res, next){

      if(req.body.category == ""){
          res.render('admin/error',{
              userInfo: req.userInfo,
              message:"分类内容不能为空"
          }); 
          return
      }
      if(req.body.title == ""){
          res.render('admin/error',{
              userInfo: req.userInfo,
              message:"标题不能为空"
          }); 
          return
      }      

      new Content({
         category: req.body.category,
         title: req.body.title,
         description:req.body.description, 
         content:req.body.content,
         user: req.userInfo._id.toString(),
      }).save().then(function(rs){
          res.render('admin/success',{
              userInfo: req.userInfo,
              message:"内容保存成功",
              url: '/admin/content'
          }); 

      })


});

//内容提交
router.get('/content/edit', function(req, res, next){

      var id =req.query.id || '';
      Content.findOne({
        _id:id
      }).then(function(content){
           if(!content){
              res.render('admin/error',{
                  userInfo: req.userInfo,
                  message:"指定内容不存在"
              });  
              return Promise.reject();  
           }else{
            Category.find().sort({_id:-1}).then(function(categories){
                res.render('admin/content_edit',{
                    userInfo: req.userInfo,
                    content: content,
                    categories: categories
                }); 
            });   

           }
          
      }) 

});

//内容提交
router.post('/content/edit', function(req, res, next){

      var id =req.query.id || '';  
        Content.update({
          _id: id
        },{
           category: req.body.category,
           title: req.body.title,
           description:req.body.description, 
           content:req.body.content,
           user: req.userInfo._id.toString(),
        }).then(function(){
              res.render('admin/success',{
                  userInfo: req.userInfo,
                  message:"保存成功",
                  url: "/admin/content"
              });  

        });


});

//美容删除
router.get('/content/delete', function(req, res, next){
     var id = req.query.id || '';
     Content.remove({
      _id: id
     }).then(function(){
          res.render('admin/success',{
              userInfo: req.userInfo,
              message:"删除成功",
              url: '/admin/content'
          }); 
     })
});

module.exports = router;
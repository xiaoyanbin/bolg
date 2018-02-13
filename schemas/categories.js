
var mongoose =require("mongoose");

 var Schema = mongoose.Schema;
  // 分类的表结构
  var blogSchema = new Schema({
      name:  String

  });

module.exports = blogSchema;
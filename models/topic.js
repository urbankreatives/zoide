const mongoose = require('mongoose');


var topicSubSchema = new mongoose.Schema({


name:{type:String, required:true},
subjectCode:{type:String, required:true},
subjectName:{type:String, required:true},
year:{type:String, required:true},
grade:{type:String, required:true},
class1:{type:String, required:true},
companyId:{type:String, required:true},





})

module.exports = mongoose.model('Topic', topicSubSchema);
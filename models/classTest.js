const mongoose = require('mongoose');


var testSchema = new mongoose.Schema({


class1:{type:String, required:true},
numberOfStudents:{type:Number, required:true},
teacher:{type:String, required:true},
name:{type:String, required:true},
grade:{type:Number, required:true},
level:{type:String, required:true},
date:{type:String, required:true},
month:{type:String, required:true},
topic:{type:String, required:true},
avgMark:{type:Number, required:true},
possibleMark:{type:Number, required:true},
highScore:{type:Number, required:true},
lowestScore:{type:Number, required:true},
numPasses:{type:Number, required:true},
type:{type:String, required:true},
year:{type:Number, required:true},
term:{type:Number, required:true},
passRate:{type:Number, required:true},
subject:{type:String, required:true},
subjectCode:{type:String, required:true},
companyId:{type:String, required:true},



})

module.exports = mongoose.model('Test', testSchema);
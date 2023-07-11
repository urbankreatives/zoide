const mongoose = require('mongoose');


var testxSchema = new mongoose.Schema({


    uid:{type:String, required:true},
    fullname:{type:String, required:true},
    grade:{type:Number, required:true},
    class1:{type:String, required:true},
    date:{type:String, required:true},
    month:{type:String, required:true},
    color:{type:String, required:true},
    style:{type:String, required:true},
    icon:{type:String,required:true},
    size:{type:Number, required:true},
    numDate:{type:Number, required:true},
    year:{type:Number, required:true},
    term:{type:Number, required:true},
    teacher:{type:String, required:true},
    teacherId:{type:String, required:true},
    subject:{type:String, required:true},
    subjectCode:{type:String, required:true},
    topic:{type:String, required:true},
    possibleMark:{type:Number, required:true},
    mark:{type:Number, required:true},
    type:{type:String, required:true},
    percentage:{type:Number, required:true},
    symbol:{type:String, required:true},
    result:{type:String, required:true},
    quizId:{type:String, required:true},
companyId:{type:String, required:true},


})

module.exports = mongoose.model('TestX', testxSchema);
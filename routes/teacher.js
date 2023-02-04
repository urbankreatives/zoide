require('dotenv').config();

var express = require('express');
var router = express.Router();
const User =require('../models/user')
const Class1 =require('../models/class');
const Subject =require('../models/subject');
const Fees =require('../models/fees');
const Test =require('../models/classTest');
const TestX =require('../models/classTestX');
const Lesson =require('../models/lesson');
const Exam =require('../models/exam');
const Grade =require('../models/grade');
const Pass = require('../models/passRate')
const TeacherClassRate = require('../models/tcPassRateX')
const TeacherExamRate = require('../models/tcPassRate')
const TeacherDash = require('../models/teacherDash')
const StudentSub =require('../models/studentSubject');
const TeacherSub =require('../models/teacherSubject');
const Income =require('../models/incomeX');
const Expenses = require('../models/expenses')
const FeesUpdate =require('../models/feesUpdate');
var mongoose = require('mongoose')
var passport = require('passport')
var xlsx = require('xlsx')
var multer = require('multer')
const fs = require('fs')
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport')
var moment = require('moment')
var bcrypt = require('bcrypt-nodejs');
const classTestX = require('../models/classTestX');


var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})



var upload = multer({
    storage:storage
})



// change password
router.get('/pass',isLoggedIn, (req, res) => {
  var pro = req.user
  User.findById(req.user._id, (err, doc) => {
      if (!err) {
          res.render("teachers/change", {
             
              user: doc,pro
            
          });
      }
  });
});



router.post('/pass',isLoggedIn, function(req,res){
  var user = new User();
  var pro = req.user
  req.check('password','Enter New Password').notEmpty();

  req.check('confirmPassword', 'Confirm Password').notEmpty();


req.check('password', 'Password do not match').isLength({min: 4}).equals(req.body.confirmPassword);
var errors = req.validationErrors();




 if (errors) {

 

    req.session.errors = errors;
    req.session.success = false;
    res.render('teachers/change',{ title: 'User Update', user:req.body, errors:req.session.errors,  pro:pro
   })

  
  


}
else if (req.body.password === req.body.confirmPassword && !req.validationErrors()){
  user.password=req.body.password=encryptPassword(req.body.password)





User.findOneAndUpdate({_id:req.body._id},req.body,
 { new: true }, (err, doc) => {
    if (!err) {
    
      req.session.message = {
        type:'success',
        message:'Password Change Successful'
      }  
      res.render('teachers/change',{message:req.session.message, user:req.user, pro:pro
       }); }
    else {
      console.log('error'+err)

    }
  
})
}



})



    
    









router.get('/passRate',isLoggedIn,function(req,res){
    let totalexams, examsPassed, passRate;
    let numberOfMarks, totalMarks, avgMark;
    var m = moment()
    var year = m.format('YYYY')
    var term = req.user.term
    var uid = req.user.uid
    var fullname = req.user.fullname;
    var teacherId = req.user.uid
     var m = moment()
     var year = m.format('YYYY')
     var marks, marks2
     var arr1=[]
     var companyId = req.user.companyId
     var number1
    TeacherSub.find({companyId:companyId,teacherId:teacherId},function(err,lods){
      for(var i = 0; i<lods.length;i++){
        let sub = lods[i].subjectName
        let subCode = lods[i].subjectCode
  
      
  
     TeacherExamRate.find({companyId:companyId,year:year, teacherId:teacherId, subject:sub,  subjectCode:subCode},function(err,docs){
  
  
       if(docs.length == 0){
   console.log(sub, subCode)
         TestX.find({companyId:companyId,term:term,year:year,teacherId:uid, type:'Final Exam',  subject:sub,subjectCode:subCode },function(err,hods){
           console.log(hods, 'hods')
   
           TestX.find({companyId:companyId,term:term,year:year,teacherId:uid, result:'pass', type:'Final Exam', subject:sub, subjectCode:subCode},function(err,lods){
          /* if(hods.length >=1){*/
            console.log(lods,'lods')
   
            totalexams = hods.length;
            examsPassed = lods.length
            passRate = examsPassed / totalexams * 100
            numberOfMarks = hods.length;
            console.log('numberOfMarks',numberOfMarks)
  
            for(var q = 0;q<hods.length; q++){
    
              arr1.push(hods[q].percentage)
                }
                //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
                 totalMarks=0;
                for(var z in arr1) { totalMarks += arr1[z]; }
   
                avgMark = totalMarks / numberOfMarks
               console.log(avgMark, 'avgMark')
               var pass =TeacherExamRate();
               pass.firstTerm = 0;
               pass.firstAvgMark = 0
               pass.secondTerm= 0;
               pass.secondAvgMark = 0
               pass.thirdTerm = 0
               pass.thirdAvgMark=0;
               pass.teacherId = teacherId;
               pass.teacherName = fullname;
               pass.subject = sub
               pass.nwCode = sub +" "+ subCode
               pass.subjectCode = subCode
               pass.term = term
               pass.type = 'Final Exam';
               pass.year = year
               pass.companyId = companyId
   
               pass.save()
       .then(pas =>{
         id3 = pas._id;
  
         if(term == 1){
   
     
           TeacherExamRate.findByIdAndUpdate(id3,{$set:{firstTerm:passRate, firstAvgMark:avgMark}},function(err,kocs){
        
           
           })
         }else if(term == 2){
         
           TeacherExamRate.findByIdAndUpdate(id3,{$set:{secondTerm:passRate,secondAvgMark:avgMark}},function(err,kocs){
         
               
               })
             }else{
               TeacherExamRate.findByIdAndUpdate(id3,{$set:{thirdTerm:passRate,thirdAvgMark}},function(err,kocs){
               
                   
                   })
                 }
   
                 })
                /* }*/
                 
                 })
                 
               })
          }
             else
   
           var  idX  = docs[0]._id
   
           TestX.find({companyId:companyId,term:term,year:year,teacherId:uid, type:"Final Exam", subject:sub, subjectCode:subCode},function(err,hods){
   
            TestX.find({companyId:companyId,term:term,year:year, result:'pass',teacherId:uid, type:"Final Exam", subject:sub, subjectCode:subCode},function(err,lods){
            if(hods.length >=1){
    
    
             totalexams = hods.length;
             examsPassed = lods.length
             passRate = examsPassed / totalexams * 100
             numberOfMarks = hods.length;
   
             for(var q = 0;q<hods.length; q++){
     
               arr1.push(hods[q].percentage)
                 }
                 //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
                  totalMarks=0;
                 for(var z in arr1) { totalMarks += arr1[z]; }
    
                 avgMark = totalMarks / numberOfMarks
   
                if(term == 1){
   
     
                 TeacherExamRate.findByIdAndUpdate(idX,{$set:{firstTerm:passRate,firstAvgMark:avgMark}},function(err,kocs){
              
                 
                 })
               }else if(term == 2){
               
                 TeacherExamRate.findByIdAndUpdate(idX,{$set:{secondTerm:passRate, secondAvgMark:avgMark}},function(err,kocs){
               
                     
                     })
                   }else{
                     TeacherExamRate.findByIdAndUpdate(idX,{$set:{thirdTerm:passRate, thirdAvgMark:avgMark}},function(err,kocs){
                     
                         
                         })
                       }
     
               }
       
      
             })
             
          
           })    
         
   
           })
     
      
          }
          
        res.redirect('/teacher/passRateX')
    
        })    
           
   
     })
  
  
  
  
  
     router.get('/passRateX',isLoggedIn,function(req,res){
      let totalexams, examsPassed, passRate
      let numberOfMarks, totalMarks, avgMark
      var m = moment()
      var year = m.format('YYYY')
      var term = req.user.term
      var uid = req.user.uid
      var fullname = req.user.teacherName;
      var teacherId = req.user.uid
      
       var m = moment()
       var year = m.format('YYYY')
       var marks, marks2
       var arr1=[]
       var number1
       var term = req.user.term
       var companyId = req.user.companyId
       TeacherSub.find({companyId:companyId,teacherId:teacherId},function(err,lods){
        for(var i = 0; i<lods.length;i++){
          let sub = lods[i].subjectName
          let subCode = lods[i].subjectCode
         
  
  
       TeacherClassRate.find({companyId:companyId,year:year,teacherId:teacherId,  subject:sub, subjectCode:subCode},function(err,docs){
     
         if(docs.length == 0){
     
           TestX.find({companyId:companyId,term:term,year:year,teacherId:uid, type:'Class Test',  subject:sub, subjectCode:subCode},function(err,hods){
     
             TestX.find({companyId:companyId,term:term,year:year, result:'pass',teacherId:uid, type:'Class Test', subject:sub, subjectCode:subCode},function(err,lods){
            /* if(hods.length >=1){*/
     
     
              totalexams = hods.length;
              examsPassed = lods.length
              passRate = examsPassed / totalexams * 100
              numberOfMarks = hods.length;
              console.log('numberOfMarks',numberOfMarks)
    
              for(var q = 0;q<hods.length; q++){
      
                arr1.push(hods[q].percentage)
                  }
                  //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
                   totalMarks=0;
                  for(var z in arr1) { totalMarks += arr1[z]; }
     
                  avgMark = totalMarks / numberOfMarks
                 
                 var pass = TeacherClassRate();
                 pass.firstTerm = 0;
                 pass.firstAvgMark = 0
                 pass.secondTerm= 0;
                 pass.secondAvgMark = 0
                 pass.thirdTerm = 0
                 pass.thirdAvgMark=0
                 pass.teacherId = teacherId;
                 pass.nwCode = sub +" "+ subCode
                 pass.teacherName = fullname;
                 pass.subject = sub
                 pass.subjectCode = subCode
            
                 pass.term = term
                 pass.type = 'Class Test'
                 pass.year = year
                 pass.companyId = companyId
     
                 pass.save()
         .then(pas =>{
           id3 = pas._id;
     
           if(term == 1){
     
       
            TeacherClassRate.findByIdAndUpdate(id3,{$set:{firstTerm:passRate, firstAvgMark:avgMark}},function(err,kocs){
          
             
             })
           }else if(term == 2){
           
            TeacherClassRate.findByIdAndUpdate(id3,{$set:{secondTerm:passRate,secondAvgMark:avgMark}},function(err,kocs){
           
                 
                 })
               }else{
                TeacherClassRate.findByIdAndUpdate(id3,{$set:{thirdTerm:passRate,thirdAvgMark}},function(err,kocs){
                 
                     
                     })
                   }
     
                   })
                   /*}*/
                   
                   })
                   
                 })
               }
               else
     
             var  idX  = docs[0]._id
     
             TestX.find({companyId:companyId,term:term,year:year,teacherId:uid, type:"Class Test",  subject:sub, subjectCode:subCode},function(err,hods){
     
              TestX.find({companyId:companyId,term:term,year:year, result:'pass',teacherId:uid, type:"Class Test",  subject:sub, subjectCode:subCode},function(err,lods){
              if(hods.length >=1){
      
      
               totalexams = hods.length;
               examsPassed = lods.length
               passRate = examsPassed / totalexams * 100
               numberOfMarks = hods.length;
     
               for(var q = 0;q<hods.length; q++){
       
                 arr1.push(hods[q].percentage)
                   }
                   //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
                    totalMarks=0;
                   for(var z in arr1) { totalMarks += arr1[z]; }
      
                   avgMark = totalMarks / numberOfMarks
     console.log('total Marks', totalMarks)
     console.log('number of  Marks', totalMarks)
                  if(term == 1){
     
       
                    TeacherClassRate.findByIdAndUpdate(idX,{$set:{firstTerm:passRate,firstAvgMark:avgMark}},function(err,kocs){
                
                   
                   })
                 }else if(term == 2){
                 
                  TeacherClassRate.findByIdAndUpdate(idX,{$set:{secondTerm:passRate, secondAvgMark:avgMark}},function(err,kocs){
                 
                       
                       })
                     }else{
                      TeacherClassRate.findByIdAndUpdate(idX,{$set:{thirdTerm:passRate, thirdAvgMark:avgMark}},function(err,kocs){
                       
                           
                           })
                         }
       
                 }
         
        
               })
            
             })    
  
  
             
     
             })
            }
  
            res.redirect('/teacher/min')
          
  
          })
             
     
       })
    
  
  
  
  
  


//student stats
       router.get('/min',isLoggedIn,function(req,res){
        /*const numbers = [4,8,2,5]
        let maximum = -Infinity
        let minimum = Infinity
      
        for(let number of numbers){
          if(number > maximum)
      
          maximum = number
      
          if(number < minimum)
      
          minimum = number
        }*/
      

      
var companyId = req.user.companyId

Test.find({companyId:companyId},function(err,docs){
  console.log(docs.length,'length')
  for(var i = 0; i<docs.length;i++){
   var topic = docs[i].topic
    var type = docs[i].type
    var term = docs[i].term
    var year = docs[i].year
    var class1 = docs[i].class1
  var subject = docs[i].subject
   var subjectCode = docs[i].subjectCode
    var id = docs[0]._id



    TestX.find({topic:topic, type:type, term:term, year:year, class1:class1, subject:subject, subjectCode:subjectCode},function(err,nocs){
   
      let min = nocs[0].mark
      let max = nocs[0].mark
         console.log(nocs.length,'length')
        for(var x=0;x<nocs.length;x++){
          if(min >nocs[x].mark)
          min = nocs[x].mark

          if(max < nocs[x].mark)
          max = nocs[x].mark

          /*if(nocs[i].mark < minimum){
            minimum = nocs[i].mark
          }*/
         
        
      }
      let average = 0

      for(let d = 0; d<nocs.length;d++){
        let currentNum = nocs[d].mark
        average += currentNum
      }
      average = average/nocs.length
      console.log(average)
console.log(topic,type,term)
   TestX.find({topic:topic, type:type, term:term, year:year, class1:class1, subject:subject, subjectCode:subjectCode,result:'pass'},function(err,tocs){
let numPasses = tocs.length
  let passRateX = numPasses / nocs.length
  let passRate =passRateX * 100
  Test.findByIdAndUpdate(id,{$set:{lowestScore:min, highScore:max, avgMark:average,numPasses:numPasses, passRate:passRate}},function(err,kocs){
     
    })
  })
})
  }
  res.redirect('/teacher/dashX')
})

      })
      




      





router.get('/dashX',isLoggedIn,function(req,res){
  var pro = req.user
  res.render('dashboard/teacher',{pro:pro})
})

router.get('/dash',isLoggedIn,function(req,res){
res.redirect('/teacher/passRate')
})




 
//Final Exam

router.post('/passChart',isLoggedIn,function(req,res){
    var m = moment()
    var year = m.format('YYYY')
    var uid = req.user.uid
 
    var companyId = req.user.companyId
          TeacherExamRate.find({companyId:companyId,year:year, teacherId:uid},function(err,docs){
            if(docs == undefined){
              res.redirect('/teacher/dash')
            }else
        
               res.send(docs)
           
            
             })
        
        })
  
  
  //Class Test
        router.post('/passChart2',isLoggedIn,function(req,res){
          var m = moment()
          var year = m.format('YYYY')
          var uid = req.user.uid
   
          var companyId = req.user.companyId
                TeacherClassRate.find({companyId:companyId,year:year,  teacherId:uid},function(err,docs){
                  if(docs == undefined){
                    res.redirect('/teacher/dash')
                  }else
              
                     res.send(docs)
                 
                  
                   })
              
              })
    
  
  
  
  


              router.get('/fstats',isLoggedIn,function(req,res){
                var pro = req.user
                var m = moment()
                var year = m.format('YYYY')
                var uid = req.user.uid
                var companyId = req.user.companyId
                var term = req.user.term
                TeacherExamRate.find({companyId:companyId,year:year,  teacherId:uid, type:"Final Exam"},function(err,docs){
                  if (!err) {
                      res.render('teachers/statf', {
                         list:docs,pro:pro
                        
                      });
                  }
              });
              
              
                
              })                   





              router.get('/tstats',isLoggedIn,function(req,res){
                var pro = req.user
                var companyId = req.user.companyId
                var m = moment()
                var year = m.format('YYYY')
                var uid = req.user.uid
                var term = req.user.term
                TeacherClassRate.find({companyId:companyId,year:year,  teacherId:uid, type:"Class Test"},function(err,docs){
                  if (!err) {
                      res.render('teachers/statc', {
                         list:docs,pro
                        
                      });
                  }
              });
              
              
                
              })      



//student registered subjects
router.get('/subjects',isLoggedIn,function(req,res){
     var pro = req.user
var uid = req.user.uid
var companyId = req.user.companyId
TeacherSub.find({companyId:companyId,teacherId:uid},(err, docs) => {
if (!err) {
res.render('teachers/subjectList', {
 list:docs, pro

});
}
});



})







// role teacher 

//teacher lesson timetable
router.get('/timetable',isLoggedIn, (req, res) => {
     var pro = req.user
var term = req.user.term
var m = moment();
var uid = req.user.uid
var year = m.format('YYYY')
var companyId = req.user.companyId
Lesson.find({companyId:companyId,term:term,year:year,teacherId:uid},(err, docs) => {
if (!err) {
res.render("lesson/timetableX", {
   list:docs,pro:pro
  
});
}
});
});



//exam timetable student
router.get('/examList',isLoggedIn, (req, res) => {
  var pro = req.user
var uid = req.user.uid
var term = req.user.term
var year = req.user.year
var companyId = req.user.companyId
Exam.find({companyId:companyId,uid:uid, term:term, year:year},(err, docs) => {
if (!err) {
   res.render("exam/examListX", {
      list:docs, pro:pro
     
   });
}
});
});



//role teacher
//creating exam batch for exam results
router.get('/examBatch',isLoggedIn,teacher,  function(req,res){
var arr = []
var arr1 = []
var user = req.user.term
var teacherId = req.user.uid
var pro = req.user
var companyId = req.user.companyId



Class1.find({companyId:companyId}, function(err,docs){
var arr1 = docs;  

res.render('exam/batch',{ arr1:arr1, user:user, pro:pro})

})

})

//exam
router.get('/examBatchX',isLoggedIn,teacher,  function(req,res){
  var arr = []
  var arr1 = []
  var user = req.user.term
  var teacherId = req.user.uid
  var pro = req.user
  var companyId = req.user.companyId
  
  
  
  Class1.find({companyId:companyId}, function(err,docs){
  var arr1 = docs;  
  
  res.render('exam/batchX',{ arr1:arr1, user:user, pro:pro})
  
  })
  
  })

router.post('/examBatch',isLoggedIn,teacher,  function(req,res){
     var pro = req.user
var class1 = req.body.class1;
var subject = req.body.subject;
var subjectCode = req.body.subjectCode;
var date = req.body.date;
var id = req.user._id;
var teacherId = req.user.uid
var term = req.body.term;
var type = req.body.type
var grade = req.body.grade
var stdNum, grade;
var companyId = req.user.companyId
let arr = []
let arr1 = []
var teacher = req.user.fullname
var m = moment()
var year = m.format('YYYY')
var month = m.format('MMMM')
var topic = req.body.topic
var possibleMark = req.body.possibleMark


/*
Class1.find({class1:classX},function(err,docs){
//grade = docs[0].grade
console.log(docs,'horror')

})
*/

req.check('class1','Enter Class').notEmpty();
req.check('subject','Enter Subject').notEmpty();

req.check('date','Enter Date').notEmpty();


var errors = req.validationErrors();

if (errors) {

TeacherSub.find({companyId:companyId,teacherId:teacherId},function(err,docs){

for(var i = 0;i<docs.length;i++){
arr1.push(docs[i].class1);
}
req.session.errors = errors;
req.session.success = false
res.render('exam/batch',{errors:req.session.errors, arr1:arr1,pro:pro})
})


}

else{

Test.findOne({'companyId':companyId,'date':date,'class1':class1,'subjectCode':subjectCode,'type':type })
.then(tes =>{
if(tes){ 

TeacherSub.find({companyId:companyId,teacherId:teacherId},function(err,docs){

for(var i = 0;i<docs.length;i++){
arr1.push(docs[i].class1);
}
req.session.message = {
type:'errors',
message:'Test Exists'
}     
 res.render('exam/batch', {
    message:req.session.message, arr1:arr1,pro:pro})
 
 })


}else


var test = Test();
test.date = date;
test.subject = subject;
test.subjectCode = subjectCode;
test.class1 = class1;
test.year = year;
test.name = date +" "+class1;
test.month  = month;
test.teacher = teacher;
test.numberOfStudents = 0;
test.passRate = 0;
test.term = term;
test.topic = topic;
test.highScore = 0
test.lowestScore=0;
test.numPasses=0
test.avgMark=0
test.possibleMark = possibleMark
test.type = type
test.grade = req.body.grade;
test.level = 'highschool';
test.companyId = companyId


test.save()
.then(tesn =>{

User.find({companyId:companyId,class1:class1, role:'student'},function(err,nocs){

stdNum = nocs.length - 1;

console.log(stdNum)
console.log(nocs.length,'wangu')

User.findByIdAndUpdate(id,{$set:{class1:class1, subjects:subject,examDate:date,term:term, classLength:stdNum,possibleMark:possibleMark,topic:topic, studentNum:0, type:type,subjectCode:subjectCode}}, function(err,trocs){

console.log(trocs)



})



})
res.redirect('/teacher/gradeX9')



})


})



}


})





//autocomplete teacherName & uid

router.get('/autocomplete/',isLoggedIn, function(req, res, next) {
var teacherId = req.user.uid
var companyId = req.user.companyId
var regex= new RegExp(req.query["term"],'i');

var uidFilter =TeacherSub.find({companyId:companyId,subjectCode:regex, teacherId:teacherId},{'subjectCode':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);


uidFilter.exec(function(err,data){


console.log('data',data)

var result=[];

if(!err){
if(data && data.length && data.length>0){
data.forEach(sub=>{





let obj={
 id:sub._id,
 label: sub.subjectCode


/*  name:name,
 surname:surname,
 batch:batch*/






 
};

result.push(obj);
console.log('object',obj.id)
});

}

res.jsonp(result);
console.log('Result',result)
}

})

});

// role admin
//this routes autopopulates teachers info from the id selected from automplet1
router.post('/auto',isLoggedIn,function(req,res){
var code = req.body.code
var teacherId = req.user.uid
var companyId = req.user.companyId
console.log(code, 'code')
TeacherSub.find({companyId:companyId,subjectCode:code, teacherId:teacherId},function(err,docs){
if(docs == undefined){
res.redirect('/teacher/auto')
}else

res.send(docs[0])
console.log(docs[0])
})


})














router.get('/gradeX9',isLoggedIn,function(req,res){
  res.redirect('/teacher/gradeX')
})







//role teacher
//adding results
router.get('/gradeX',isLoggedIn,teacher,  function(req,res){
var id = req.user._id;
var num = req.user.classLength;
var x = req.user.studentNum
var companyId = req.user.companyId
var ocs
var class1 = req.user.class1
console.log(class1,'class')
   var pro = req.user

if(num == 0){
res.redirect('/teacher/examBatch')
}else

User.find({companyId:companyId,class1:class1, role:'student'},function(err,docs){
ocs= docs[x]
res.render('exam/gradeX', {user:ocs,use:req.user, pro:pro})
})



})


router.post('/gradeX',isLoggedIn,teacher, function(req,res){
var id = req.user._id;
var date = req.body.date
var companyId = req.user.companyId
var uid = req.body.uid;
var teacherId = req.user.uid
var fullname = req.body.fullname;
var class1 = req.body.class1;
var grade = req.body.grade;
var mark = req.body.mark;
var term = req.user.term;
var m = moment(date)
var year = m.format('YYYY')
var month = m.format('MMMM')
var x = req.user.studentNum
var num = req.user.classLength;
var subject = req.user.subjects;
var subjectCode = req.user.subjectCode
var date = req.user.examDate
var pro = req.user
var type = req.body.type
var possibleMark = req.body.possibleMark
var percentageX = mark / possibleMark
var percentage = percentageX * 100
var topic = req.body.topic


console.log(x, num)

req.check('mark','Enter Student Mark').notEmpty();
req.check('uid','Enter Student ID').notEmpty();
req.check('fullname','Enter Student Name').notEmpty();
req.check('class1','Enter Class').notEmpty();



var errors = req.validationErrors();

if (errors) {

req.session.errors = errors;
req.session.success = false
res.render('exam/gradeX',{errors:req.session.errors,pro:pro})
}

else
{
var test = new TestX();
test.uid = uid;
test.fullname = fullname;
test.grade = grade;
test.class1 = class1;
test.date = date;
test.teacher = req.user.fullname;
test.teacherId = teacherId;
test.mark = mark;
test.category = 'null';
test.year = year
test.month = month
test.symbol = 'null';
test.term = term
test.result = "null";
test.subject = subject
test.subjectCode = subjectCode
test.date = date
test.percentage = percentage
test.possibleMark = possibleMark;
test.type = type
test.topic = topic
test.companyId = companyId

test.save()
.then(tes =>{
Grade.find({companyId:companyId},function(err,qocs){

for(var i = 0; i<qocs.length; i++){
let symbol = qocs[i].symbol
let from = qocs[i].from
let to = qocs[i].to

if(percentage >= from && percentage <= to ){
TestX.findByIdAndUpdate(tes._id,{$set:{symbol:symbol}},function(err,mocs){


})

}
}


})

if(percentage >= 50){

TestX.findByIdAndUpdate(tes._id,{$set:{result:'pass'}},function(err,mocs){


})
}else

TestX.findByIdAndUpdate(tes._id,{$set:{result:'fail'}},function(err,mocs){


})



if(num == x){

User.findByIdAndUpdate(id,{$set:{studentNum:0,classLength:0, class1:"null"}}, function(err,docs){


})

res.redirect('/teacher/examBatch')


}else

x++
console.log('x',x)
User.findByIdAndUpdate(id,{$set:{studentNum:x}}, function(err,docs){


})

})

res.redirect('/teacher/gradeX1')
}


})


//role teacher
router.get('/gradeX1',isLoggedIn,teacher,  function(req,res){
res.redirect('/teacher/gradeX')
})




router.get('/profile',isLoggedIn,  function(req,res){
  var pro = req.user
res.render('teachers/overview',{pro:pro})
})


router.post('/profile',isLoggedIn,upload.single('file'),function(req,res){

var pro = req.user

if(!req.file){
req.session.message = {
type:'errors',
message:'Select Picture'
}     
res.render('teachers/overview', {
user:req.body, message:req.session.message,pro:pro
}) 

} else
var imageFile = req.file.filename;
var id  = req.user._id;
console.log(imageFile)
console.log(id)
User.findByIdAndUpdate(id,{$set:{photo:imageFile}},function(err,data){ 





})

res.redirect('/teacher/profile')

//res.render('uploads/index',{title:'Upload File',records:data, success:success})






})

router.get('/tests',isLoggedIn, (req, res) => {
  var pro = req.user
var uid= req.user.uid
var companyId = req.user.companyId
Test.find({companyId:companyId,teacherId:uid, type:'Class Test'},(err, docs) => {
if (!err) {
   res.render("teacherExam/resultXX", {
      list:docs, pro:pro
     
   });
}
});
});


//student results
router.get('/results',isLoggedIn, (req, res) => {
  var pro = req.user
var uid= req.user.uid
var companyId = req.user.companyId
TestX.find({companyId:companyId,teacherId:uid, type:'Class Test'},(err, docs) => {
if (!err) {
   res.render("teacherExam/result", {
      list:docs, pro:pro
     
   });
}
});
});




//student results - final exam
router.get('/examResults',isLoggedIn, (req, res) => {
var uid= req.user.uid
   var pro = req.user
   var companyId = req.user.companyId
TestX.find({companyId:companyId,teacherId:uid, type:'Final Exam'},(err, docs) => {
if (!err) {
   res.render("teacherExam/resultX", {
      list:docs, pro:pro
     
   });
}
});
});





router.get('/termInfo',isLoggedIn, function(req,res){
  var m = moment()
  var pro = req.user
  var year = m.format('YYYY')
  var term = req.user.term
  var companyId = req.user.companyId


FeesUpdate.find({companyId:companyId,term:term, year:year},(err, docs) => {
    if (!err) {
        res.render("teachers/newTerm", {
           list:docs, pro:pro
          
        });
    }
});
  
    })

  
  
  








module.exports = router;
  
  
  
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else{
        res.redirect('/')
    }
  }
  
  
  
  function teacher(req,res,next){
    if(req.user.role == 'teacher'){
      return next()
    }
    res.render('errors/access')
    }  










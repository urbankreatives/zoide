require('dotenv').config();

var express = require('express');
var router = express.Router();
const User =require('../models/user')
const Assignment =require('../models/assignment')
const Class1 =require('../models/class');
const Subject =require('../models/subject');
const Fees =require('../models/fees');
const Test =require('../models/classTest');
const TestX =require('../models/classTestX');
const Lesson =require('../models/lesson');
var Message = require('../models/message');
var Recepient = require('../models/recepients');
var Note = require('../models/note');
const Exam =require('../models/exam');
const Grade =require('../models/grade');
const Pass = require('../models/passRate')
var uploadModel = require('../models/upload');
const TeacherClassRate = require('../models/tcPassRateX')
const TeacherExamRate = require('../models/tcPassRate')
const TeacherDash = require('../models/teacherDash')
const StudentSub =require('../models/studentSubject');
const TeacherSub =require('../models/teacherSubject');
const Topic =require('../models/topic');
const Income =require('../models/incomeX');
const Expenses = require('../models/expenses')
const FeesUpdate =require('../models/feesUpdate');
const Question = require('../models/question');
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
router.get('/pass',isLoggedIn,teacher, (req, res) => {
  var pro = req.user
  User.findById(req.user._id, (err, doc) => {
      if (!err) {
          res.render("teachers/change", {
             
              user: doc,pro
            
          });
      }
  });
});



router.post('/pass',isLoggedIn,teacher, function(req,res){
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



    
    









router.get('/passRate',isLoggedIn,teacher,function(req,res){
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
        let icon = lods[i].icon
        let photo = lods[i].photo
  
      
  
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
            let pRate = examsPassed / totalexams * 100
            passRate = Math.round(pRate)
            passRate.toFixed(2)
            numberOfMarks = hods.length;
            console.log('numberOfMarks',numberOfMarks)
  
            for(var q = 0;q<hods.length; q++){
    
              arr1.push(hods[q].percentage)
                }
                //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
                 totalMarks=0;
                for(var z in arr1) { totalMarks += arr1[z]; }
   
               
                let  avgMarkX = totalMarks / numberOfMarks
                   
                avgMark = Math.round(avgMarkX)
                avgMark.toFixed(2)
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
               pass.icon = icon
               pass.photo = photo
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
             let pRate = examsPassed / totalexams * 100
             passRate = Math.round(pRate)
             passRate.toFixed(2)
             numberOfMarks = hods.length;
   
             for(var q = 0;q<hods.length; q++){
     
               arr1.push(hods[q].percentage)
                 }
                 //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
                  totalMarks=0;
                 for(var z in arr1) { totalMarks += arr1[z]; }
    
                 
                 let  avgMarkX = totalMarks / numberOfMarks
                   
                 avgMark = Math.round(avgMarkX)
                 avgMark.toFixed(2)
   
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
     
               }else{



                if(term == 1){
   
     
                  TeacherExamRate.findByIdAndUpdate(idX,{$set:{firstTerm:0,firstAvgMark:0}},function(err,kocs){
               
                  
                  })
                }else if(term == 2){
                
                  TeacherExamRate.findByIdAndUpdate(idX,{$set:{secondTerm:0, secondAvgMark:0}},function(err,kocs){
                
                      
                      })
                    }else{
                      TeacherExamRate.findByIdAndUpdate(idX,{$set:{thirdTerm:0, thirdAvgMark:0}},function(err,kocs){
                      
                          
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
  
  
  
  
  
     router.get('/passRateX',isLoggedIn,teacher,function(req,res){
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
          let icon = lods[i].icon
          let photo = lods[i].photo
         
  
  
       TeacherClassRate.find({companyId:companyId,year:year,teacherId:teacherId,  subject:sub, subjectCode:subCode},function(err,docs){
     
         if(docs.length == 0){
     
           TestX.find({companyId:companyId,term:term,year:year,teacherId:uid, type:'Class Test',  subject:sub, subjectCode:subCode},function(err,hods){
     
             TestX.find({companyId:companyId,term:term,year:year, result:'pass',teacherId:uid, type:'Class Test', subject:sub, subjectCode:subCode},function(err,lods){
            /* if(hods.length >=1){*/
     
     console.log(hods.length,lods.length,'well, well')
              totalexams = hods.length;
              examsPassed = lods.length
              let pRate = examsPassed / totalexams * 100
          passRate = Math.round(pRate)
          passRate.toFixed(2)
              numberOfMarks = hods.length;
              console.log('numberOfMarks',numberOfMarks)
    
              for(var q = 0;q<hods.length; q++){
      
                arr1.push(hods[q].percentage)
                  }
                  //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
                   totalMarks=0;
                  for(var z in arr1) { totalMarks += arr1[z]; }
     
                  
                 let  avgMarkX = totalMarks / numberOfMarks
                   
                 avgMark = Math.round(avgMarkX)
                 avgMark.toFixed(2)
                 
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
                 pass.icon = icon
                 pass.photo = photo
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
           
     console.log(hods.length,lods.length,'well, well')
      
               totalexams = hods.length;
               examsPassed = lods.length
               let pRate = examsPassed / totalexams * 100
          passRate = Math.round(pRate)
          passRate.toFixed(2)
               numberOfMarks = hods.length;
     
               for(var q = 0;q<hods.length; q++){
       
                 arr1.push(hods[q].percentage)
                   }
                   //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
                    totalMarks=0;
                   for(var z in arr1) { totalMarks += arr1[z]; }
      
                   let  avgMarkX = totalMarks / numberOfMarks
                   
                   avgMark = Math.round(avgMarkX)
                   avgMark.toFixed(2)
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
       
                 }else{



                  if(term == 1){
     
       
                    TeacherClassRate.findByIdAndUpdate(idX,{$set:{firstTerm:0,firstAvgMark:0}},function(err,kocs){
                
                   
                   })
                 }else if(term == 2){
                 
                  TeacherClassRate.findByIdAndUpdate(idX,{$set:{secondTerm:0, secondAvgMark:0}},function(err,kocs){
                 
                       
                       })
                     }else{
                      TeacherClassRate.findByIdAndUpdate(idX,{$set:{thirdTerm:0, thirdAvgMark:0}},function(err,kocs){
                       
                           
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
       router.get('/min',isLoggedIn,teacher,function(req,res){
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
  let quizId = docs[i]._id
    var type = docs[i].type
    var term = docs[i].term
    var year = docs[i].year
    var class1 = docs[i].class1
  var subject = docs[i].subject
   var subjectCode = docs[i].subjectCode
    let id = docs[i]._id



    TestX.find({quizId:quizId},function(err,nocs){
   if(nocs.length > 0){

   
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
//console.log(topic,type,term)
   TestX.find({quizId:quizId,result:'pass'},function(err,tocs){
let numPasses = tocs.length
  let passRateX = numPasses / nocs.length
  let passRate =passRateX * 100
  Test.findByIdAndUpdate(id,{$set:{lowestScore:min, highScore:max, avgMark:average,numPasses:numPasses, passRate:passRate}},function(err,kocs){
     
    })
  })
}
})

  }
 res.redirect('/teacher/dashX')
})

      })
      





      router.post('/dashChart1',isLoggedIn,teacher,function(req,res){
      var uid = req.user.uid
      var size

      var m = moment()
      var year = m.format('YYYY')
      var arr = []
      var id = req.user._id
      TeacherSub.find({teacherId:uid},function(err,locs){
        if(locs){
          let subjectCode = locs[0].subjectCode
          let term = req.user.term
        StudentSub.find({subjectCode:subjectCode},function(err,noc){
          if(noc){
            let class1 = noc[0].class1
         
        
      
       
      
        
      console.log(subjectCode,class1,term,'outa here')
      
      
        TestX.find({year:year,subjectCode:subjectCode,class1:class1,term:term,type3:'class'},function(err,docs) {
          if(docs){

        
         // console.log(docs,'docs')
          for(var i = 0;i<docs.length;i++){
      size = docs.length
         
              
             if(arr.length > 0 && arr.find(value => value.month == docs[i].month)){
                    console.log('true')
                   arr.find(value => value.month == docs[i].month).percentage += docs[i].percentage;
                   arr.find(value => value.month == docs[i].month).size++;
                  }else{
          arr.push(docs[i])

          let resultX = arr.map(function(element){
            //element.size = 0
            element.size = element.size + 1
              })

     
              }
      
          
          }
        let result = arr.map(function(element){
          element.percentage  = element.percentage / element.size
          console.log(element.mark,'mark')
          let num = Math.round(element.percentage)
            num.toFixed(2)
            element.percentage =num
        })
          //console.log(arr,'arr')
         res.send(arr)
        }
        })
      }
      })
    }
      })
      })
      
      
      router.post('/dashChart2',isLoggedIn,teacher,function(req,res){
        var uid = req.user.uid
        var size
  
        var m = moment()
        var year = m.format('YYYY')
        var arr = []
        var id = req.user._id
        TeacherSub.find({teacherId:uid},function(err,locs){
          if(locs){
            let subjectCode = locs[0].subjectCode
            let term = req.user.term
   
           
          
        
         
        
          
        console.log(subjectCode,term,'outa here')
        
        
          TestX.find({year:year,subjectCode:subjectCode,term:term,type3:'class'},function(err,docs) {
            if(docs){

          
            //.log(docs,'docs')
            for(var i = 0;i<docs.length;i++){
        size = docs.length
           
                
               if(arr.length > 0 && arr.find(value => value.month == docs[i].month)){
                      console.log('true')
                     arr.find(value => value.month == docs[i].month).percentage += docs[i].percentage;
                     arr.find(value => value.month == docs[i].month).size++;
                    }else{
            arr.push(docs[i])

            let resultX = arr.map(function(element){
              //element.size = 0
              element.size = element.size + 1
                })
                }
        
            
            }
          let result = arr.map(function(element){
            element.percentage  = element.percentage / element.size
            console.log(element.mark,'mark')
            let num = Math.round(element.percentage)
            num.toFixed(2)
            element.percentage =num
          })
            //console.log(arr,'arr')
           res.send(arr)
          }
          })
        
      }
        })
        })
        


        router.post('/dashChart3',isLoggedIn,teacher,function(req,res){
          var uid = req.user.uid
          var size
    
          var m = moment()
          var year = m.format('YYYY')
          var arr = []
          var id = req.user._id
          TeacherSub.find({teacherId:uid},function(err,locs){
            if(locs){
              let subjectCode = locs[1].subjectCode
              let term = req.user.term
            StudentSub.find({subjectCode:subjectCode},function(err,noc){
              if(noc){
                let class1 = noc[0].class1
             
            
          
           
          
            
          console.log(subjectCode,class1,term,'outa here')
          
          
            TestX.find({year:year,subjectCode:subjectCode,class1:class1,term:term,type3:'class'},function(err,docs) {
              if(docs){

             
             // console.log(docs,'docs')
              for(var i = 0;i<docs.length;i++){
          size = docs.length
             
                  
                 if(arr.length > 0 && arr.find(value => value.topic == docs[i].topic)){
                        console.log('true')
                       arr.find(value => value.topic == docs[i].topic).percentage += docs[i].percentage;
                       arr.find(value => value.topic == docs[i].topic).size++;
                      }else{
                        arr.push(docs[i])
                        let topic = docs[i].topic
                        
                          //element.size = 0
                          if(arr.find(value => value.topic == topic)){
                     
                           
                                 arr.find(value => value.topic == topic).size++;
                   
                          }
                          //element.size = element.size + 1
                            
                       
                            }
                    
              
              }
            let result = arr.map(function(element){
              element.percentage  = element.percentage / element.size
              console.log(element.mark,'mark')
              let num = Math.round(element.percentage)
            num.toFixed(2)
            element.percentage =num
            })
              //console.log(arr,'arr')
             res.send(arr)
            }
            })
          }
          })
        }
          })
          })
          



        
      
      router.post('/dashChartP1',isLoggedIn,teacher,function(req,res){
        var subjectCode = req.body.subjectCode
        var term = req.body.term
        var class1 = req.body.class1
       
       
        var m = moment()
        var year = m.format('YYYY')
        var arr = []
        var id = req.user._id
      
        
      
      
      
        TestX.find({year:year,subjectCode:subjectCode,class1:class1,term:term,type3:'class'},function(err,docs) {
          if(docs){

         
          for(var i = 0;i<docs.length;i++){
            size = docs.length
         
              
             if(arr.length > 0 && arr.find(value => value.month == docs[i].month)){
                    console.log('true')
                   arr.find(value => value.month == docs[i].month).percentage += docs[i].percentage;
                   arr.find(value => value.month == docs[i].month).size++;
                  }else{
          arr.push(docs[i])

          let resultX = arr.map(function(element){
            //element.size = 0
            element.size = element.size + 1
              })
              }
      
          
          }
          let result = arr.map(function(element){
            element.percentage  = element.percentage / element.size
            console.log(element.mark,'mark')
            let num = Math.round(element.percentage)
            num.toFixed(2)
            element.percentage =num
          })
          //console.log(arr,'arr')
         res.send(arr)
        }
        })
      
      })
      
      

 
      router.post('/dashChartP2',isLoggedIn,teacher,function(req,res){
        var subjectCode = req.body.subjectCode
        var term = req.body.term
      
       
       
        var m = moment()
        var year = m.format('YYYY')
        var arr = []
        var id = req.user._id
      
        
      
      
      
        TestX.find({year:year,subjectCode:subjectCode,term:term,type3:'class'},function(err,docs) {
          if(docs){

          
          for(var i = 0;i<docs.length;i++){
            size = docs.length
         
              
             if(arr.length > 0 && arr.find(value => value.month == docs[i].month)){
                    console.log('true')
                   arr.find(value => value.month == docs[i].month).percentage += docs[i].percentage;
                   arr.find(value => value.month == docs[i].month).size++;
                  }else{
          arr.push(docs[i])

          let resultX = arr.map(function(element){
            //element.size = 0
            element.size = element.size + 1
              })
              }
      
          
          }
          let result = arr.map(function(element){
            element.percentage  = element.percentage / element.size
            console.log(element.mark,'mark')
            let num = Math.round(element.percentage)
            num.toFixed(2)
            element.percentage =num
          })
          //console.log(arr,'arr')
         res.send(arr)
        }
        })
      
      })



      router.post('/dashChartP3',isLoggedIn,teacher,function(req,res){
        var subjectCode = req.body.subjectCode
        var term = req.body.term
        var class1 = req.body.class1
       
       
        var m = moment()
        var year = m.format('YYYY')
        var arr = []
        var id = req.user._id
      
        
      
      
      
        TestX.find({year:year,subjectCode:subjectCode,class1:class1,term:term,type3:'class'},function(err,docs) {
          if(docs){

        
          for(var i = 0;i<docs.length;i++){
            size = docs.length
         
              
             if(arr.length > 0 && arr.find(value => value.topic == docs[i].topic)){
                    console.log('true')
                   arr.find(value => value.topic == docs[i].topic).percentage += docs[i].percentage;
                   arr.find(value => value.topic == docs[i].topic).size++;
                  }else{
                    arr.push(docs[i])
                    let topic = docs[i].topic
                    
                      //element.size = 0
                      if(arr.find(value => value.topic == topic)){
                 
                       
                             arr.find(value => value.topic == topic).size++;
               
                      }
                      //element.size = element.size + 1
                        
                   
                        }
                
          
          }
          let result = arr.map(function(element){
            element.percentage  = element.percentage / element.size
            console.log(element.mark,'mark')
            let num = Math.round(element.percentage)
            num.toFixed(2)
            element.percentage =num
          })
          //console.log(arr,'arr')
         res.send(arr)
        }
        })
      
      })
      
      



      router.post('/dashChartS1',isLoggedIn,teacher,function(req,res){
        var uid = req.user.uid
        var size
  
        var m = moment()
        var year = m.format('YYYY')
        var arr = []
        var id = req.user._id
        TeacherSub.find({teacherId:uid},function(err,locs){
          if(locs){
            let subjectCode = locs[1].subjectCode
            let term = req.user.term
          StudentSub.find({subjectCode:subjectCode},function(err,noc){
            if(noc){
              let studentId = noc[0].studentId
           
          
        
         
        
          
        console.log(subjectCode,studentId,term,'outa here')
        
        
          TestX.find({year:year,subjectCode:subjectCode,uid:studentId,term:term},function(err,docs) {
            if(docs){

            
            console.log(docs,'docs')
            for(var i = 0;i<docs.length;i++){
        size = docs.length
           
                
               if(arr.length > 0 && arr.find(value => value.month == docs[i].month)){
                      console.log('true')
                     arr.find(value => value.month == docs[i].month).percentage += docs[i].percentage;
                     arr.find(value => value.month == docs[i].month).size++;
                    }else{
                      arr.push(docs[i])
                      let month = docs[i].month
                      
                        //element.size = 0
                        if(arr.find(value => value.month == month)){
                   
                         
                               arr.find(value => value.month == month).size++;
                 
                        }
                        //element.size = element.size + 1
                          
                     
                          }
                  
            
            }
          let result = arr.map(function(element){
            element.percentage  = element.percentage / element.size
            console.log(element.mark,'mark')
            let num = Math.round(element.percentage)
            num.toFixed(2)
            element.percentage =num
          })
            //console.log(arr,'arr')
           res.send(arr)
          }
          })
        }
        })
      }
        })
        })
        
        
      

        
      
        router.post('/dashChartS01',isLoggedIn,teacher,function(req,res){
          var subjectCode = req.body.subjectCode
          var term = req.body.term
          var studentId = req.body.student
         
         
          var m = moment()
          var year = m.format('YYYY')
          var arr = []
          var id = req.user._id
        
          
        
        
        
          TestX.find({year:year,subjectCode:subjectCode,uid:studentId,term:term,type3:'class'},function(err,docs) {
            if(docs){

            
            for(var i = 0;i<docs.length;i++){
              size = docs.length
           
                
               if(arr.length > 0 && arr.find(value => value.month == docs[i].month)){
                      console.log('true')
                     arr.find(value => value.month == docs[i].month).percentage += docs[i].percentage;
                     arr.find(value => value.month == docs[i].month).size++;
                    }else{
            arr.push(docs[i])

            let resultX = arr.map(function(element){
              //element.size = 0
              element.size = element.size + 1
                })
                }
        
            
            }
            let result = arr.map(function(element){
              element.percentage  = element.percentage / element.size
              console.log(element.mark,'mark')
              let num = Math.round(element.percentage)
            num.toFixed(2)
            element.percentage =num
            })
            //console.log(arr,'arr')
           res.send(arr)
          }
          })
        
        })
        

 
        router.post('/dashChartS02',isLoggedIn,teacher,function(req,res){
          var subjectCode = req.body.subjectCode
          var term = req.body.term
          var class1 = req.body.class1
         
         
          var m = moment()
          var year = m.format('YYYY')
          var arr = []
          var id = req.user._id
        
          
        
        
        
          TestX.find({year:year,subjectCode:subjectCode,class1:class1,term:term,type3:'class'},function(err,docs) {
            if(docs){

            
            for(var i = 0;i<docs.length;i++){
              size = docs.length
           
                
               if(arr.length > 0 && arr.find(value => value.month == docs[i].month)){
                      console.log('true')
                     arr.find(value => value.month == docs[i].month).percentage += docs[i].percentage;
                     arr.find(value => value.month == docs[i].month).size++;
                    }else{
            arr.push(docs[i])

            let resultX = arr.map(function(element){
              //element.size = 0
              element.size = element.size + 1
                })
                }
        
            
            }
            let result = arr.map(function(element){
              element.percentage  = element.percentage / element.size
              console.log(element.mark,'mark')
              let num = Math.round(element.percentage)
            num.toFixed(2)
            element.percentage =num
            })
            //console.log(arr,'arr')
           res.send(arr)
          }
          })
        
        })




        router.post('/dashChartS03',isLoggedIn,teacher,function(req,res){
          var subjectCode = req.body.subjectCode
          var term = req.body.term
          var studentId = req.body.studentId
         
         console.log(subjectCode,term,studentId,'button03')
          var m = moment()
          var year = m.format('YYYY')
          var arr = []
          var id = req.user._id
        
          
        
        
        
          TestX.find({year:year,subjectCode:subjectCode,uid:studentId,term:term,type3:'class'},function(err,docs) {
            if(docs){
//console.log(docs,'docs')
            
            for(var i = 0;i<docs.length;i++){
              //size = docs.length
           
                
               if(arr.length > 0 && arr.find(value => value.topic == docs[i].topic)){
                console.log(docs[i].topic,docs[i].size,'true')
                     arr.find(value => value.topic == docs[i].topic).percentage += docs[i].percentage;
                     arr.find(value => value.topic == docs[i].topic).size++;
                     console.log( arr.find(value => value.topic == docs[i].topic).size,'trueX')
                    }else{
            arr.push(docs[i])
            let topic = docs[i].topic
            
              //element.size = 0
              if(arr.find(value => value.topic == topic)){
         
               
                     arr.find(value => value.topic == topic).size++;
       
              }
              //element.size = element.size + 1
                
           
                }
        
            
            }
            let result = arr.map(function(element){
              console.log(element.percentage,element.size,'mark')
              element.percentage  = element.percentage / element.size
              
              let num = Math.round(element.percentage)
            num.toFixed(2)
            element.percentage =num
            })
            //console.log(arr,'arr3')
           res.send(arr)
          }
          })
        
        })








        
        router.post('/dashChartS04',isLoggedIn,teacher,function(req,res){
          var subjectCode = req.body.subjectCode
          var term = req.body.term
          var class1= req.body.class1
          var topic = req.body.topic
         
         
          var m = moment()
          var year = m.format('YYYY')
          var arr = []
          var id = req.user._id
        
          
        
        
        
          TestX.find({year:year,subjectCode:subjectCode,class1:class1,topic:topic,term:term,type3:'class'},function(err,docs) {
            if(docs){

            
            for(var i = 0;i<docs.length;i++){
              size = docs.length
           
                
               if(arr.length > 0 && arr.find(value => value.fullname == docs[i].fullname)){
                      console.log('true')
                     arr.find(value => value.fullname == docs[i].fullname).percentage += docs[i].percentage;
                     arr.find(value => value.fullname == docs[i].fullname).size++;
                    }else{
                      arr.push(docs[i])
                      let fullname = docs[i].fullname
                      
                        //element.size = 0
                        if(arr.find(value => value.fullname == fullname)){
                   
                         
                               arr.find(value => value.fullname == fullname).size++;
                 
                        }
                        //element.size = element.size + 1
                          
                     
                          }
                  
            }
            let result = arr.map(function(element){
              element.percentage = element.percentage /element.size
              console.log(element.mark,'mark')
              let num = Math.round(element.percentage)
            num.toFixed(2)
            element.percentage =num
            })
            //console.log(arr,'arr')
           res.send(arr)
          }
          })
        
        })
        



        router.post('/dashChartS06',isLoggedIn,teacher,function(req,res){
          var subjectCode = req.body.subjectCode
          var term = req.body.term
          var class1 = req.body.class1
         
         
          var m = moment()
          var year = m.format('YYYY')
          var arr = []
          var id = req.user._id
        
          
        
        
        
          TestX.find({year:year,subjectCode:subjectCode,class1:class1,term:term,type3:'class'},function(err,docs) {
            if(docs){

            
            for(var i = 0;i<docs.length;i++){
              size = docs.length
           
                
               if(arr.length > 0 && arr.find(value => value.fullname == docs[i].fullname)){
                      console.log('true')
                     arr.find(value => value.fullname == docs[i].fullname).percentage += docs[i].percentage;
                     arr.find(value => value.fullname == docs[i].fullname).size++;
                    }else{
                      arr.push(docs[i])
                      let fullname = docs[i].fullname
                      
                        //element.size = 0
                        if(arr.find(value => value.fullname == fullname)){
                   
                         
                               arr.find(value => value.fullname== fullname).size++;
                 
                        }
                        //element.size = element.size + 1
                          
                     
                          }
                  
            
            }
            let result = arr.map(function(element){
              element.percentage  = element.percentage / element.size
              console.log(element.mark,'mark')
              let num = Math.round(element.percentage)
            num.toFixed(2)
            element.percentage =num
            })
            //console.log(arr,'arr')
           res.send(arr)
          }
          })
        
        })
        




        
        router.post('/dashChartS07',isLoggedIn,teacher,function(req,res){
          var subjectCode = req.body.subjectCode
          var term = req.body.term
          var class1 = req.body.class1
         
         
          var m = moment()
          var year = m.format('YYYY')
          var arr = []
          var id = req.user._id
        
          
        
        
        
          TestX.find({year:year,subjectCode:subjectCode,class1:class1,term:term,type3:'class'},function(err,docs) {
            if(docs){

            
            for(var i = 0;i<docs.length;i++){
              size = docs.length
           
                
               if(arr.length > 0 && arr.find(value => value.topic == docs[i].topic)){
                      console.log('true')
                     arr.find(value => value.topic == docs[i].topic).percentage += docs[i].percentage;
                     arr.find(value => value.topic == docs[i].topic).size++;
                    }else{
                      arr.push(docs[i])
                      let topic = docs[i].topic
                      
                        //element.size = 0
                        if(arr.find(value => value.topic == topic)){
                   
                         
                               arr.find(value => value.topic == topic).size++;
                 
                        }
                        //element.size = element.size + 1
                          
                     
                          }
                  
            }
            let result = arr.map(function(element){
              element.percentage  = element.percentage/ element.size
              console.log(element.mark,'mark')
              let num = Math.round(element.percentage)
            num.toFixed(2)
            element.percentage =num
            })
            //console.log(arr,'arr')
           res.send(arr)
          }
          })
        
        })
        
        
  







        

        router.post('/dashChartS08',isLoggedIn,teacher,function(req,res){
          var subjectCode = req.body.subjectCode
          var term = req.body.term
          var studentId = req.body.studentId
         
         
          var m = moment()
          var year = m.format('YYYY')
          var arr = []
          var id = req.user._id
        
          
        
        
        
          TestX.find({year:year,subjectCode:subjectCode,uid:studentId,term:term},function(err,docs) {
            if(docs){

            
            for(var i = 0;i<docs.length;i++){
              size = docs.length
           
                
               if(arr.length > 0 && arr.find(value => value.type == docs[i].type)){
                      console.log('true')
                     arr.find(value => value.type == docs[i].type).percentage += docs[i].percentage;
                     arr.find(value => value.type == docs[i].type).size++;
                    }else{
            arr.push(docs[i])

            let resultX = arr.map(function(element){
              //element.size = 0
              element.size = element.size + 1
                })
                }
        
            
            }
            let result = arr.map(function(element){
              element.percentage = element.percentage / element.size
              console.log(element.mark,'mark')
              let num = Math.round(element.percentage)
            num.toFixed(2)
            element.percentage =num
            })
            //console.log(arr,'arr')
           res.send(arr)
          }
          })
        
        })






         
        router.post('/dashChartS09',isLoggedIn,teacher,function(req,res){
          var subjectCode = req.body.subjectCode
          var term = req.body.term
          var class1= req.body.class1
        
         
         
          var m = moment()
          var year = m.format('YYYY')
          var arr = []
          var id = req.user._id
        
          
        
        
        
          TestX.find({year:year,subjectCode:subjectCode,class1:class1,term:term,type3:'class'},function(err,docs) {
            if(docs){

            
            for(var i = 0;i<docs.length;i++){
              size = docs.length
           
                
               if(arr.length > 0 && arr.find(value => value.topic == docs[i].topic)){
                      console.log('true')
                     arr.find(value => value.topic == docs[i].topic).percentage += docs[i].percentage;
                     arr.find(value => value.topic == docs[i].topic).size++;
                    }else{
                      arr.push(docs[i])
                      let topic = docs[i].topic
                      
                        //element.size = 0
                        if(arr.find(value => value.topic == topic)){
                   
                         
                               arr.find(value => value.topic == topic).size++;
                 
                        }
                        //element.size = element.size + 1
                          
                     
                          }
                  
            
            }
            let result = arr.map(function(element){
              element.percentage = element.percentage / element.size
              console.log(element.mark,'mark')
              let num = Math.round(element.percentage)
            num.toFixed(2)
            element.percentage =num
            })
            //console.log(arr,'arr')
           res.send(arr)
          }
          })
        
        })
        



router.get('/dashX',isLoggedIn,teacher,function(req,res){
  var pro = req.user
  const arr = []
const m = moment();
var id =req.user._id
var uid = req.user.uid
  Recepient.find({recepientId:id,statusCheck:'not viewed'},function(err,rocs){
    let lgt = rocs.length
    var gt = lgt > 0
  
        console.log(req.user._id)
        console.log(req.user.email)
          Note.find({recId:req.user._id},function(err,docs){
           // console.log(docs,'docs')
         for(var i = 0;i<docs.length;i++){
  
         
           let date = docs[i].date
           let id = docs[i]._id
           let timeX = moment(date)
           let timeX2 =timeX.fromNow()
           console.log(timeX2,'timex2')
  
           Note.findByIdAndUpdate(id,{$set:{status4:timeX2}},function(err,locs){
  
           
           
          // Format relative time using negative value (-1).
  
            
          })
        }
  
        Note.find({recId:req.user._id,status1:'new'},function(err,flocs){
          var les 
       
          Note.find({recId:req.user._id,status:'not viewed'},function(err,jocs){
           les = jocs.length > 0
        
          for(var i = flocs.length - 1; i>=0; i--){
      
            arr.push(flocs[i])
          }
       
          Class1.find({},function(err,plocs){
            
 TeacherSub.find({teacherId:uid},function(err,yocs){
         
          res.render('dashboard/teacher',{pro:pro,list:arr,arr1:plocs,listX:yocs, les:les,gt:gt })
          })

        })
        })
        })
        })
  
      })
  

})






//ajax


router.post('/dashChartA1',isLoggedIn,teacher,function(req,res){
  var uid = req.user.uid
  var size

  var m = moment()
  var year = m.format('YYYY')
  var arr = []
  var id = req.user._id
  TeacherSub.find({teacherId:uid},function(err,locs){
    if(locs){
      let subjectCode = locs[0].subjectCode
      let term = req.user.term
    StudentSub.find({subjectCode:subjectCode},function(err,noc){
      if(noc){
        let studentId = noc[0].studentId
     
    
  
   
  
    
  console.log(subjectCode,term,'outa here')
  
  
    TestX.find({year:year,subjectCode:subjectCode,uid:studentId,term:term,type3:'class'},function(err,docs) {
      if(docs){
      //console.log(docs,'docs')
      for(var i = 0;i<docs.length;i++){
  size = docs.length
     
          
         if(arr.length > 0 && arr.find(value => value.topic == docs[i].topic)){
                console.log('true')
               arr.find(value => value.topic == docs[i].topic).percentage += docs[i].percentage;
               arr.find(value => value.topic == docs[i].topic).size++;
              }else{
                arr.push(docs[i])
                let topic = docs[i].topic
                
                  //element.size = 0
                  if(arr.find(value => value.topic == topic)){
             
                   
                         arr.find(value => value.topic == topic).size++;
           
                  }
                  //element.size = element.size + 1
                    
               
                    }
            
  
      
      }
      let result = arr.map(function(element){
        element.percentage  = element.percentage / element.size
        console.log(element.mark,'mark')
        let num = Math.round(element.percentage)
      num.toFixed(2)
      element.percentage =num
      })
      //console.log(arr,'arr')
     res.send(arr)
  }
    })
  }
  })
}
  })
  })







  

router.post('/dashChartA2',isLoggedIn,teacher,function(req,res){
  var uid = req.user.uid
  var size

  var m = moment()
  var year = m.format('YYYY')
  var arr = []
  var id = req.user._id
  TeacherSub.find({teacherId:uid},function(err,locs){
    if(locs){
      let subjectCode = locs[0].subjectCode
      let term = req.user.term
    Topic.find({subjectCode:subjectCode},function(err,noc){
      if(noc){
        let name = noc[0].name
     
    
  
   
  
    
  console.log(subjectCode,term,'outa here')
  
  
    TestX.find({year:year,subjectCode:subjectCode,topic:name,term:term,type3:'class'},function(err,docs) {
      if(docs){

      
     // console.log(docs,'docs')
      for(var i = 0;i<docs.length;i++){
  size = docs.length
     
          
         if(arr.length > 0 && arr.find(value => value.fullname == docs[i].fullname)){
                console.log('true')
               arr.find(value => value.fullname == docs[i].fullname).percentage += docs[i].percentage;
               arr.find(value => value.fullname == docs[i].fullname).size++;
              }else{
                arr.push(docs[i])
                let fullname = docs[i].fullname
                
                  //element.size = 0
                  if(arr.find(value => value.fullname  == fullname)){
             
                   
                         arr.find(value => value.fullname == fullname).size++;
           
                  }
                  //element.size = element.size + 1
                    
               
                    }
            
      
      }
      let result = arr.map(function(element){
        element.percentage  = element.percentage / element.size
        console.log(element.mark,'mark')
        let num = Math.round(element.percentage)
      num.toFixed(2)
      element.percentage =num
      })
      //console.log(arr,'arr')
     res.send(arr)
  }
    })
  }
  })
}
  })
  })











   

router.post('/dashChartA3',isLoggedIn,teacher,function(req,res){
  var uid = req.user.uid
  var size

  var m = moment()
  var year = m.format('YYYY')
  var arr = []
  var id = req.user._id
  TeacherSub.find({teacherId:uid},function(err,locs){
    if(locs){
      let subjectCode = locs[0].subjectCode
      let term = req.user.term
    Class1.find({},function(err,noc){
      if(noc){
        let class1 = noc[1].class1
     
    
  
   
  
    
  console.log(subjectCode,term,'outa here')
  
  
    TestX.find({year:year,subjectCode:subjectCode,class1:class1,term:term,type3:'class'},function(err,docs) {
      if(docs){

      
    //  console.log(docs,'docs')
      for(var i = 0;i<docs.length;i++){
  size = docs.length
     
          
         if(arr.length > 0 && arr.find(value => value.uid == docs[i].uid)){
                console.log('true')
               arr.find(value => value.uid == docs[i].uid).percentage += docs[i].percentage;
               arr.find(value => value.uid == docs[i].uid).size++;
              }else{
                arr.push(docs[i])
                let uid= docs[i].uid
                
                  //element.size = 0
                  if(arr.find(value => value.uid == uid)){
             
                   
                         arr.find(value => value.uid == uid).size++;
           
                  }
                  //element.size = element.size + 1
                    
               
                    }
            
  
      
      }
      let result = arr.map(function(element){
        element.percentage  = element.percentage / element.size
        console.log(element.mark,'mark')
        let num = Math.round(element.percentage)
      num.toFixed(2)
      element.percentage =num
      })
      //console.log(arr,'arr')
     res.send(arr)
  }
    })
  }
  })
}
  })
  })














  
router.post('/dashChartA4',isLoggedIn,teacher,function(req,res){
  var uid = req.user.uid
  var size

  var m = moment()
  var year = m.format('YYYY')
  var arr = []
  var id = req.user._id
  TeacherSub.find({teacherId:uid},function(err,locs){
    if(locs){
      let subjectCode = locs[1].subjectCode
      let term = req.user.term
    Class1.find({},function(err,noc){
      if(noc){
        let class1 = noc[1].class1
     
    
  
   
  
    
  console.log(subjectCode,term,'outa here')
  
  
    TestX.find({year:year,subjectCode:subjectCode,class1:class1,term:term,type3:'class'},function(err,docs) {
      if(docs){
      //console.log(docs,'docs')
      for(var i = 0;i<docs.length;i++){
  size = docs.length
     
          
         if(arr.length > 0 && arr.find(value => value.topic == docs[i].topic)){
                console.log('true')
               arr.find(value => value.topic == docs[i].topic).percentage += docs[i].percentage;
               arr.find(value => value.topic == docs[i].topic).size++;
              }else{
                arr.push(docs[i])
                let topic = docs[i].topic
                
                  //element.size = 0
                  if(arr.find(value => value.topic == topic)){
             
                   
                         arr.find(value => value.topic == topic).size++;
           
                  }
                  //element.size = element.size + 1
                    
               
                    }
            
      }
      let result = arr.map(function(element){
        element.percentage  = element.percentage / element.size
        console.log(element.mark,'mark')
        let num = Math.round(element.percentage)
      num.toFixed(2)
      element.percentage =num
      })
      //console.log(arr,'arr')
     res.send(arr)
  }
    })
  }
  })
}
  })
  })









  
  router.post('/dashChartA5',isLoggedIn,teacher,function(req,res){
    var uid = req.user.uid
    var size
  
    var m = moment()
    var year = m.format('YYYY')
    var arr = []
    var id = req.user._id
    TeacherSub.find({teacherId:uid},function(err,locs){
      if(locs){
        let subjectCode = locs[1].subjectCode
        let term = req.user.term
      StudentSub.find({subjectCode:subjectCode},function(err,noc){
        if(noc){
          let studentId = noc[0].studentId
       
      
    
     
    
      
    console.log(subjectCode,term,'outa here')
    
    
      TestX.find({year:year,subjectCode:subjectCode,uid:studentId,term:term},function(err,docs) {
        if(docs){
        //console.log(docs,'docs')
        for(var i = 0;i<docs.length;i++){
    size = docs.length
       
            
           if(arr.length > 0 && arr.find(value => value.type == docs[i].type)){
                  console.log('true')
                 arr.find(value => value.type == docs[i].type).percentage += docs[i].percentage;
                 arr.find(value => value.type == docs[i].type).size++;
                }else{
        arr.push(docs[i])

        let resultX = arr.map(function(element){
          //element.size = 0
          element.size = element.size + 1
            })
            }
    
        
        }
        let result = arr.map(function(element){
          element.percentage  = element.percentage / element.size
          console.log(element.mark,'mark')
          let num = Math.round(element.percentage)
        num.toFixed(2)
        element.percentage =num
        })
        //console.log(arr,'arr')
       res.send(arr)
    }
      })
    }
    })
  }
    })
    })




  
    router.post('/dashChartA6',isLoggedIn,teacher,function(req,res){
      var uid = req.user.uid
      var size
    
      var m = moment()
      var year = m.format('YYYY')
      var arr = []
      var id = req.user._id
      TeacherSub.find({teacherId:uid},function(err,locs){
        if(locs){
          let subjectCode = locs[1].subjectCode
          let term = req.user.term
        Class1.find({},function(err,noc){
          if(noc){
            let class1 = noc[1].class1
         
        
      
       
      
        
      console.log(subjectCode,term,'outa here')
      
      
        TestX.find({year:year,subjectCode:subjectCode,class1:class1,term:term,type3:'class'},function(err,docs) {
          if(docs){
         // console.log(docs,'docs')
          for(var i = 0;i<docs.length;i++){
      size = docs.length
         
              
             if(arr.length > 0 && arr.find(value => value.topic == docs[i].topic)){
                    console.log('true')
                   arr.find(value => value.topic == docs[i].topic).percentage += docs[i].percentage;
                   arr.find(value => value.topic == docs[i].topic).size++;
                  }else{
                    arr.push(docs[i])
                    let topic = docs[i].topic
                    
                      //element.size = 0
                      if(arr.find(value => value.topic == topic)){
                 
                       
                             arr.find(value => value.topic == topic).size++;
               
                      }
                      //element.size = element.size + 1
                        
                   
                        }
                
          
          }
          let result = arr.map(function(element){
            element.percentage  = element.percentage / element.size
            console.log(element.mark,'mark')
            let num = Math.round(element.percentage)
          num.toFixed(2)
          element.percentage =num
          })
          //console.log(arr,'arr')
         res.send(arr)
      }
        })
      }
      })
    }
      })
      })
  
  
  


  
router.get('/dash',isLoggedIn,teacher,function(req,res){
res.redirect('/teacher/passRate')
})


router.get('/analytics',isLoggedIn,teacher,function(req,res){
  var pro = req.user
  var uid = req.user.uid
  Class1.find({},function(err,plocs){
  TeacherSub.find({teacherId:uid},function(err,docs){
  res.render('dashboard/teacher3',{pro:pro,arr:docs,arr1:plocs,listX:docs})

  })

  })
})

 


router.post('/fill',function(req,res){

  console.log(req.body.value)
      var subjectCode = req.body.value
  StudentSub.find({subjectCode:subjectCode},function(err,docs){
    console.log(docs,'data')
  
      if(docs == undefined){
          res.redirect('/')
         }else
        
           res.send(docs)
  
  })
  
  })




  
router.post('/fillX',function(req,res){

  console.log(req.body.value)
      var subjectCode = req.body.value
  Topic.find({subjectCode:subjectCode},function(err,docs){
    console.log(docs,'data')
  
      if(docs == undefined){
          res.redirect('/')
         }else
        
           res.send(docs)
  
  })
  
  })
//Final Exam

router.post('/passChart',isLoggedIn,teacher,function(req,res){
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
        router.post('/passChart2',isLoggedIn,teacher,function(req,res){
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
    
  
  
  
  


              router.get('/fstats',isLoggedIn,teacher,function(req,res){
                var pro = req.user
                var m = moment()
                var year = m.format('YYYY')
                var uid = req.user.uid
                var companyId = req.user.companyId
                var term = req.user.term
                TeacherExamRate.find({companyId:companyId,year:year,  teacherId:uid, type:"Final Exam"},function(err,docs){
                  if (!err) {
                      res.render('teachers/statf', {
                         listX:docs,pro:pro
                        
                      });
                  }
              });
              
              
                
              })                   





              router.get('/tstats',isLoggedIn,teacher,function(req,res){
                var pro = req.user
                var companyId = req.user.companyId
                var m = moment()
                var year = m.format('YYYY')
                var uid = req.user.uid
                var term = req.user.term
                TeacherClassRate.find({companyId:companyId,year:year,  teacherId:uid, type:"Class Test"},function(err,docs){
                  if (!err) {
                      res.render('teachers/statc', {
                         listX:docs,pro
                        
                      });
                  }
              });
              
              
                
              })      









              router.get('/msgUpdate',isLoggedIn,teacher,function(req,res){
                var id = req.user._id
                var arr = []
                Recepient.find({recepientId:id},function(err,docs){
              //  
                if(docs.length > 0){
                  for(var i = 0; i<docs.length;i++){
                  let msgId = docs[0].msgId
                  Message.find({msgId:msgId},function(err,tocs){
                    if(tocs.length >= 1){
                      arr.push(tocs[0])
                    }
                    let size = arr.length
                    console.log(size,'size')
                    User.findByIdAndUpdate(id,{$set:{inboxNo:size}},function(err,locs){
                
                    })
                  
                  })
                }
                }
                
                })
                })
                
                router.get('/sentUpdate',isLoggedIn,teacher,function(req,res){
                  var id = req.user._id
                  Message.find({senderId:id},function(err,docs){
                    let size = docs.length
                    User.findByIdAndUpdate(id,{$set:{sent:size}},function(err,nocs){
                
                    })
                  })
                })
                













              router.get('/msgX',isLoggedIn,teacher,function(req,res){
                var id = req.user.id
                var list = []
                var num
            Recepient.find({recepientId :id},function(err,nocs){
            
            for(var i = 0 ; i<nocs.length;i++){
            
            let recId = nocs[i].msgId
            
                Message.find({status:'reply',msgId:recId},function(err,docs){
                  for(var i = 0; i<docs.length;i++){
                    let date = docs[i].date
                    let Vid = docs[i]._id
                    let timeX = moment(date)
                    let timeX2 =timeX.fromNow()
                    let timeX3 =timeX.format("LLL")
                    console.log(timeX2,'timex2')
            
              
                    Message.findByIdAndUpdate(Vid,{$set:{status4:timeX2,status5:timeX3}},function(err,locs){
              
                    
                    
                   // Format relative time using negative value (-1).
              
                     
                   })
                  }
            
                
                })
              }
              
            res.redirect('/teacher/msg')
            })
            
            })
            
            
            
            
            
            
            
            
            
            
            
            
            router.get('/msg',isLoggedIn,teacher,function(req,res){
            var id = req.user.id
            const list2 =[]
            const list = []
            var num = req.user.inboxNo
            var sent = req.user.sent 
            var pro = req.user
            Recepient.find({recepientId :id, status:'active', statusXX:'null'},function(err,klocs){
            
            //var recFilter =Recepient.find({recepientId :id}).sort({"numDate":-1});
            //recFilter.exec(function(err,klocs){
              for(var c = 0 ; c <klocs.length;c++){
            
              let recIdX = klocs[c].msgId
            
                    Message.find({status:'reply',msgId:recIdX},function(err,  docs){
            
                     // var bookFilter =Message.find({status:'reply',msgId:recIdX}).sort({"numDate":-1});
            
            
            // bookFilter.exec(function(err,docs){
            
            console.log(docs.length,'mainstream')
            
            let x = docs.length - 1
            for(var i = x ;i>=0; i--){
            console.log(i,'b')
            if(docs[i].senderId !=id){
            //console.log(docs[i],'black skinhead')
            
            list.push(docs[i])
            list.sort((x, y) =>  y.numDate - x.numDate)
            console.log(list.length,'list yacho')
            
            num  = list.length
            }
            
       
            }
            })  
            
            //})
            
            }
            res.render('messagesTeachers/inbox',{list:list, num:list.length,sent:sent,pro:pro})
            })
            
            })
            
            
            
            
            
            //on click dashboard icon & msg redirect
            router.post('/msg/:id',function(req,res){
              var m = moment()
              var date = m.toString()
            
            var id = req.params.id
              Recepient.find({recepientId:id},function(err,docs){
                for(var i = 0; i<docs.length; i++){
                  let nId = docs[i]._id
            
                  Recepient.findByIdAndUpdate(nId,{$set:{statusCheck:'viewed'}},function(err,locs){
            
                    
                  })
                }
            
                res.send('success')
              })
            })
            
            
            router.get('/sentXX',isLoggedIn,teacher,function(req,res){
            var id = req.user.id
            var list = []
            var num
            
            
            Message.find({senderId:id},function(err,docs){
              for(var i = 0; i<docs.length;i++){
                let date = docs[i].date
                let Vid = docs[i]._id
                let timeX = moment(date)
                let timeX2 =timeX.fromNow()
                let timeX3 =timeX.format("LLL")
                console.log(timeX2,'timex2')
            
            
                Message.findByIdAndUpdate(Vid,{$set:{status4:timeX2,status5:timeX3}},function(err,locs){
            
            
            
                 
               })
              }
            res.redirect('/teacher/sent')
            })
            
            })
            
            
            
            
            
            router.get('/sent',isLoggedIn,teacher,function(req,res){
            var id = req.user.id
            const list2 =[]
            const list = []
            var pro = req.user
            var num = req.user.inboxNo
            var sent = req.user.sent
             
            Message.find({senderId :id},function(err,docs){
            
            
            
            console.log(docs.length,'mainstream')
            if(docs.length > 1){
            
            let x = docs.length - 1
            for(var i = x ;i>=0; i--){
            console.log(i,'b')
            
            //console.log(docs[i],'black skinhead')
            
            list.push(docs[i])
            list.sort((x, y) =>  y.numDate - x.numDate)
            console.log(list,'list yacho')
            
            
            
            
            
            num  = docs.length
            }
            
            }else if(docs.length == 1){
            
            list.push(docs[0])
            console.log(list,'list')
            }else{
            console.log('inquisition')
            }
            //})
            
            
            res.render('messagesTeachers/sent',{list:list, num:num,sent:sent,pro:pro})
            })
            
            })
            
            
            
            router.get('/archiveXX',isLoggedIn,teacher,function(req,res){
            var id = req.user.id
            var list = []
            var num
            
            Recepient.find({recepientId :id, status:'active', statusXX:'yes', archive:'yes'},function(err,klocs){
            
              for(var c = 0 ; c <klocs.length;c++){
              
                let recIdX = klocs[c].msgId
              
                      Message.find({msgId:recIdX},function(err,  docs){
              for(var i = 0; i<docs.length;i++){
                let date = docs[i].date
                let Vid = docs[i]._id
                let timeX = moment(date)
                let timeX2 =timeX.fromNow()
                let timeX3 =timeX.format("LLL")
                console.log(timeX2,'timex2')
            
            
                Message.findByIdAndUpdate(Vid,{$set:{status4:timeX2,status5:timeX3}},function(err,locs){
            
                
                
               // Format relative time using negative value (-1).
            
                 
               })
              }
            })
            }
            res.redirect('/teacher/archive')
            
            })
            
            })
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            router.get('/archive',isLoggedIn,teacher,function(req,res){
            var id = req.user.id
            const list2 =[]
            const list = []
            var num = req.user.inboxNo
            var pro = req.user
            var sent = req.user.sent
            
            Recepient.find({recepientId :id, status:'active', statusXX:'yes', archive:'yes'},function(err,klocs){
            
            for(var c = 0 ; c <klocs.length;c++){
            
              let recIdX = klocs[c].msgId
            
                    Message.find({msgId:recIdX},function(err,  docs){
            
            console.log(docs.length,'mainstream')
            if(docs.length > 1){
            
            let x = docs.length - 1
            for(var i = x ;i>=0; i--){
            console.log(i,'b')
            
            //console.log(docs[i],'black skinhead')
            
            list.push(docs[i])
            list.sort((x, y) =>  y.numDate - x.numDate)
            console.log(list,'list yacho')
            
            
            
            
            
            num  = docs.length
            }
            
            }else{
            
            list.push(docs[0])
            console.log(list,'list')
            }
            //})
            })
            }      
            
            res.render('messagesTeachers/sent',{list:list, num:num,sent:sent,pro:pro})
                   
            })
            
            })
            
            
            
            
            router.post('/marked',isLoggedIn,teacher,function(req,res){
            let code = req.body.code
            console.log(code,'code')
            let id = req.user.id
            Recepient.find({ msgId:code, recepientId:id },function(err,docs){
            let nId = docs[0]._id
            if(docs[0].statusX == 'unmarked'){
            Recepient.findByIdAndUpdate(nId,{$set:{statusX:'marked'}},function(err,nocs){
            
            })
            }else{
            Recepient.findByIdAndUpdate(nId,{$set:{statusX:'unmarked'}},function(err,nocs){
            
            })
            
            }
            
            })
            })
            
            router.post('/archiveX',isLoggedIn,teacher,function(req,res){
            
            let id = req.user.id
            Recepient.find({ statusX:'marked', recepientId:id },function(err,docs){
            
            for(var i = 0; i<docs.length;i++){
            
            
            Recepient.findByIdAndUpdate(docs[i]._id,{$set:{archive:'yes',statusXX:'yes'}},function(err,nocs){
            
            })
            
            }
            
            res.send(docs)
            })
            })
            
            
            
            router.post('/readX',isLoggedIn,teacher,function(req,res){
            
            let id = req.user.id
            Recepient.find({ statusX:'marked', recepientId:id },function(err,docs){
            
            for(var i = 0; i<docs.length;i++){
            
            
            Recepient.findByIdAndUpdate(docs[i]._id,{$set:{read:'yes',statusXX:'yes'}},function(err,nocs){
            
            })
            
            }
            
            res.send(docs)
            })
            })
            
            
            
            
            
            
            
            
            router.post('/delete',isLoggedIn,teacher,function(req,res){
            
            let id = req.user.id
            Recepient.find({ statusX:'marked', recepientId:id },function(err,docs){
            
            for(var i = 0; i<docs.length;i++){
            
            
            Recepient.findByIdAndUpdate(docs[i]._id,{$set:{status:'deleted',statusXX:'yes'}},function(err,nocs){
            
            })
            
            }
            
            res.send(docs)
            })
            })
            
            
              router.get('/compose',isLoggedIn,teacher,  function(req,res){
                var num = req.user.inboxNo
                var sent = req.user.sent
                var pro = req.user
                res.render('messagesTeachers/compose',{num:num,sent:sent,pro:pro})
              })
            
             
              router.post('/userX',isLoggedIn,teacher,function(req,res){
                var id =req.user._id
                var arr = []
                User.find({},function(err,docs){
                  console.log(docs.length,'length')
                  for(var i = 0; i< docs.length;i++){
            if(docs[i]._id != id){
            console.log(docs[i]._id,'success')
            arr.push(docs[i])
            }else
            console.log(docs[i]._id,'failed')
            
                  }
                  res.send(arr)
                })
              })
            
            
            
            router.post('/dataX',isLoggedIn,teacher,function(req,res){
            var m = moment()
            var year = m.format('YYYY')
            var numDate = m.valueOf()
            var date = m.toString()
            var senderId = req.user._id
            var senderName = req.user.fullname
            var senderPhoto = req.user.photo
            var senderEmail = req.user.email
            
            var uid = req.user._id
            
            
            
            console.log(req.body['code[]'])
            let code = req.body['code[]']
            var sub = req.body.code1
            let msg = req.body.code2
            
            
            
            var ms = new Message()
            
            ms.senderId = senderId
            ms.senderName = senderName
            ms.senderPhoto = senderPhoto
            ms.senderEmail = senderEmail
            ms.msgId = 'null'
            ms.msg = msg
            ms.status = 'reply'
            ms.status4 = 'null'
            ms.status5 = 'null'
            
            ms.type = 'original'
            ms.subject = sub
            ms.numDate = numDate
            ms.date = date
            
            ms.save().then(ms=>{
            
              Message.findByIdAndUpdate(ms._id,{$set:{msgId:ms._id}},function(err,nocs){
            
              })
              for(var i = 0;i<code.length - 1;i++){
                User.findById(code[i],function(err,doc){
               
                let recepientName = doc.fullname
                let recepientId = doc._id
                let recepientEmail = doc.email
                let msgId = ms._id
                Recepient.find({msgId:ms._id,recepientId:recepientId},function(err,tocs){
                  let size = tocs.length
               
             
                  if(tocs.length == 0){
                    let rec = new Recepient()
            
                  
                   
                    rec.msgId = msgId
                    rec.recepientName = recepientName
                    rec.recepientId= recepientId
                    rec.numDate = numDate
                    rec.status = 'active'
                    rec.statusX = 'unmarked'
                    rec.statusXX ='null'
                    rec.statusCheck = 'not viewed'
                    rec.read = 'null'
                    rec.archive = 'null'
                    rec.recepientEmail = recepientEmail
                    rec.save()
            
                  }
                 
            
                })
              })
            }
            res.redirect('/teacher/sentX')
            })
            
            
            
            
            
            })
            
            router.get('/reply/:id', isLoggedIn,teacher, function(req,res){
            var id = req.params.id
            var uid = req.user._id
            console.log(id,'id')
            var arr = []
            Message.find({msgId:id},function(err,tocs){
              console.log(tocs,'tocs')
            arr.push(tocs[0].senderEmail)
            let sub = tocs[0].subject
            Message.find({msgId:id,status:'reply'},function(err,docs){
            Recepient.find({msgId:id},function(err,nocs){
            for(var i = 0; i<nocs.length;i++){
            console.log(nocs[i].recepientEmail,'email')
            arr.push(nocs[i].recepientEmail)
            
            
            let date = nocs[i].date
            let Vid = nocs[i]._id
            let timeX = moment(date)
            let timeX2 =timeX.fromNow()
            let timeX3 =timeX.format("LLL")
            console.log(timeX2,'timex2')
            var pro = req.user
            
            Message.findByIdAndUpdate(Vid,{$set:{status4:timeX2,status5:timeX3}},function(err,locs){
            
            
            
            // Format relative time using negative value (-1).
            
            
            })
            
            }
            console.log(arr,'arr')
            
            res.render('messagesTeachers/reply',{list:docs,id:id, arr:arr, subject:sub,pro:pro})
            })
            
            })
            })
            })
            
            
            
            router.post('/reply/:id', isLoggedIn,teacher, function(req,res){
            var m = moment()
            var year = m.format('YYYY')
            var numDate = m.valueOf()
            var id = req.params.id
            var senderId = req.user._id
            var senderName = req.user.fullname
            var senderEmail = req.user.email
            var sub = req.body.compose_subject
            let msg = 'vocal tone'
            
            Message.findById({msgId:id},function(err,docs){
            
            
            
            
            
            
            var ms = new Message()
            
            ms.senderId = senderId
            ms.senderName = senderName
            ms.senderEmail = senderEmail
            ms.msgId = id
            ms.msg = msg
            ms.status = 'reply'
            ms.status4 = 'null'
            ms.status5 = 'null'
            ms.type = 'reply'
            ms.numDate = numDate
            ms.subject = sub
            ms.date = date
            
            ms.save().then(ms=>{
            console.log(ms._id,'msgId')
            
            
            
            let date = ms.date
            let Vid = ms._id
            let timeX = moment(date)
            let timeX2 =timeX.fromNow()
            let timeX3 =timeX.format("LLL")
            console.log(timeX2,'timex2')
            
            
            Message.findByIdAndUpdate(Vid,{$set:{status4:timeX2,status5:timeX3}},function(err,locs){
            
            
            
            // Format relative time using negative value (-1).
            
            
            })
            
            })
            
            
            
            })
            
            
            
            
            
            })
            
            
            
            
            router.post('/replyX/:id',isLoggedIn,teacher,function(req,res){
            console.log(req.body.code1,'code1')
            console.log(req.body['compose_to[]'],'compose_to')
            let code = req.body.code1
            var sub = req.body.code1
            let id = req.params.id
            var arr = []
            Message.find({msgId:id,},function(err,tocs){
            console.log(tocs)
            arr.push(tocs[0].senderId)
            
            Recepient.find({msgId:id},function(err,nocs){
            for(var i = 0; i<nocs.length;i++){
            console.log(nocs[i].recepientId,'email')
            arr.push(nocs[i].recepientId)
            
            }
            
            
            res.send(arr)
            })
            
            })
            
            })
            
            
            router.post('/replyX2/:id',isLoggedIn,teacher,function(req,res){
            var m = moment()
            var year = m.format('YYYY')
            var numDate = m.valueOf()
            var date = m.toString()
            var msgId = req.params.id
            var senderId = req.user._id
            var senderName = req.user.fullname
            var senderPhoto = req.user.photo
            var senderEmail = req.user.email
            
            var uid = req.user._id
            
            
            
            console.log(req.body['code[]'])
            let code = req.body['code[]']
            var sub = req.body.code1
            let msg = req.body.code2
            
            
            
            var ms = new Message()
            
            ms.senderId = senderId
            ms.senderName = senderName
            ms.senderPhoto = senderPhoto
            ms.senderEmail = senderEmail
            ms.msgId = msgId
            ms.msg = msg
            ms.status = 'reply'
            ms.status4 = 'null'
            ms.status5 = 'null'
            ms.type = 'reply'
            ms.numDate = numDate
            ms.subject = sub
            ms.date = date
            
            ms.save().then(ms=>{
            
            
              for(var i = 0;i<code.length - 1;i++){
                User.findById(code[i],function(err,doc){
               
                let recepientName = doc.fullname
                let recepientId = doc._id
                let recepientEmail = doc.email
                
                Recepient.find({msgId:msgId,recepientId:recepientId},function(err,tocs){
                  let size = tocs.length
               
             
                  if(tocs.length == 0){
                    let rec = new Recepient()
            
                  
                   
                    rec.msgId = msgId
                    rec.recepientName = recepientName
                    rec.recepientId= recepientId
                    rec.numDate = numDate
                    rec.status = 'active'
                    rec.statusX = 'unmarked'
                    rec.statusXX = 'null'
                    rec.read = 'null'
                    rec.statusCheck = 'not viewed'
                    rec.archive = 'null'
                    rec.recepientEmail = recepientEmail
                    rec.save()
                  }else{
                    Recepient.findByIdAndUpdate(tocs[0]._id,{$set:{statusCheck:"not viewed"}},function(err,locs){
            
            
            
                      // Format relative time using negative value (-1).
                      
                       
                      })
            
                  }
                 
            
                })
              })
            }
            
            let date = ms.date
            let Vid = ms._id
            let timeX = moment(date)
            let timeX2 =timeX.fromNow()
            let timeX3 =timeX.format("LLL")
            console.log(timeX2,'timex2')
            
            
            Message.findByIdAndUpdate(Vid,{$set:{status4:timeX2,status5:timeX3}},function(err,locs){
            
            
            
            // Format relative time using negative value (-1).
            
            
            })
            res.send(code)
            })
            
            
            })
            
            
            
            router.post('/replyX3/:id',isLoggedIn,teacher,function(req,res){
            var m = moment()
            var year = m.format('YYYY')
            var numDate = m.valueOf()
            var date = m.toString()
            var msgId = req.params.id
            var senderId = req.user._id
            var senderName = req.user.fullname
            var senderPhoto = req.user.photo
            var senderEmail = req.user.email
            
            var uid = req.user._id
            
            
            
            console.log(req.body['code[]'])
            let code = req.body['code[]']
            var sub = req.body.code1
            let msg = req.body.code2
            
            
            
            var ms = new Message()
            
            ms.senderId = senderId
            ms.senderName = senderName
            ms.senderPhoto = senderPhoto
            ms.senderEmail = senderEmail
            ms.msgId = msgId
            ms.msg = msg
            ms.status = 'reply'
            ms.status4 = 'null'
            ms.status5 = 'null'
            ms.type = 'reply'
            ms.numDate = numDate
            ms.subject = sub
            ms.date = date
            
            ms.save().then(ms=>{
            
            
              for(var i = 0;i<code.length - 1;i++){
                User.findById(code[i],function(err,doc){
               
                let recepientName = doc.fullname
                let recepientId = doc._id
                let recepientEmail = doc.email
              
                Recepient.find({msgId:msgId,recepientId:recepientId},function(err,tocs){
                  let size = tocs.length
               
             
                  if(tocs.length == 0){
                    let rec = new Recepient()
            
                  
                   
                    rec.msgId = msgId
                    rec.recepientName = recepientName
                    rec.recepientId= recepientId
                    rec.numDate = numDate
                    rec.status = 'active'
                    rec.statusX = 'unmarked'
                    rec.statusXX = 'null'
                    rec.statusCheck = 'not viewed'
                    rec.read = 'null'
                    rec.archive = 'null'
                    rec.recepientEmail = recepientEmail
                    rec.save()
            
                  } else{
            
                  Recepient.findByIdAndUpdate(tocs[0]._id,{$set:{statusCheck:"not viewed"}},function(err,locs){
            
            
            
                    // Format relative time using negative value (-1).
                    
                     
                    })
                  }
                 
            
                })
              })
            }
            
            let date = ms.date
            let Vid = ms._id
            let timeX = moment(date)
            let timeX2 =timeX.fromNow()
            let timeX3 =timeX.format("LLL")
            console.log(timeX2,'timex2')
            
            
            Message.findByIdAndUpdate(Vid,{$set:{status4:timeX2,status5:timeX3}},function(err,locs){
            
            
            
            // Format relative time using negative value (-1).
            
            
            })
            res.send(code)
            
            })
            })
            
            
            
            
        //create & post assignment    


router.get('/assgt',isLoggedIn,teacher,function(req,res){
 /* var companyId = req.user.companyId
  Class1.find({companyId:companyId},function(err,focs){
  
    arr = focs
  res.render('teacherExam/assgt',{arr:arr})
  })*/

  
  var arr = []
  var arr1 = []
  var user = req.user.term
  var teacherId = req.user.uid
  var pro = req.user
  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
  var companyId = req.user.companyId
  var subject = req.user.subjects
  var subjectCode = req.user.subjectCode
  var grade = req.user.grade
  var icon = req.user.icon
  Class1.find({companyId:companyId}, function(err,docs){
    Topic.find({subjectCode:subjectCode},function(err,zoc){
  
   var arr2 = zoc
  var arr1 = docs;  
  
  res.render('teacherExam/assgt',{ arr1:arr1,arr2:arr2, user:user,icon:icon, pro:pro, subject:subject,subjectCode:subjectCode, grade:grade,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})
  
  })
  })
})


//add assgt
 
router.post('/assgt',isLoggedIn,teacher, function(req,res){
  var pro = req.user
  var day = req.body.day
  var m2 = moment()
  var mformat = m2.format('L')
  var m = moment(day)
  var displayFormat = m.format('MMMM Do YYYY')
  var dateValueOf = m2.valueOf()
  var year = m.format('YYYY')
  var month = m.format('MMMM')
 
  var mformatD = m.format("L")
  var dateValueOfD = m.valueOf()
  var teacherName = req.user.fullname;
  var teacherId = req.user.uid;
var question = req.body.question;
var marks = req.body.marks;
var subjectName = req.body.subject
var subjectCode = req.body.subjectCode
var class1 = req.body.class1;
var type = req.body.type
var grade = req.body.grade
var icon = req.body.icon
console.log(icon,'icon')
var term = req.user.term
var arr1 = []
var companyId = req.user.companyId
var topic = req.body.topic
var numDate = m.valueOf()

//clas.start =    m.format("YYYY-MM-DD")+"T"+start;
//clas.end =    m.format("YYYY-MM-DD")+"T"+end;

req.check('subject','Enter Subject').notEmpty();
req.check('subjectCode','Enter Subject Code').notEmpty();
req.check('class1','Enter Class').notEmpty();
req.check('day','Enter Deadline Day').notEmpty();
req.check('question','Enter Question').notEmpty();
req.check('marks','Enter Marks').notEmpty();



var errors = req.validationErrors();
     
if (errors) {

  /*  Class1.find({companyId:companyId},function(err,focs){*/
  
    /*arr = focs*/
  req.session.errors = errors;
  req.session.success = false
 /* res.render('teacherExam/assgt',{errors:req.session.errors,  arr:arr,pro:pro})
  })*/

  


  req.flash('danger', req.session.errors[0].msg);
       
        
        res.redirect('/teacher/assgt');
}

else 
{
TeacherSub.findOne({'companyId':companyId,'subjectCode':subjectCode})
.then(teach=>{
  if(teach){
  
     
    
        
      

         // console.log(nformat3,'3333')
         // let nmoment = moment(nformat)
          //console.log(nmoment,'ccc')



          var test = Test();
          test.date = day;
          test.subject = subjectName;
          test.subjectCode = subjectCode;
          test.class1 = class1;
          test.year = year;
          test.name = day +" "+class1;
          test.month  = month;
          test.numDate = numDate
          test.teacher = req.user.uid;
          test.numberOfStudents = 0;
          test.passRate = 0;
          test.term = term;
          test.displayFormat = displayFormat
          test.topic = topic;
          test.question = question;
          test.possibleMark = marks
          test.icon = icon
          test.highScore = 0
          test.lowestScore=0;
          test.dateValue = dateValueOf
          test.numPasses=0
          test.avgMark=0
          test.mformat = mformat
          test.possibleMark = marks
          test.type = type
          test.type2 = 'online assignment'
          test.type3 = 'class'
          test.grade = req.body.grade;
          test.level = 'highschool';
          test.companyId = companyId
          test.status = 'null'
          test.timeLeft= 'null'
          test.examStatus = 'null'
          test.examLink = 'null'
          test.time = 'null'
          test.teacherId = teacherId
          test.teacherName = teacherName
          test.quizNo = 0
          test.quizBatch = 0
          test.quizId = 'null'
          test.duration =0
          test.status2= 'null'
          test.dateValue2= 0
          
          test.displayFormat = displayFormat
          
          
          test.save()
          .then(tesn =>{









      
StudentSub.find({subjectCode:subjectCode},function(err,docs){
for(var i = 0;i<docs.length;i++){
let studentId = docs[i].studentId
let studentName = docs[i].studentName
let photo = docs[i].photo





        var lesson = new TestX();
    
   
        lesson.question = question;
        lesson.uid = studentId
        lesson.fullname = studentName
        lesson.mark = 0;
        lesson.possibleMark = marks
        lesson.class1 = class1;
        lesson.icon = icon
        lesson.dateValue = dateValueOf
        lesson.dateValueD = dateValueOfD
        lesson.status = 'active'
        lesson.date = mformat
        lesson.displayFormat = displayFormat
        lesson.subject = subjectName;
        lesson.subjectCode = subjectCode;
        lesson.mformat = mformat
        lesson.mformatD = mformatD
        lesson.deadline= day;
        lesson.teacherId=teacherId
        lesson.teacher = teacherName
        lesson.topic = topic
        lesson.type = type
        lesson.term = term
        lesson.month = month
        lesson.year = year
        lesson.grade = grade
        lesson.assignmentId = tesn._id
        lesson.filename = 'null'
        lesson.mformatS = 'null'
        lesson.dateValueS = 0
        lesson.displayFormatS = 'null'
        lesson.submissionStatus = 'pending'
        lesson.color = 'null'
        lesson.style = 'null'
        lesson.size = 0
        lesson.photo = photo
        lesson.possibleMark = marks
        lesson.symbol = 'null'
        lesson.result = 'null'
        lesson.quizId =tesn._id
        lesson.percentage = 0
        lesson.type2 = 'online assignment'
        lesson.type3 = 'class'
        lesson.status3 = 'null'
        lesson.companyId = companyId
     
        
    
      lesson.save()
      .then(less =>{
       /* Room.find({companyId:companyId},(err, wocs) => {
          Class1.find({companyId:companyId},function(err,focs){
            arr=focs
          arr1 = wocs
        req.session.message = {
          type:'success',
          message:'Lesson Added Successfully'
        }     
       
res.render('lesson/add-lesson',{message:req.session.message,fullname:fullname, teacherId:teacherID,arr:arr, arr1:arr1,pro:pro})
      })
    })*/
       

      })

    }


  })
      
    })
    
    req.flash('success', 'Assignment Posted Successfully!');
  
    res.redirect('/teacher/assgt')
  }
  else{
  
      Class1.find({companyId:companyId},function(err,focs){
        arr = focs
 
    req.session.message = {
      type:'errors',
      message:'Subject Code does not exist'
    }     
       res.render('teacherExam/assgt', {
          message:req.session.message, fullname:fullname, teacherId:teacherID,arr:arr, pro:pro})
       })
    
      
  }
})


}




})

/*
router.get('/viewClassAssignments',isLoggedIn,function(req,res){
  var id = req.user.testId
  var pro = req.user
  var teacherId = req.user.uid
  Test.find({teacherId:teacherId,type2:"online assignment"},function(err,docs){
    res.render('exam/list',{     listX:docs,pro:pro})
  })

})





router.get('/studentAssgt',isLoggedIn,function(req,res){
  var uid = req.user.uid
 TestX.find({type2:'online assignment',submissionStatus:'submitted',teacherId:uid},function(err,docs){
res.render('teachers/listAss',{listX:docs})
  })
})
*/

//download assgt
router.get('/download/:id',isLoggedIn,teacher,function(req,res){
  TestX.findById(req.params.id,function(err,doc){
    var name = doc.filename;
    res.download( './public/uploads/'+name, name)
  })  

})



//posted assignment

router.get('/viewAssignments',isLoggedIn,teacher,function(req,res){
  var id = req.user.testId
  var pro = req.user
  var teacherId = req.user.uid
  var term = req.user.term

  var n = moment()
  var year = n.format('YYYY')
  Test.find({teacherId:teacherId,type2:"online assignment",term:term,year:year},function(err,docs){
    res.render('exam/assgtList',{  id:id,listX:docs,pro:pro})
  })

})

router.post('/viewAssignments',isLoggedIn,teacher,function(req,res){
  var pro =req.user

  var date = req.body.date
  var arr = []
  var term = req.user.term
var teacherId = req.user.uid
var n = moment()
var year = n.format('YYYY')
  
  var m = moment(date)

 

  console.log(date.split('-')[0])
  var startDate = date.split('-')[0]
  var endDate = date.split('-')[1]
   var startValueA = moment(startDate)
   var startValueB=startValueA.subtract(1,"days");
   var startValue = moment(startValueB).valueOf()

   var endValueA = moment(endDate)
   var endValueB = endValueA.add(1,"days");
   var endValue= moment(endValueB).valueOf()
  console.log(startValue,endValue,'output')

  Test.find({type2:"online assignment",teacherId:teacherId,year:year,term:term},function(err, docs){
//console.log(docs,'777')
    if(docs){


    for(var i = 0;i<docs.length;i++){
      let sdate = docs[i].dateValue
      if(sdate >= startValue && sdate <= endValue){
arr.push(docs[i])
//console.log(arr,'arr333')
      }
    }
  }
      
    console.log(arr,'arr')
        res.render("exam/assgtList", {
          listX:arr,pro:pro,
          
        });
    
});
    
  })

//outputs students who have submitted assignmets and teacher can download the assignment and enter marks
router.get('/viewAssignments/:id',isLoggedIn,teacher,function(req,res){
  var id = req.params.id
  var pro = req.user
  var uid = req.user.uid
 TestX.find({type2:'online assignment',submissionStatus:'submitted',teacherId:uid,quizId:id},function(err,docs){
res.render('teachers/assgtList',{listX:docs,pro:pro,id:id})
  })

})





router.post('/viewAssignments/:id',isLoggedIn,teacher,function(req,res){
  var pro =req.user
var id = req.params.id
  var date = req.body.date
  var arr = []
  var term = req.user.term
var teacherId = req.user.uid
var n = moment()
var year = n.format('YYYY')
  
  var m = moment(date)

 

  console.log(date.split('-')[0])
  var startDate = date.split('-')[0]
  var endDate = date.split('-')[1]
   var startValueA = moment(startDate)
   var startValueB=startValueA.subtract(1,"days");
   var startValue = moment(startValueB).valueOf()

   var endValueA = moment(endDate)
   var endValueB = endValueA.add(1,"days");
   var endValue= moment(endValueB).valueOf()
  console.log(startValue,endValue,'output')

  TestX.find({type2:'online assignment',submissionStatus:'submitted',teacherId:teacherId,quizId:id,year:year,term:term},function(err, docs){
//console.log(docs,'777')
    if(docs){


    for(var i = 0;i<docs.length;i++){
      let sdate = docs[i].dateValue
      if(sdate >= startValue && sdate <= endValue){
arr.push(docs[i])
console.log(arr,'arr333')
      }
    }
  }
      
    console.log(arr,'arr')
        res.render("teachers/assgtList", {
          listX:arr,id:id,pro:pro,
          
        });
    
});
    
  })
//ouputs the assignment with the question and marks
router.get('/viewAssignment/:id',isLoggedIn,teacher,function(req,res){
  var id = req.params.id
  var pro = req.user
  var uid = req.user.uid
 Test.findById(id,function(err,doc){
res.render('teachers/assgt',{doc:doc,pro:pro})
  })

})


//student registered subjects
router.get('/subjects',isLoggedIn,teacher,function(req,res){
     var pro = req.user
var uid = req.user.uid
var companyId = req.user.companyId
TeacherSub.find({companyId:companyId,teacherId:uid},(err, docs) => {
if (!err) {
res.render('teachers/subjectList', {
 listX:docs, pro:pro

});
}
});



})







// role teacher 
router.get('/classWork',isLoggedIn,teacher,function(req,res){
  var id = req.user.testId
  var pro = req.user
  TestX.find({quizId:id},function(err,docs){
    res.render('exam/resultUpdate',{     listX:docs,pro:pro})
  })

})



router.post('/classwork/',isLoggedIn,teacher,function(req,res){
  var pro =req.user
  var id = req.user.testId
  var date = req.body.date
  var arr = []
  var term = req.user.term
var teacherId = req.user.uid
var n = moment()
var year = n.format('YYYY')
  
  var m = moment(date)

 

  console.log(date.split('-')[0])
  var startDate = date.split('-')[0]
  var endDate = date.split('-')[1]
   var startValueA = moment(startDate)
   var startValueB=startValueA.subtract(1,"days");
   var startValue = moment(startValueB).valueOf()

   var endValueA = moment(endDate)
   var endValueB = endValueA.add(1,"days");
   var endValue= moment(endValueB).valueOf()
  console.log(startValue,endValue,'output')

  TestX.find({quizId:id},function(err,docs){
console.log(docs,'777')
    if(docs){


    for(var i = 0;i<docs.length;i++){
      let sdate = docs[i].dateValue
      if(sdate >= startValue && sdate <= endValue){
arr.push(docs[i])
console.log(arr,'arr333')
      }
    }
  }
      
    console.log(arr,'arr')
        res.render("exam/resultUpdate", {
          listX:arr,pro:pro,
          
        });
    
});
    
  })
//
router.get('/viewClassWorkX',isLoggedIn,teacher,function(req,res){
  var id = req.user.testId
  var pro = req.user
  var teacherId = req.user.uid
  TestX.find({teacherId:teacherId},function(err,docs){
    res.render('exam/listX',{     listX:docs,pro:pro})
  })

})

//test List
router.get('/viewClassWork',isLoggedIn,teacher,function(req,res){
  var id = req.user.testId
  var pro = req.user
  var teacherId = req.user.uid
  var term = req.user.term
  var n = moment()
var year = n.format('YYYY')
  Test.find({teacherId:teacherId,year:year,term},function(err,docs){
    res.render('exam/list',{     listX:docs,pro:pro})
  })

})



router.post('/viewClasswork/',isLoggedIn,teacher,function(req,res){
  var pro =req.user
var id = req.params.id
  var date = req.body.date
  var arr = []
  var term = req.user.term
var teacherId = req.user.uid
var n = moment()
var year = n.format('YYYY')
  
  var m = moment(date)

 

  console.log(date.split('-')[0])
  var startDate = date.split('-')[0]
  var endDate = date.split('-')[1]
   var startValueA = moment(startDate)
   var startValueB=startValueA.subtract(1,"days");
   var startValue = moment(startValueB).valueOf()

   var endValueA = moment(endDate)
   var endValueB = endValueA.add(1,"days");
   var endValue= moment(endValueB).valueOf()
  console.log(startValue,endValue,'output')


  Test.find({teacherId:teacherId,term:term,year:year},function(err, docs){
//console.log(docs,'777')
    if(docs){


    for(var i = 0;i<docs.length;i++){
      let sdate = docs[i].dateValue
      if(sdate >= startValue && sdate <= endValue){
arr.push(docs[i])
//console.log(arr,'arr333')
      }
    }
  }
      
    //console.log(arr,'arr')
        res.render("exam/list", {
          listX:arr,id:id,pro:pro,
          
        });
    
});
    
  })
  
//view test
router.get('/viewClassWork/:id',isLoggedIn,teacher,function(req,res){
  var id = req.params.id
  var pro = req.user
  var teacherId = req.user.uid
  TestX.find({quizId:id},function(err,docs){
    res.render('exam/resultUpdate',{ id:id,    listX:docs,pro:pro})
  })

})




router.post('/viewClasswork/:id',isLoggedIn,teacher,function(req,res){
  var pro =req.user
var id = req.params.id
  var date = req.body.date
  var arr = []
  var term = req.user.term
var teacherId = req.user.uid
var n = moment()
var year = n.format('YYYY')
  
  var m = moment(date)

 

  console.log(date.split('-')[0])
  var startDate = date.split('-')[0]
  var endDate = date.split('-')[1]
   var startValueA = moment(startDate)
   var startValueB=startValueA.subtract(1,"days");
   var startValue = moment(startValueB).valueOf()

   var endValueA = moment(endDate)
   var endValueB = endValueA.add(1,"days");
   var endValue= moment(endValueB).valueOf()
  console.log(startValue,endValue,'output')


  TestX.find({quizId:id},function(err, docs){
console.log(docs,'777')
    if(docs){


    for(var i = 0;i<docs.length;i++){
      let sdate = docs[i].dateValue
      if(sdate >= startValue && sdate <= endValue){
arr.push(docs[i])
console.log(arr,'arr333')
      }
    }
  }
      
    console.log(arr,'arr')
        res.render("exam/resultUpdate", {
          listX:arr,id:id,pro:pro,
          
        });
    
});
    
  })
//calendar Chart

router.post('/calendarChart',isLoggedIn,teacher,function(req,res){
  var uid = req.user.uid

  var arr = []
 Lesson.find({teacherId:uid},function(err,docs){
   /* for(var i = 0;i<docs.length;i++){
      let subjectCode = docs[i].subjectCode

      StudentSub.find({subjectCode:subjectCode,studentId:uid},function(err,nocs){
        console.log(nocs.length,'length')
        if(nocs.length > 0){

      arr.push(docs[i])
     
      
        }
      })
  
    }*/
    
    res.send(docs)
   // console.log(arr,'arr')
  })

})



//teacher lesson timetable
/*
router.get('/timetable',isLoggedIn, (req, res) => {
     var pro = req.user
var term = req.user.term
var m = moment();
var uid = req.user.uid
var year = m.format('YYYY')
var companyId = req.user.companyId
Lesson.find({companyId:companyId,term:term,year:year,teacherId:uid},(err, docs) => {
if (!err) {
res.render("teacher/timetable", {
   list:docs,pro:pro
  
});
}
});
});*/

router.get('/timetable',isLoggedIn,teacher, (req, res) => {
  var pro = req.user
var term = req.user.term
var m = moment();
var uid = req.user.uid

res.render("teachers/timetable",{pro:pro});

});


router.get('/events',isLoggedIn,teacher, (req, res) => {
  var pro = req.user
var term = req.user.term
var m = moment();
var uid = req.user.uid

res.render("teachers/events");

});



router.get('/examList',isLoggedIn,teacher, (req, res) => {
  var pro = req.user
var term = req.user.term
var m = moment();
var uid = req.user.uid

res.render("teachers/timetableExam",{pro:pro});

});


//view classWork results
router.get('/viewClassWork2',isLoggedIn,teacher, (req, res) => {
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


///////subject batch
router.get('/subBatch',isLoggedIn,teacher,function(req,res){
  var pro = req.user
  var successMsg = req.flash('success')[0];
   res.render('exam/batch2',{pro:pro,successMsg: successMsg, noMessages: !successMsg})
})



router.post('/subBatch',isLoggedIn,teacher,  function(req,res){
  var subjectCode = req.body.subjectCode;
  var subject = req.body.subject
  var grade = req.body.grade
  var id = req.user._id
 var icon = req.body.icon
  
  
  req.check('subject','Enter Subject').notEmpty();
  req.check('subjectCode','Enter Subject Code').notEmpty();
  

  
  var errors = req.validationErrors();
   
  if (errors) {
    req.session.errors = errors;
    req.session.success = false;
   // res.render('exam/batch2',{ errors:req.session.errors,pro:pro})

   req.flash('success', req.session.errors[0].msg);
       
        
        res.redirect('/teacher/subBatch');
  
  }
  
  else {
  
  TeacherSub.findOne({'subjectName':subject,'subjectCode':subjectCode,'grade':grade})
  .then(sub =>{
  
    if(sub){

   
     
            User.findByIdAndUpdate(id,{$set:{subjects:subject,subjectCode:subjectCode,grade:grade,icon:icon}}, function(err,coc){
          
        
    })
    res.redirect('/teacher/classWorkBatch')
  }else{
    console.log('ma1')
    req.flash('success', 'Subject Does Not Exist!');
   
    
    res.redirect('/teacher/subBatch');
   //res.render('product/update',{}) 
  }

  
  
  })

}
  

  })



  //subbatch exam
  ///////subject batch
router.get('/subBatchExam',isLoggedIn,teacher,function(req,res){
  var pro = req.user
  var successMsg = req.flash('success')[0];
   res.render('exam/batch2Exam',{pro:pro,successMsg: successMsg, noMessages: !successMsg})
})



router.post('/subBatchExam',isLoggedIn,teacher,  function(req,res){
  var subjectCode = req.body.subjectCode;
  var subject = req.body.subject
  var grade = req.body.grade
  var id = req.user._id
 var icon = req.body.icon
  
  
  req.check('subject','Enter Subject').notEmpty();
  req.check('subjectCode','Enter Subject Code').notEmpty();
  

  
  var errors = req.validationErrors();
   
  if (errors) {
    req.session.errors = errors;
    req.session.success = false;
   // res.render('exam/batch2',{ errors:req.session.errors,pro:pro})

   req.flash('success', req.session.errors[0].msg);
       
        
        res.redirect('/teacher/subBatchExam');
  
  }
  
  else {
  
  TeacherSub.findOne({'subjectName':subject,'subjectCode':subjectCode,'grade':grade})
  .then(sub =>{
  
    if(sub){

   
     
            User.findByIdAndUpdate(id,{$set:{subjects:subject,subjectCode:subjectCode,grade:grade,icon:icon}}, function(err,coc){
          
        
    })
    res.redirect('/teacher/batchExam')
  }else{
    console.log('ma1')
    req.flash('success', 'Subject Does Not Exist!');
   
    
    res.redirect('/teacher/subBatchExam');
   //res.render('product/update',{}) 
  }

  
  
  })

}
  

  })



  
///////subject batch
router.get('/assignmentBatch',isLoggedIn,teacher,function(req,res){
  var pro = req.user
  var successMsg = req.flash('success')[0];
   res.render('teachers/batch2',{pro:pro,successMsg: successMsg, noMessages: !successMsg})
})



router.post('/assignmentBatch',isLoggedIn,teacher,  function(req,res){
  var subjectCode = req.body.subjectCode;
  var subject = req.body.subject
  var grade = req.body.grade
  var id = req.user._id
 var icon = req.body.icon
  
  
  req.check('subject','Enter Subject').notEmpty();
  req.check('subjectCode','Enter Subject Code').notEmpty();
  

  
  var errors = req.validationErrors();
   
  if (errors) {
    req.session.errors = errors;
    req.session.success = false;
   // res.render('exam/batch2',{ errors:req.session.errors,pro:pro})

   req.flash('success', req.session.errors[0].msg);
       
        
        res.redirect('/teacher/assignmentBatch');
  
  }
  
  else {
  
  TeacherSub.findOne({'subjectName':subject,'subjectCode':subjectCode,'grade':grade})
  .then(sub =>{
  
    if(sub){

   
     
            User.findByIdAndUpdate(id,{$set:{subjects:subject,subjectCode:subjectCode,grade:grade,icon:icon}}, function(err,coc){
          
        
    })
    res.redirect('/teacher/assgt')
  }else{
    console.log('ma1')
    req.flash('success', 'Subject Does Not Exist!');
   
    
    res.redirect('/teacher/assignmentBatch');
   //res.render('product/update',{}) 
  }

  
  
  })

}
  

  })
router.get('/autocompleteSubX/',isLoggedIn,teacher, function(req, res, next) {

   
  var regex= new RegExp(req.query["term"],'i');
  var teacherName = req.user.fullname
 
  var uidFilter =TeacherSub.find({teacherName:teacherName, subjectCode:regex},{'subjectCode':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);

  
  uidFilter.exec(function(err,data){
 

console.log('data',data)

var result=[];

if(!err){
   if(data && data.length && data.length>0){
     data.forEach(sub=>{

      
   

        
       let obj={
         id:sub._id,
         label: sub.subjectCode,

   
        
     

         
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
router.post('/autoSubX',isLoggedIn,teacher,function(req,res){
  var code = req.body.code


TeacherSub.find({subjectCode:code},function(err,docs){
 if(docs == undefined){
   res.redirect('/dash')
 }else

    res.send(docs[0])
  })


})
 

//creating batch for classwork results
router.get('/classWorkBatch',isLoggedIn,teacher,  function(req,res){
  var arr = []
  var arr1 = []
  var user = req.user.term
  var teacherId = req.user.uid
  var pro = req.user
  var companyId = req.user.companyId
  var subject = req.user.subjects
  var subjectCode = req.user.subjectCode
  var grade = req.user.grade

  
  
  
  Class1.find({companyId:companyId}, function(err,docs){
    Topic.find({subjectCode:subjectCode},function(err,zoc){
  
   var arr2 = zoc
  var arr1 = docs;  
  
  res.render('exam/batch',{ arr1:arr1,arr2:arr2, user:user, pro:pro, subject:subject,subjectCode:subjectCode, grade:grade})
  
  })
  })
  
  })




router.post('/classWorkBatch',isLoggedIn,teacher,  function(req,res){
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
var m = moment(date)
var year = m.format('YYYY')
var month = m.format('MMMM')
var numDate = m.valueOf()
var mformat = m.format("L")
var topic = req.body.topic
var possibleMark = req.body.possibleMark
var icon = req.user.icon

var displayFormat = m.format('MMMM Do YYYY')


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
res.render('exam/batch',{errors:req.session.errors, arr1:arr1,pro:pro,subject:subject,subjectCode:subjectCode,grade:grade})
})


}

else{

Test.findOne({'companyId':companyId,'date':date,'class1':class1,'subjectCode':subjectCode,'type':type,'topic':topic })
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
test.numDate = numDate
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
test.type2 = 'null'
test.type3 = 'class'
test.grade = req.body.grade;
test.level = 'highschool';
test.companyId = companyId
test.status = 'null'
test.timeLeft= 'null'
test.examStatus = 'null'
test.examLink = 'null'
test.time = 'null'
test.mformat = mformat
test.teacherId = teacherId
test.teacherName = teacher
test.quizNo = 0
test.quizBatch = 0
test.dateValue = numDate
test.quizId = 'null'
test.duration =0
test.status2 = 'null'
test.dateValue2= 0
test.icon = icon
test.displayFormat = displayFormat
test.question = 'null'


test.save()
.then(tesn =>{



User.findByIdAndUpdate(id,{$set:{testId:tesn._id}}, function(err,trocs){

console.log(trocs)



})

StudentSub.find({companyId:companyId,class1:class1, subjectCode:subjectCode},function(err,zoc){
  for(var i = 0; i<zoc.length;i++){
    var test = new TestX();
test.uid = zoc[i].studentId;
test.fullname = zoc[i].studentName;
test.grade = grade;
test.class1 = class1;
test.date = date
test.teacher = req.user.fullname;
test.teacherId = teacherId;
test.mark = 0;
test.dateValue = numDate
test.dateValueD =0
test.status = 'null'
test.displayFormat = 'null'
test.mformat = mformat
test.mformatD = 0
test.question = 0;
test.assignmentId = 'null'
test.filename = 'null'
test.mformatS = 'null'
test.dateValueS = 0
test.displayFormatS = 'null'
test.submissionStatus = 'null'
test.year = year
test.month = month
test.symbol = 'null';
test.term = term
test.result = "null";
test.subject = subject
test.subjectCode = subjectCode
test.percentage = 0
test.possibleMark = possibleMark;
test.type = type
test.color = 'null'
test.style = 'null'
test.icon = icon
test.deadline = 'null'
test.size = 0
test.topic = topic
test.quizId = tesn._id
test.companyId = companyId
test.type2 = 'null'
test.type3 = 'class'
test.status3 = 'null'
test.type = type
test.photo = zoc[i].photo
test.save()
.then(tes =>{

})
  }
})

//notifications






res.redirect('/teacher/classWork')



})


})



}


})



//posting Exam

router.get('/batchExam',isLoggedIn,teacher,  function(req,res){
  var arr = []
  var arr1 = []
  var user = req.user.term
  var teacherId = req.user.uid
  var pro = req.user
  var companyId = req.user.companyId
  var subject = req.user.subjects
  var subjectCode = req.user.subjectCode
  var grade = req.user.grade

  
  
  
  Class1.find({companyId:companyId}, function(err,docs){
    Topic.find({subjectCode:subjectCode},function(err,zoc){
  
   var arr2 = zoc
  var arr1 = docs;  
  
  res.render('exam/batchExam',{ arr1:arr1,arr2:arr2, user:user, pro:pro, subject:subject,subjectCode:subjectCode, grade:grade})
  
  })
  })
  
  })




router.post('/batchExam',isLoggedIn,teacher,  function(req,res){
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
var m = moment(date)
var year = m.format('YYYY')
var month = m.format('MMMM')
var numDate = m.valueOf()
var mformat = m.format("L")
var topic = 'null'
var possibleMark = req.body.possibleMark
var icon = req.user.icon

var displayFormat = m.format('MMMM Do YYYY')


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
res.render('exam/batchExam',{errors:req.session.errors, arr1:arr1,pro:pro,subject:subject,subjectCode:subjectCode,grade:grade})
})


}

else{

Test.findOne({'companyId':companyId,'date':date,'class1':class1,'subjectCode':subjectCode,'type':type,'topic':topic })
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
res.render('exam/batchExam', {
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
test.numDate = numDate
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
test.type = 'Final Exam'
test.type2 = 'null'
test.type3 = 'exam'
test.grade = req.body.grade;
test.level = 'highschool';
test.companyId = companyId
test.status = 'null'
test.timeLeft= 'null'
test.examStatus = 'null'
test.examLink = 'null'
test.time = 'null'
test.mformat = mformat
test.teacherId = teacherId
test.teacherName = teacher
test.quizNo = 0
test.quizBatch = 0
test.dateValue = numDate
test.quizId = 'null'
test.duration =0
test.status2 = 'null'
test.dateValue2= 0
test.icon = icon
test.displayFormat = displayFormat
test.question = 'null'


test.save()
.then(tesn =>{



User.findByIdAndUpdate(id,{$set:{testId:tesn._id}}, function(err,trocs){

console.log(trocs)



})

StudentSub.find({companyId:companyId,class1:class1, subjectCode:subjectCode},function(err,zoc){
  for(var i = 0; i<zoc.length;i++){
    var test = new TestX();
test.uid = zoc[i].studentId;
test.fullname = zoc[i].studentName;
test.grade = grade;
test.class1 = class1;
test.date = date
test.teacher = req.user.fullname;
test.teacherId = teacherId;
test.mark = 0;
test.dateValue = numDate
test.dateValueD =0
test.status = 'null'
test.displayFormat = 'null'
test.mformat = mformat
test.mformatD = 0
test.question = 0;
test.assignmentId = 'null'
test.filename = 'null'
test.mformatS = 'null'
test.dateValueS = 0
test.displayFormatS = 'null'
test.submissionStatus = 'null'
test.year = year
test.month = month
test.symbol = 'null';
test.term = term
test.result = "null";
test.subject = subject
test.subjectCode = subjectCode
test.percentage = 0
test.possibleMark = possibleMark;
test.type = 'Final Exam'
test.color = 'null'
test.style = 'null'
test.icon = icon
test.deadline = 'null'
test.size = 0
test.topic = topic
test.quizId = tesn._id
test.companyId = companyId
test.type2 = 'null'
test.type3 = 'exam'
test.status3 = 'null'
test.type = type
test.photo = zoc[i].photo
test.save()
.then(tes =>{

})
  }
})

//notifications






res.redirect('/teacher/classWork')



})


})



}


})


router.post('/grade/update/:id',isLoggedIn,teacher,function(req,res){
  var id = req.params.id
  var pro = req.user
  var companyId = req.user.companyId
  var m = moment()
  var year = m.format('YYYY')
  var month = m.format('MMMM')
  var dateValue = m.valueOf()
  var mformat = m.format("L")
  var date = m.toString()
  var quan = req.body.code
  TestX.findById(id,function(err,doc){
    let possibleMark = doc.possibleMark
  
   // if(doc.stockUpdate == "no"){
  
  
    let reg = /\d+\.*\d*/g;
  
    let result = quan.match(reg)
    let currentMark = Number(result)
    var percentageX = currentMark / possibleMark
    var percentageXX = percentageX * 100
    let percentage = Math.round(percentageXX)
    percentage.toFixed(2)
   
 TestX.findByIdAndUpdate(id,{$set:{mark:currentMark,percentage:percentage}},function(err,doc){

 })     
      
  
  
    Grade.find({companyId:companyId},function(err,qocs){

      for(var i = 0; i<qocs.length; i++){
      let symbol = qocs[i].symbol
      let from = qocs[i].from
      let to = qocs[i].to
      
      if(percentage >= from && percentage <= to ){
      TestX.findByIdAndUpdate(id,{$set:{symbol:symbol,status3:'recorded'}},function(err,mocs){
      
      
      })
      
      }
      }
      
      
      })
      
      if(percentage >= 50){
      
      TestX.findByIdAndUpdate(id,{$set:{result:'pass'}},function(err,mocs){
      
      
      })
      }else
      
      TestX.findByIdAndUpdate(id,{$set:{result:'fail'}},function(err,mocs){
      
      
      })
  
  
  
  
 /* }else{
    console.log('null')
  
    ShopStock.findByIdAndUpdate(id,{$set:{stockUpdate:'yes'}},function(err,loc){
  
    })
  }*/
  res.send(doc)
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
var numDate = m.valueOf()
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
test.numDate = numDate
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
test.status = 'null'
test.timeLeft= 'null'
test.examStatus = 'null'
test.examLink = 'null'
test.time = 'null'
test.teacherId = teacherId
test.teacherName = teacher
test.mformat = mformat
test.quizNo = 0
test.quizBatch = 0
test.quizId = 'null'
test.duration ='null'


test.save()
.then(tesn =>{

StudentSub.find({companyId:companyId,class1:class1, subjectCode:subjectCode},function(err,nocs){

stdNum = nocs.length - 1;

console.log(stdNum)
console.log(nocs.length,'wangu')

User.findByIdAndUpdate(id,{$set:{class1:class1, subjects:subject,examDate:date,term:term, classLength:stdNum,possibleMark:possibleMark,topic:topic, studentNum:0, type:type,subjectCode:subjectCode}}, function(err,trocs){

console.log(trocs)



})

//notifications
User.find({recRole:recRole},function(err,docs){
  
  for(var i = 0; i<docs.length;i++){

    let id = docs[i]._id
    var not = new Note();
    not.role = role
    not.subject = 'Online Quiz';
    not.message = 'Online Quiz on'+" "+date
    not.status = 'not viewed';
    not.status1 = 'new';
    not.user = user;
    not.type = 'null'
    not.status2 = 'new'
    not.status3 = 'new'
    not.status4 = 'null'
    not.date = date
    not.dateViewed = 'null'
    not.recId = docs[i]._id
    not.recRole = recRole
    not.numDate = numDate
   


    
    
 

    
     

     

    not.save()
      .then(user =>{
        
  })
}
})




})
res.redirect('/teacher/gradeX9')



})


})



}


})





//autocomplete teacherName & uid

router.get('/autocomplete/',isLoggedIn,teacher, function(req, res, next) {
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
router.post('/auto',isLoggedIn,teacher,function(req,res){
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














router.get('/gradeX9',isLoggedIn,teacher,function(req,res){
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
test.quizId = 'null'
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



/*
router.get('/profile',isLoggedIn,teacher,  function(req,res){
  var pro = req.user
res.render('teachers/overview',{pro:pro})
})


router.post('/profile',isLoggedIn,teacher,upload.single('file'),function(req,res){

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
*/




router.get('/subjectsProfile/:id',isLoggedIn,teacher,function(req,res){
  var id = req.params.id
  console.log(id,'idd')
  var pro = req.user
  User.findById(id,function(err,doc){
    let uid = doc.uid

    TeacherSub.find({teacherId:uid},function(err,locs){
      res.render('users/subjects6',{listX:locs,pro:pro,doc:doc,id:id})
    })
  })
 
})


router.get('/profile/',isLoggedIn,teacher,function(req,res){
  var id = req.user.id
  User.findById(id,function(err,doc){
    pro = req.user
 
  //var pro = req.user
  res.render('teachers/overview2',{pro:pro,id:id,doc:doc})
  
})
  })


router.get('/tests',isLoggedIn,teacher, (req, res) => {
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
router.get('/results',isLoggedIn,teacher, (req, res) => {
  var pro = req.user
var uid= req.user._id
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
router.get('/examResults',isLoggedIn,teacher, (req, res) => {
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





router.get('/termInfo',isLoggedIn,teacher, function(req,res){
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

  
  
  

//Create Exam
router.get('/quizBatch',isLoggedIn,teacher,  function(req,res){
  var user = req.user.term
  var teacherId = req.user.uid
  var pro = req.user
  var companyId = req.user.companyId
  
  
  
  Class1.find({companyId:companyId}, function(err,docs){
  var arr1 = docs;  
  
  res.render('onlineQuiz/batchX',{ arr1:arr1, user:user, pro:pro})
    
  })
  

  
  })

router.post('/quizBatch',isLoggedIn,teacher,  function(req,res){
var icon = req.body.icon
var class1 = req.body.class1;
var subject = req.body.subject;
var subjectCode = req.body.subjectCode;
var date = req.body.date;
var id = req.user._id;
var duration = req.body.duration
var time = req.body.start
var type = req.body.type
var grade = req.body.grade
var quizBatch = req.body.number
var stdNum
var teacherName = req.user.fullname
var teacherId = req.user._id
var n= moment()
var user = req.user.fullname
var numDate = n.valueOf()
var m2 = moment(date+" "+time)
var m = moment(date+" "+time)
console.log(m,'m')
var displayFormat = m.format('MMMM Do YYYY')
var year = m.format('YYYY')
var month = m.format('MMMM')
var topic = req.body.topic
var dateValue = m.valueOf()
var companyId = req.user.companyId
var photo = req.user.photo
let newTime = m.add(duration,'minutes')
var dateValue2 = moment(newTime).valueOf()//end time
var mformat = m.format("L")





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


req.session.errors = errors;
req.session.success = false
res.render('onlineQuiz/batchX',{errors:req.session.errors})



}

else{

Test.findOne({'date':date,'class1':class1,'subjectCode':subjectCode,'type':type })
.then(tes =>{
if(tes){ 


req.session.message = {
type:'errors',
message:'Test Exists'
}     
 res.render('onlineQuiz/batchX', {
    message:req.session.message})
 
 


}else


var test = Test();
test.date = m2;
test.subject = subject;
test.subjectCode = subjectCode;
test.class1 = class1;
test.year = year;
test.name = date +" "+class1;
test.month  = month;
test.numDate = numDate
test.dateValue = dateValue
test.dateValue2 = dateValue2
test.teacherName = teacherName;
test.teacherId = teacherId
test.numberOfStudents = 0;
test.passRate = 0;
test.term = 1;
test.displayFormat = displayFormat
test.question = 'null';
test.possibleMark = quizBatch
test.status = 'unactivated'
test.status2 = 'active'
test.icon = icon
test.topic = topic;
test.highScore = 0
test.lowestScore=0;
test.numPasses=0
test.avgMark=0
test.mformat = mformat
test.type = type
test.type2 = 'online quiz'
test.type3 = 'class'
test.grade = grade;
test.quizBatch=quizBatch
test.quizNo = 0
test.examLink = 'null'
test.examStatus = 'pending'
test.quizId = 'null'
test.duration = duration
test.time = time
test.timeLeft = "null"
test.companyId = companyId




test.save()
.then(tesn =>{
User.find({role:'student'},function(err,pocs){
  let num = pocs.length
  let nquizBatch = num * quizBatch


User.findByIdAndUpdate(id,{$set:{quizId:tesn._id,quizBatch:quizBatch,quizNo:0, quizDuration:duration }}, function(err,trocs){

console.log(trocs)


let examLink ='http://' + req.headers.host+'/student/quiz/'+tesn._id;

Test.findByIdAndUpdate(tesn._id,{$set:{quizId:tesn._id,examLink:examLink}},function(err,kocs){

})



User.find({role:"student",class1:class1},function(err,docs){
  
  for(var i = 0; i<docs.length;i++){

    let id = docs[i]._id
    var not = new Note();
    not.role = 'teacher'
    not.subject = 'Online Quiz'+" "+subject;
    not.message = "Online Quiz on"+" "+date
    not.examLink = examLink
    not.status = 'not viewed';
    not.status1 = 'new';
    not.user = user;
    not.quizId = tesn._id
    not.type = 'exam'
    not.status2 = 'new'
    not.status3 = 'new'
    not.status4 = 'null'
    not.date = n
    not.dateViewed = 'null'
    not.recId = docs[i]._id
    not.recRole = 'student'
    not.senderPhoto = photo
    not.numDate = numDate
   


    
    
 

    
     

     

    not.save()
      .then(user =>{
        
  })
}
})





})

})
res.redirect('/teacher/setX9')



})


})



}


})



router.get('/setX9',isLoggedIn,function(req,res){
  res.redirect('/teacher/set')
})


//enter exam qustions



router.get('/set',isLoggedIn,teacher, function(req,res){
  var id = req.user._id;
  var batchNo = req.user.quizBatch
  
  

  x =req.user.quizNo
  if(x == batchNo){
  res.redirect('/teacher/quizBatch')
  }else
  
  x++
  res.render('onlineQuiz/batch',{x:x})
  
  })



  
router.post('/set',isLoggedIn,teacher, function(req,res){
  var batchNo = req.user.quizBatch
  var x =req.user.quizNo
var question = req.body.question;
var subject = req.body.subject;
var choice1 = req.body.choice1;
var choice2 = req.body.choice2;
var choice3 = req.body.choice3;
var choice4 = req.body.choice4
var answer = req.body.answer;
var duration = req.user.quizDuration
var year = 2023
var quizId = req.user.quizId
var id = req.user._id
var pro = req.user
console.log(duration, quizId, 'quizId')

/*
Class1.find({class1:classX},function(err,docs){
//grade = docs[0].grade
console.log(docs,'horror')

})
*/

req.check('question','Enter Question').notEmpty();
req.check('subject','Enter Subject').notEmpty();

req.check('choice1','Enter Choice1').notEmpty();


var errors = req.validationErrors();

if (errors) {


req.session.errors = errors;
req.session.success = false
res.render('onlineQuiz/batch',{errors:req.session.errors,pro:pro})


}

User.find({role:'student'},function(err,docs){

for(var i = 0;i<docs.length;i++){




  var test = Question();
  test.question = question;
  test.subject = subject;
  test.choice1 = choice1;
  test.choice2 = choice2;
  test.year = year;
  test.finalAns = 'null';
  test.stdAns = -1;
  test.activeNum = 0
  test.choice3  = choice3;
  test.choice4 = choice4;
  test.answer = answer;
  test.status = 'valid'
  test.status2 = 'null'
  test.studentId = docs[i]._id
  test.quizId= quizId
 test.quizDuration = duration
  
  test.save()
  .then(tes =>{



  })

}


if(batchNo == x){
  
  User.findByIdAndUpdate(id,{$set:{quizNo:0,quizBatch:0, quizId:"null"}}, function(err,docs){
  
  
  })
  
  res.redirect('/teacher/quizBatch')
  
  
  }else
  
  x++
  console.log('x',x)
  User.findByIdAndUpdate(id,{$set:{quizNo:x}}, function(err,docs){
  
  
  })
})


res.redirect('/teacher/set')
})






//notifications

router.get('/notify',isLoggedIn,teacher, function(req,res){
 var pro = req.user
  res.render('messagesTeachers/notifs',{pro:pro})
  })
  
  router.post('/notify',isLoggedIn,teacher, function(req,res){
              var m = moment()
              var year = m.format('YYYY')
              var numDate = m.valueOf()
              var date = m.toString()
              var subject = req.body.subject
              var message = req.body.message
              var role = req.user.role
              var recRole = 'student'
              var user = req.user.fullname
         
              console.log(role,'role')
              req.check('subject','Enter Subject').notEmpty();
              req.check('message','Enter Message').notEmpty();
            
             
                  
              
                    
                 
              var errors = req.validationErrors();
                  if (errors) {
              
                  
                    req.session.errors = errors;
                    req.session.success = false;
                    res.render('notifs',{ errors:req.session.errors,})
                    
                  
                }
                else{
  
            User.find({recRole:recRole},function(err,docs){
  
              for(var i = 0; i<docs.length;i++){
  
                let id = docs[i]._id
                var not = new Note();
                not.role = role
                not.subject = subject;
                not.message = message
                not.status = 'not viewed';
                not.status1 = 'new';
                not.user = user;
                not.type = 'null'
                not.status2 = 'new'
                not.status3 = 'new'
                not.status4 = 'null'
                not.date = date
                not.dateViewed = 'null'
                not.recId = docs[i]._id
                not.recRole = recRole
                not.numDate = numDate
               
  
        
                
                
             
  
                
                 
            
                 
        
                not.save()
                  .then(user =>{
                    
              })
  
  
              }
            })
            
               res.redirect('/notify')
  
            }
                            
  
                
  })
  











  router.post('/not/:id',isLoggedIn,teacher,function(req,res){
    var m = moment()
    var date = m.toString()
  
  var id = req.params.id
    Note.find({recId:id},function(err,docs){
      for(var i = 0; i<docs.length; i++){
        let nId = docs[i]._id
  
        Note.findByIdAndUpdate(nId,{$set:{status:'viewed',dateViewed:date}},function(err,locs){
  
        })
      }
  
      res.send('success')
    })
  })
  
  
  
  
  router.get('/update',isLoggedIn,function(req,res){
  var m = moment()
  let n = m.valueOf()
  var id = req.user._id
  
  Note.find({recId:id},function(err,docs){
  
  for(var i = 0; i<docs.length;i++){
  let value = docs[i].numDate
  let num = n - value
  let nId = docs[i]._id
  
  if(num >= 86000000){
    Note.findByIdAndUpdate(nId,{$set:{status1:'old'}},function(err,nocs){
  
  
    })
  }
  
  }
  
  
  })
  
  
  
  })
  
  router.get('/nots',isLoggedIn,teacher, function(req,res){
    var m = moment();
  var id = req.user._id
    Note.find({recId:id,status:'viewed'},function(err,docs){
      for(var i = 0;i<docs.length;i++){
        let duration =moment(docs[i].dateViewed)
        let days=m.diff(duration,"days");
        let nId = docs[i]._id
  console.log(days,'days')
       if(days > 0){
  Note.findByIdAndUpdate(nId,{$set:{status2:'expired',status1:'old'}},function(err,nocs){
  
  })
       }
      }
    })
  
  
  })
  


  router.get('/nList',isLoggedIn,teacher,function(req,res){
    var id = req.user._id
    var m = moment()
    var pro = req.user
    console.log(m.valueOf(),'crap')
    Note.find({recId:id},function(err,docs){
      if(!err){
  
     
      res.render('/teacher/notList',{list:docs,pro:pro})
  
      }
    })
  })
  
  router.get('/notify/:id', isLoggedIn,teacher, function(req,res){
    var id = req.params.id
    var uid = req.user._id
    console.log(id,'id')
    var arr = []
    var pro = req.user
    Note.find({recId:uid,_id:id},function(err,tocs){
  
  let subject = tocs[0].subject
  let message = tocs[0].message
  
  
  
      
      res.render('/teacher/notView',{message:message,pro:pro, subject:subject})
    })
  
  })
  
//topic

router.get('/topics',isLoggedIn,teacher, function(req,res){
  var companyId = req.user.companyId
  var pro = req.user
  Class1.find({companyId:companyId},function(err,loc){
    res.render('teachers/gradeX',{arr:loc,pro:pro})
  })

  })
  
  router.post('/topics',isLoggedIn,teacher, function(req,res){
              var m = moment()
              var pro = req.user
              var year = m.format('YYYY')
         
              var subject = req.body.subject
              var subjectCode = req.body.subjectCode
              var grade = req.body.grade
              var class1 = req.body.class1
              var topic = req.body.name
              var companyId = req.user.companyId
         
            
              req.check('subject','Enter Subject').notEmpty();
              req.check('name','Enter Topic').notEmpty();
            
             
                  
              
                    
                 
              var errors = req.validationErrors();
                  if (errors) {
              
                    Class1.find({companyId:companyId},function(err,loc){ 
                    req.session.errors = errors;
                    req.session.success = false;
                    res.render('teachers/gradeX',{ errors:req.session.errors,arr:loc,pro:pro})
                    
                    })
                }
                else{
  
         
  
                var not = new Topic();
                not.name = topic
                not.subjectName = subject;
                not.subjectCode = subjectCode
                not.grade = grade;
                not.class1 = class1;
                not.year = year
                not.companyId = companyId;
               
               
  
        
                
                
             
  
                
                 
            
                 
        
                not.save()
                  .then(user =>{
                    
              })
  
  
            
            
               res.redirect('/teacher/topics')
  
            }
                            
  
                
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
    res.redirect('/')
    }  










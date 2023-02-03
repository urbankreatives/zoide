require('dotenv').config();

var express = require('express');
var router = express.Router();
const User =require('../models/user')
const Class1 =require('../models/class');
const Subject =require('../models/subject');
const Fees =require('../models/fees');
const Grade =require('../models/grade');
const Test =require('../models/classTest');
const Lesson =require('../models/lesson');
const Poll = require('../models/poll');
const { Paynow } = require("paynow");
const Exam =require('../models/exam');
const TestX =require('../models/classTestX');
const StudentExamRate =require('../models/stdPassRate');
const StudentClassRate =require('../models/stdPassRateX');
const Expenses = require('../models/expenses')
const FeesUpdate =require('../models/feesUpdate');
const StudentSub =require('../models/studentSubject');
//const stripe = require('stripe')('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');
const stripe = require('stripe')(' sk_test_IbxDt5lsOreFtqzmDUFocXIp0051Hd5Jol');
const keys = require('../config1/keys')
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

//student Dashboard



// change password
router.get('/pass',isLoggedIn, (req, res) => {
  var pro = req.user
    User.findById(req.user._id, (err, doc) => {
        if (!err) {
            res.render("students/change", {
               
                user: doc, pro:pro
              
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
      res.render('students/change',{ title: 'User Update', user:req.body, errors:req.session.errors, pro:pro
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
        res.render('students/change',{message:req.session.message, user:req.user, pro:pro
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
  var companyId = req.user.companyId
  var studentId = req.user.uid
  var clas6 = req.user.class1
   var m = moment()
   var year = m.format('YYYY')
   var marks, marks2
   var arr1=[]
   var number1
console.log(studentId, 'studentId')
    
   StudentExamRate.find({companyId:companyId,year:year,term:term, studentId:studentId, class1:clas6},function(err,docs){
 
     if(docs.length == 0){
 
       TestX.find({companyId:companyId,term:term,year:year,uid:studentId, type:'Final Exam' },function(err,hods){
 
         TestX.find({companyId:companyId,term:term,year:year,uid:studentId, result:'pass', type:'Final Exam'},function(err,lods){
       /*  if(hods.length >=1){*/
 
 
          totalexams = hods.length;
          examsPassed = lods.length
          passRate = examsPassed / totalexams * 100
          numberOfMarks = hods.length;
          console.log('numberOfMarks',numberOfMarks)

          for(var q = 0;q<hods.length; q++){
  
            arr1.push(hods[q].mark)
              }
              //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
               totalMarks=0;
              for(var z in arr1) { totalMarks += arr1[z]; }
 
              avgMark = totalMarks / numberOfMarks
             
             var pass =StudentExamRate();
             pass.firstTerm = 0;
             pass.firstAvgMark = 0
             pass.secondTerm= 0;
             pass.secondAvgMark = 0
             pass.thirdTerm = 0
             pass.thirdAvgMark=0;
             pass.studentId = studentId;
             pass.class1 = clas6
             pass.term = term
             pass.type = 'Final Exam';
             pass.year = year
             pass.companyId = companyId
 
             pass.save()
     .then(pas =>{
       id3 = pas._id;
 
       if(term == 1){
 
   
         StudentExamRate.findByIdAndUpdate(id3,{$set:{firstTerm:passRate, firstAvgMark:avgMark}},function(err,kocs){
      
         
         })
       }else if(term == 2){
       
         StudentExamRate.findByIdAndUpdate(id3,{$set:{secondTerm:passRate,secondAvgMark:avgMark}},function(err,kocs){
       
             
             })
           }else{
             StudentExamRate.findByIdAndUpdate(id3,{$set:{thirdTerm:passRate,thirdAvgMark}},function(err,kocs){
             
                 
                 })
              }
 
               })
              /* }*/
               
               })
               
             })
           }
           else
 
         var  idX  = docs[0]._id
 
         TestX.find({companyId:companyId,term:term,year:year,uid:studentId, type:"Final Exam",class1:clas6},function(err,shods){
 
          TestX.find({companyId:companyId,term:term,year:year, result:'pass',uid:studentId,type:"Final Exam",class1:clas6},function(err,slods){
        /*  if(shods.length >=1){*/
console.log(shods)
console.log(slods)
  
           totalexams = shods.length;
           examsPassed = slods.length
           passRate = examsPassed / totalexams * 100
           numberOfMarks = shods.length;
 
           for(var q = 0;q<shods.length; q++){
   
             arr1.push(shods[q].mark)
               }
               //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
                totalMarks=0;
               for(var z in arr1) { totalMarks += arr1[z]; }
  
               avgMark = totalMarks / numberOfMarks
 console.log(totalMarks, numberOfMarks, examsPassed, passRate, avgMark, idX)
              if(term == 1){
 
   
               StudentExamRate.findByIdAndUpdate(idX,{$set:{firstTerm:passRate,firstAvgMark:avgMark}},function(err,kocs){
            
               
               })
             }else if(term == 2){
             
               StudentExamRate.findByIdAndUpdate(idX,{$set:{secondTerm:passRate, secondAvgMark:avgMark}},function(err,kocs){
             
                   
                   })
                 }else{
                   StudentExamRate.findByIdAndUpdate(idX,{$set:{thirdTerm:passRate, thirdAvgMark:avgMark}},function(err,kocs){
                   
                       
                       })
                     }
   
            /* }*/
     
    
           })
           
        
         })    
         res.redirect('/student/passRateX')
       
 
         })
   
    
        
        
      
  
         
         
 
   })

  

   
router.get('/passRateX',isLoggedIn,function(req,res){
  let totalexams, examsPassed, passRate;
  let numberOfMarks, totalMarks, avgMark;
  var m = moment()
  var year = m.format('YYYY')
  var term = req.user.term
  var uid = req.user.uid
  var fullname = req.user.fullname;
  var studentId = req.user.uid
  var clas6 = req.user.class1
  console.log(clas6,"class++")
 
   var marks, marks2
   var arr1=[]
   var number1
   var companyId = req.user.companyId





    
   StudentClassRate.find({companyId:companyId,year:year,term:term, studentId:studentId, class1:clas6, type:"Class Test"},function(err,docs){
 console.log(docs,'buda')
     if(docs.length == 0){
  
 
       TestX.find({companyId:companyId,term:term,year:year,uid:studentId, type:'Class Test', class1:clas6},function(err,hods){
 
         TestX.find({companyId:companyId,term:term,year:year,uid:studentId, result:'pass', type:'Class Test'},function(err,lods){
       /*  if(hods.length >=1){*/
 
 
          totalexams = hods.length;
          examsPassed = lods.length
          passRate = examsPassed / totalexams * 100
          numberOfMarks = hods.length;
          console.log('numberOfMarks',numberOfMarks)

          for(var q = 0;q<hods.length; q++){
  
            arr1.push(hods[q].mark)
              }
              
               totalMarks=0;
              for(var z in arr1) { totalMarks += arr1[z]; }
 
              avgMark = totalMarks / numberOfMarks
             
             var pass =StudentClassRate();
             pass.firstTerm = 0;
             pass.firstAvgMark = 0
             pass.secondTerm= 0;
             pass.secondAvgMark = 0
             pass.thirdTerm = 0
             pass.thirdAvgMark=0;
             pass.studentId = studentId;
             pass.class1 = clas6
             pass.term = term
             pass.type = 'Class Test';
             pass.year = year
             pass.companyId = companyId
 
             pass.save()
     .then(pas =>{
       id3 = pas._id;
 
       if(term == 1){
 
   
        StudentClassRate.findByIdAndUpdate(id3,{$set:{firstTerm:passRate, firstAvgMark:avgMark}},function(err,kocs){
      
         
         })
       }else if(term == 2){
       
        StudentClassRate.findByIdAndUpdate(id3,{$set:{secondTerm:passRate,secondAvgMark:avgMark}},function(err,kocs){
       
             
             })
           }else{
            StudentClassRate.findByIdAndUpdate(id3,{$set:{thirdTerm:passRate,thirdAvgMark}},function(err,kocs){
             
                 
                 })
               }
 
               })
              /* }*/
               
               })
               
             })
           }
           else
 
         var  idX  = docs[0]._id
 
         TestX.find({companyId:companyId,term:term,year:year,uid:studentId, type:"Class Test",class1:clas6, },function(err,hods){
 
          TestX.find({companyId:companyId,term:term,year:year, result:'pass',uid:studentId, type:"Class Test",class1:clas6},function(err,lods){
         /* if(hods.length >=1){*/
  
  
           totalexams = hods.length;
           examsPassed = lods.length
           passRate = examsPassed / totalexams * 100
           numberOfMarks = hods.length;
 
           for(var q = 0;q<hods.length; q++){
   
             arr1.push(hods[q].mark)
               }
               //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
                totalMarks=0;
               for(var z in arr1) { totalMarks += arr1[z]; }
  
               avgMark = totalMarks / numberOfMarks
 
              if(term == 1){
 
   
                StudentClassRate.findByIdAndUpdate(idX,{$set:{firstTerm:passRate,firstAvgMark:avgMark}},function(err,kocs){
            
               
               })
             }else if(term == 2){
             
              StudentClassRate.findByIdAndUpdate(idX,{$set:{secondTerm:passRate, secondAvgMark:avgMark}},function(err,kocs){
             
                   
                   })
                 }else{
                   StudentClassRate.findByIdAndUpdate(idX,{$set:{thirdTerm:passRate, thirdAvgMark:avgMark}},function(err,kocs){
                   
                       
                       })
                     }
   
         /*    }*/
     
    
           })
           
        
         })    
       
         res.redirect('/student/passRateY')
 
         })
   
    
        
        
     
  
         
         
 
   })

  



   router.get('/passRateY',isLoggedIn,function(req,res){
    let totalexams, examsPassed, passRate;
    let numberOfMarks, totalMarks, avgMark;
    var m = moment()
    var year = m.format('YYYY')
    var term = req.user.term
    var uid = req.user.uid
    var fullname = req.user.fullname;
    var studentId = req.user.uid
    var clas6 = req.user.class1
     var m = moment()
     var year = m.format('YYYY')
     var marks, marks2
     var arr1=[]
     var number1
     var companyId = req.user.companyId
  console.log(studentId, 'studentId')
      
     StudentExamRate.find({companyId:companyId,year:year, studentId:studentId, class1:clas6},function(err,docs){
   
       if(docs.length == 0){
   
         TestX.find({companyId:companyId,term:term,year:year,uid:studentId, type:'Final Exam' },function(err,hods){
   
           TestX.find({companyId:companyId,term:term,year:year,uid:studentId, result:'pass', type:'Final Exam'},function(err,lods){
         /*  if(hods.length >=1){*/
   
   
            totalexams = hods.length;
            examsPassed = lods.length
            passRate = examsPassed / totalexams * 100
            numberOfMarks = hods.length;
            console.log('numberOfMarks',numberOfMarks)
  
            for(var q = 0;q<hods.length; q++){
    
              arr1.push(hods[q].mark)
                }
                //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
                 totalMarks=0;
                for(var z in arr1) { totalMarks += arr1[z]; }
   
                avgMark = totalMarks / numberOfMarks
               
               var pass =StudentExamRate();
               pass.firstTerm = 0;
               pass.firstAvgMark = 0
               pass.secondTerm= 0;
               pass.secondAvgMark = 0
               pass.thirdTerm = 0
               pass.thirdAvgMark=0;
               pass.studentId = studentId;
               pass.class1 = clas6
               pass.term = term
               pass.type = 'Final Exam';
               pass.year = year
               pass.companyId = companyId
   
               pass.save()
       .then(pas =>{
         id3 = pas._id;
   
         if(term == 1){
   
     
           StudentExamRate.findByIdAndUpdate(id3,{$set:{firstTerm:passRate, firstAvgMark:avgMark}},function(err,kocs){
        
           
           })
         }else if(term == 2){
         
           StudentExamRate.findByIdAndUpdate(id3,{$set:{secondTerm:passRate,secondAvgMark:avgMark}},function(err,kocs){
         
               
               })
             }else{
               StudentExamRate.findByIdAndUpdate(id3,{$set:{thirdTerm:passRate,thirdAvgMark}},function(err,kocs){
               
                   
                   })
                }
   
                 })
                /* }*/
                 
                 })
                 
               })
             }
             else
   
           var  idX  = docs[0]._id
   
           TestX.find({companyId:companyId,term:term,year:year,uid:studentId, type:"Final Exam",class1:clas6},function(err,shods){
   
            TestX.find({companyId:companyId,term:term,year:year, result:'pass',uid:studentId,type:"Final Exam",class1:clas6},function(err,slods){
          /*  if(shods.length >=1){*/
  console.log(shods)
  console.log(slods)
    
             totalexams = shods.length;
             examsPassed = slods.length
             passRate = examsPassed / totalexams * 100
             numberOfMarks = shods.length;
   
             for(var q = 0;q<shods.length; q++){
     
               arr1.push(shods[q].mark)
                 }
                 //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
                  totalMarks=0;
                 for(var z in arr1) { totalMarks += arr1[z]; }
    
                 avgMark = totalMarks / numberOfMarks
   console.log(totalMarks, numberOfMarks, examsPassed, passRate, avgMark, idX)
                if(term == 1){
   
     
                 StudentExamRate.findByIdAndUpdate(idX,{$set:{firstTerm:passRate,firstAvgMark:avgMark}},function(err,kocs){
              
                 
                 })
               }else if(term == 2){
               
                 StudentExamRate.findByIdAndUpdate(idX,{$set:{secondTerm:passRate, secondAvgMark:avgMark}},function(err,kocs){
               
                     
                     })
                   }else{
                     StudentExamRate.findByIdAndUpdate(idX,{$set:{thirdTerm:passRate, thirdAvgMark:avgMark}},function(err,kocs){
                     
                         
                         })
                       }
     
              /* }*/
       
      
             })
             
          
           })    
           res.redirect('/student/passRateYY')
         
   
           })
     
      
          
          
        
    
           
           
   
     })
  
    
  
     
  router.get('/passRateYY',isLoggedIn,function(req,res){
    let totalexams, examsPassed, passRate;
    let numberOfMarks, totalMarks, avgMark;
    var m = moment()
    var year = m.format('YYYY')
    var term = req.user.term
    var uid = req.user.uid
    var fullname = req.user.fullname;
    var studentId = req.user.uid
    var clas6 = req.user.class1
     var m = moment()
     var year = m.format('YYYY')
     var marks, marks2
     var arr1=[]
     var number1
     var companyId = req.user.companyId
  
  
  
  
  
      
     StudentClassRate.find({companyId:companyId,year:year, studentId:studentId, class1:clas6},function(err,docs){
   
       if(docs.length == 0){
   
         TestX.find({companyId:companyId,term:term,year:year,uid:studentId, type:'Class Test', class1:clas6},function(err,hods){
   
           TestX.find({companyId:companyId,term:term,year:year,uid:studentId, result:'pass', type:'Class Test'},function(err,lods){
         /*  if(hods.length >=1){*/
   
   
            totalexams = hods.length;
            examsPassed = lods.length
            passRate = examsPassed / totalexams * 100
            numberOfMarks = hods.length;
            console.log('numberOfMarks',numberOfMarks)
  
            for(var q = 0;q<hods.length; q++){
    
              arr1.push(hods[q].mark)
                }
                //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
                 totalMarks=0;
                for(var z in arr1) { totalMarks += arr1[z]; }
   
                avgMark = totalMarks / numberOfMarks
               
               var pass =StudentClassRate();
               pass.firstTerm = 0;
               pass.firstAvgMark = 0
               pass.secondTerm= 0;
               pass.secondAvgMark = 0
               pass.thirdTerm = 0
               pass.thirdAvgMark=0;
               pass.studentId = studentId;
               pass.class1 = clas6
               pass.term = term
               pass.type = 'Class Test';
               pass.year = year
               pass.companyId = companyId
   
               pass.save()
       .then(pas =>{
         id3 = pas._id;
   
         if(term == 1){
   
     
          StudentClassRate.findByIdAndUpdate(id3,{$set:{firstTerm:passRate, firstAvgMark:avgMark}},function(err,kocs){
        
           
           })
         }else if(term == 2){
         
          StudentClassRate.findByIdAndUpdate(id3,{$set:{secondTerm:passRate,secondAvgMark:avgMark}},function(err,kocs){
         
               
               })
             }else{
              StudentClassRate.findByIdAndUpdate(id3,{$set:{thirdTerm:passRate,thirdAvgMark}},function(err,kocs){
               
                   
                   })
                 }
   
                 })
                /* }*/
                 
                 })
                 
               })
             }
             else
   
           var  idX  = docs[0]._id
   
           TestX.find({companyId:companyId,term:term,year:year,uid:studentId, type:"Class Test",class1:clas6, },function(err,hods){
   
            TestX.find({companyId:companyId,term:term,year:year, result:'pass',uid:studentId, type:"Class Test",class1:clas6},function(err,lods){
           /* if(hods.length >=1){*/
    
    
             totalexams = hods.length;
             examsPassed = lods.length
             passRate = examsPassed / totalexams * 100
             numberOfMarks = hods.length;
   
             for(var q = 0;q<hods.length; q++){
     
               arr1.push(hods[q].mark)
                 }
                 //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
                  totalMarks=0;
                 for(var z in arr1) { totalMarks += arr1[z]; }
    
                 avgMark = totalMarks / numberOfMarks
   
                if(term == 1){
   
     
                  StudentClassRate.findByIdAndUpdate(idX,{$set:{firstTerm:passRate,firstAvgMark:avgMark}},function(err,kocs){
              
                 
                 })
               }else if(term == 2){
               
                StudentClassRate.findByIdAndUpdate(idX,{$set:{secondTerm:passRate, secondAvgMark:avgMark}},function(err,kocs){
               
                     
                     })
                   }else{
                     StudentClassRate.findByIdAndUpdate(idX,{$set:{thirdTerm:passRate, thirdAvgMark:avgMark}},function(err,kocs){
                     
                         
                         })
                       }
     
           /*    }*/
       
      
             })
             
          
           })    
         
           res.redirect('/student/feesCheck')
   
           })
     
           
   
     })
  



   /*  router.get('/feesCheck',isLoggedIn,function(req,res){
      
      if(req.user.pollUrl === "null"){
        res.redirect('/student/dash')


      }else{

      var pollUrl = req.user.pollUrl;
    
       // Create instance of Paynow class
       let paynow = new Paynow("14628", "0b05a9bd-6779-4a6f-9da7-48e03cb96a67");
      
        paynow.pollTransaction(pollUrl).then(transaction => {
          if(transaction.status === 'paid') {
            // User showed us the doe
            var amount = transaction.amount;
            User.find({uid:uid},function(err,docs){
       
              balance = docs[0].balance;
              newBalance = balance + amount;
    
              if(balance >= 0){
      
                User.findByIdAndUpdate(docs[0]._id,{$set:{balance:newBalance, status:"paid", term:term, year:year,balanceCarriedOver:balance,paymentId:paymentId,pollUrl:"null"}},function(err,docs){
              
              
                
              
                })
            
              }else
              
              User.findByIdAndUpdate(docs[0]._id,{$set:{balance:newBalance, status:"owing", term:term, year:year,balanceCarriedOver:balance,paymentId:paymentId}},function(err,docs){
              
              
                
              
              })
              res.redirect('/student/dash')
            })
          }
      
          })
        }
       
    })*/




    router.get('/feesCheck',isLoggedIn,function(req,res){
      var uid = req.user.uid
      var fullname = req.user.fullname
      var class1 = req.user.class1
      var term = req.user.term
      var companyId = req.user.companyId
      var method = 'paynow'
      var paymentId = req.user.pollUrl
      var xId = req.user._id
      var m = moment()
      var date = moment().toString()
      var year = m.format('YYYY')
      var month = m.format('MMMM')
      if(req.user.pollUrl === "null"){
        res.redirect('/student/dash')


      }else{
        var pollUrl = req.user.pollUrl;
         var amount = req.user.paynow  
     
    
       // Create instance of Paynow class
       let paynow = new Paynow(14808, "e351cf17-54bc-4549-81f2-b66feed63768");
      
        paynow.pollTransaction(pollUrl).then(transaction => {
          if(transaction.status === 'paid') {
            // User showed us the doe
           
           
            var fees = new Fees();
      
            fees.date = date;
            fees.uid = uid;
            fees.class1 = class1;
            fees.fullname = fullname;
            fees.amount= amount;
            fees.term = term;
            fees.year = year;
            fees.month = month;
            fees.method = method;
            fees.paymentId = paymentId
            fees.receiptNumber = 'paynow';
            fees.companyId = companyId
          
          
          
            fees.save()
              .then(fee =>{
               
      
                 User.findByIdAndUpdate(xId,{$set:{studentId:uid,amount:amount,receiptNumber:'paynow'}},function(err,gocs){
      
      
      
      
                  balance = req.user.balance;
                  newBalance = balance + fee.amount;
                  console.log('new',newBalance)
      
                  if(newBalance >= 0){
          
                    User.findByIdAndUpdate(xId,{$set:{balance:newBalance, status:"paid", term:term, year:year,balanceCarriedOver:balance,paynow:0,pollUrl:'null'}},function(err,docs){
                  
              
                    
                  
                    })
                
                  }else
                  
                  User.findByIdAndUpdate(xId,{$set:{balance:newBalance, status:"owing", term:term, year:year,balanceCarriedOver:balance,paynow:0,pollUrl:'null'}},function(err,docs){
                  
                  
                    
                  

                  })
                  })
                  
                })
      
                
      
                 }
             
      res.redirect('/student/dash')
                })
      
        }
       
    })












     router.get('/dash',isLoggedIn, function(req,res){
      var pro = req.user
      var uid = req.user.uid
      StudentSub.find({studentId:uid},(err, docs) => {
        res.render('dashboard/student',{pro:pro})
     
      })
    })
    
  

//Final Exam

     router.post('/studentPassChart',function(req,res){
      var m = moment()
      var year = m.format('YYYY')
      var uid = req.user.uid
      var term = req.user.term
      var companyId = req.user.companyId
            StudentExamRate.find({companyId:companyId,year:year, term:term, studentId:uid},function(err,docs){
              if(docs == undefined){
                res.redirect('/student/dash')
              }else
          
                 res.send(docs)
             
              
               })
          
          })


  //Class Test
          router.post('/studentPassChart2',isLoggedIn,function(req,res){
            var m = moment()
            var year = m.format('YYYY')
            var uid = req.user.uid
            var term = req.user.term
            var companyId = req.user.companyId
                  StudentClassRate.find({companyId:companyId,year:year, term:term,studentId:uid},function(err,docs){
                    if(docs == undefined){
                      res.redirect('/student/dash')
                    }else
                
                       res.send(docs)
                   
                    
                     })
                
                })
      




//role student

router.get('/profile',isLoggedIn,student, function(req,res){
   
  var pro = req.user
      res.render('students/overview2',{pro:pro})
    
      
  })


  router.post('/profile',isLoggedIn,upload.single('file'),function(req,res){
 
    var pro = req.user
  
    if(!req.file){
     req.session.message = {
       type:'errors',
       message:'Select Picture'
     }     
       res.render('student/overview', {
            user:req.body, message:req.session.message,pic:req.user.photo,user:req.user, pro:pro 
        }) 
     
    } else
    var imageFile = req.file.filename;
    var id  = req.user._id;
   console.log(imageFile)
   console.log(id)
    User.findByIdAndUpdate(id,{$set:{photo:imageFile}},function(err,data){ 
    
    
      
    
    
    })
   
    res.redirect('/student/profile')
  
       //res.render('uploads/index',{title:'Upload File',records:data, success:success})
  
  
     
  
    
   
  })
  
  
//student registered subjects
  router.get('/subjects',isLoggedIn,student, function(req,res){
    var pro = req.user
    var uid = req.user.uid
    var companyId = req.user.companyId
    StudentSub.find({companyId:companyId,studentId:uid},(err, docs) => {
      if (!err) {
          res.render('students/subjects', {
             list:docs, pro:pro
            
          });
      }
  });


    
  })

  


  //student lesson timetable
router.get('/timetable',isLoggedIn,student, (req, res) => {
  var pro = req.user
    var term = req.user.term
    var class1 = req.user.class1
    var uid = req.user.uid
    var year = req.user.year
    var companyId = req.user.companyId
    Lesson.find({companyId:companyId,term:term, class1:class1,  year:year},(err, docs) => {
        if (!err) {
            res.render("lesson/timetable", {
               list:docs,pro:pro
              
            });
        }
    });
  });


//exam timetable student
router.get('/examList',isLoggedIn,(req, res) => {
  var pro = req.user
 var grade = req.user.grade
 var companyId = req.user.companyId
    Exam.find({companyId:companyId,grade:grade},(err, docs) => {
        if (!err) {
            res.render("exam/examList", {
               list:docs,pro:pro
              
            });
        }
    });
  });


   //student results
   router.get('/results',isLoggedIn,student, (req, res) => {
    var pro = req.user
    var uid= req.user.uid
    var companyId = req.user.companyId
     TestX.find({companyId:companyId,uid:uid, type:'Class Test'},(err, docs) => {
         if (!err) {
             res.render("exam/result", {
                list:docs, pro:pro
               
             });
         }
     });
   });
   

   //student results - final exam
   router.get('/examResults',isLoggedIn,student,  (req, res) => {
    var uid= req.user.uid
    var pro = req.user
    var companyId = req.user.companyId
     TestX.find({companyId:companyId,uid:uid, type:'Final Exam'},(err, docs) => {
         if (!err) {
             res.render("exam/resultX", {
                list:docs,pro:pro
               
             });
         }
     });
   });


   router.get('/report/:id',isLoggedIn,student,  (req, res) => {
    var uid= req.user.uid
    var id = req.params.id
    var pro = req.user
    var companyId = req.user.companyId
    TestX.find({_id:id},(err,nocs)=>{
let term = nocs[0].term
let year = nocs[0].year
     TestX.find({companyId:companyId,uid:uid, type:'Final Exam',term:term, year:year},(err, docs) => {
         if (!err) {
             res.render("students/studentReport", {
                list:docs,pro:pro
               
             });
         }
     });
    })
   });



   router.get('/termInfo',isLoggedIn,  function(req,res){
    var m = moment()
    var pro = req.user
    var year = m.format('YYYY')
    var term = req.user.term
    var companyId = req.user.companyId

  
  FeesUpdate.find({companyId:companyId,term:term, year:year},(err, docs) => {
      if (!err) {
          res.render("students/newTerm", {
             list:docs, pro:pro
            
          });
      }
  });
    
      })


  
  router.get('/feesRecord',isLoggedIn,student, function(req,res){
       var pro = req.user
    res.redirect('/student/feesRecordX',{pro:pro})
  })
  
  router.get('/feesRecordX',isLoggedIn,student, function(req,res){
    var pro = req.user
    var id = req.user.paymentId
    var uid = req.user.uid
    var use
    var companyId = req.user.companyId
    Fees.find({companyId:companyId,paymentId:id},function(err,docs){
      User.find({uid:uid},function(err,nocs){
      use = nocs[0]
    
      res.render('accounts/pd',{user:docs[0],use:use, pro:pro})
    })
  })
    
  })
  
  //role - student
  //payment records
  router.get('/paymentRecords',isLoggedIn,student, (req, res) => {
   var id = req.user.uid
      var pro = req.user
      var companyId = req.user.companyId
    Fees.find({companyId:companyId,uid:id},(err, docs) => {
        if (!err) {
            res.render("accounts/list", {
               list:docs,pro:pro
              
            });
        }
    });
  });
  
  
  router.get('/paymentRecord',isLoggedIn,student,  (req, res) => {
    var id = req.user.uid
    var pro = req.user
    var companyId = req.user.companyId
     Fees.find({companyId:companyId,uid:id},(err, docs) => {
         if (!err) {
             res.render("accounts/list", {
                list:docs, pro:pro
               
             });
         }
     });
   });
   
   
  




router.get('/onlinePayment',isLoggedIn,student, function(req,res){
  var id = req.user.feesUpdate
  var fees
  var pro = req.user


res.render('accounts/subscriptions',{fees:fees, pro:pro})

    

 

})


router.get('/onlinePaymentX3',isLoggedIn, function(req,res){
  var pro = req.user

  const { Paynow } = require("paynow");
  // Create instance of Paynow class
  let paynow = new  Paynow(14808, "e351cf17-54bc-4549-81f2-b66feed63768");
      var m = moment()
      var uid = req.user.uid;
      var fullname = req.user.fullname;
      var class1 = req.user.class1;
      var date = moment().toString();
      var term = req.user.term;
      var year = m.format('YYYY')
      var month = m.format('MMMM')
      var amount = req.user.fees
      var receiptNumber = 'null'
      var method = 'paynow';
      var paymentId, id = req.user._id;

      var companyId = req.user.companyId
      let payment = paynow.createPayment("Invoice 35");


// Add items to the payment list passing in the name of the item and it's price
payment.add("fees", amount);
// Send off the payment to Paynow
paynow.send(payment).then( (response) => {

    if(response.success) {
        // Get the link to redirect the user to, then use it as you see fit
        let link = response.redirectUrl;

        // Save poll url, maybe (recommended)?
        let pollUrl = response.pollUrl;

        var poll = new Poll();
 
        poll.pollUrl = pollUrl;
        poll.studentId = uid;
        poll.fullname = fullname;
        poll.date = date;
        poll.amount = amount
        poll.companyId = companyId
        poll.save()
           .then(poll =>{
           
            User.findByIdAndUpdate(id,{$set:{pollUrl:pollUrl,paynow:amount}},function(err,docs){
               
               
                 
               
            })
        



              res.redirect(link)
           })
           

    }else{
      console.log("transaction failed")
    }
  })
      
})





router.get('/onlinePaymentX4',isLoggedIn, function(req,res){
  var pro = req.user
  var companyId = req.user.companyId

  const { Paynow } = require("paynow");
  // Create instance of Paynow class
  let paynow = new  Paynow(14808, "e351cf17-54bc-4549-81f2-b66feed63768");
      var m = moment()
      var uid = req.user.uid;
      var fullname = req.user.fullname;
      var class1 = req.user.class1;
      var date = moment().toString();
      var term = req.user.term;
      var year = m.format('YYYY')
      var month = m.format('MMMM')
      var amount = req.user.annual
      var receiptNumber = 'null'
      var method = 'paynow';
      var paymentId, id = req.user._id;


      let payment = paynow.createPayment("Invoice 35");


// Add items to the payment list passing in the name of the item and it's price
payment.add("fees", amount);
// Send off the payment to Paynow
paynow.send(payment).then( (response) => {

    if(response.success) {
        // Get the link to redirect the user to, then use it as you see fit
        let link = response.redirectUrl;

        // Save poll url, maybe (recommended)?
        let pollUrl = response.pollUrl;

        var poll = new Poll();
 
        poll.pollUrl = pollUrl;
        poll.studentId = uid;
        poll.fullname = fullname;
        poll.date = date;
        poll.amount = amount
        poll.companyId = companyId
        poll.save()
           .then(poll =>{
           
            User.findByIdAndUpdate(id,{$set:{pollUrl:pollUrl,paynow:amount}},function(err,docs){
               
               
                 
               
            })
        



              res.redirect(link)
           })
           

    }else{
      console.log("transaction failed")
    }
  })
      
})
















router.post('/payNowX',isLoggedIn, function(req,res){

  var companyId = req.user.companyId
    const { Paynow } = require("paynow");
    // Create instance of Paynow class
    let paynow = new Paynow(14808, "e351cf17-54bc-4549-81f2-b66feed63768");
        var m = moment()
        var uid = req.user.uid;
        var fullname = req.user.fullname;
        var class1 = req.user.class1;
        var date = moment().toString();
        var term = req.user.term;
        var year = m.format('YYYY')
        var month = m.format('MMMM')
        var amount = req.user.fees
        var receiptNumber = 'null'
        var method = 'paynow';
        var paymentId, id = req.user._id;
  
  
        let payment = paynow.createPayment("Invoice 35");
  
  
  // Add items to the payment list passing in the name of the item and it's price
  payment.add("fees", amount);
  // Send off the payment to Paynow
  paynow.send(payment).then( (response) => {
  
      if(response.success) {
          // Get the link to redirect the user to, then use it as you see fit
          let link = response.redirectUrl;
  
          // Save poll url, maybe (recommended)?
          let pollUrl = response.pollUrl;
  
          var poll = new Poll();
   
          poll.pollUrl = pollUrl;
          poll.studentId = uid;
          poll.fullname = fullname;
          poll.date = date;
          poll.amount = amount;
          poll.companyId = companyId
          poll.save()
             .then(poll =>{
             
              User.findByIdAndUpdate(id,{$set:{pollUrl:pollUrl,paynow:amount}},function(err,docs){
                 
                 
                   
                 
              })
          
  
  
  
                res.redirect(link)
             })
             
  
      }else{
        console.log("transaction failed")
      }
    })
        
  })
  

















router.get('/status',isLoggedIn, function(req,res){

  
  // Create instance of Paynow class
  let paynow = new Paynow("14628", "0b05a9bd-6779-4a6f-9da7-48e03cb96a67");
 let pollUrl="https://www.paynow.co.zw/Interface/CheckPayment/?guid=aff0830e-9275-482a-b5f2-4c6ed0cbc35a";

  let status = paynow.pollTransaction(pollUrl)

  paynow.pollTransaction(pollUrl).then(transaction => {
  console.log(transaction.status)
  console.log(transaction.amount)

    })


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
  
  
  
  
  
  function student(req,res,next){
    if(req.user.role == 'student'){
      return next()
    }
    res.render('errors/access')
    }  

    function status(req,res,next){
      if(req.user.status3 == 'activated'){
        return next()
      }
      res.render('errors/student')
      }  
  

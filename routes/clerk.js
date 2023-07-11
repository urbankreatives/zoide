require('dotenv').config();
require("../config5/keys")
var express = require('express');
var router = express.Router();
const User =require('../models/user')
const Setup =require('../models/setup')
const Class1 =require('../models/class');
const Subject =require('../models/subject');
const Student =require('../models/studentStats');
const Fees =require('../models/fees');
const Num =require('../models/num');
const Poll2 =require('../models/poll2');
const Grade =require('../models/grade');
const { Paynow } = require("paynow");
const Subscriptions =require('../models/subscriptions');
const Dept =require('../models/dept');
const Test =require('../models/classTest');
const Lesson =require('../models/lesson');
const Exam =require('../models/exam');
const Income =require('../models/incomeX');
const MonthIncome =require('../models/incomeMonth');
const MonthExpense =require('../models/expenseMonth');
const TestX =require('../models/classTestX');
const Stats =require('../models/stats');
const Gender =require('../models/gender');
const Pass =require('../models/passRate');
const PassX =require('../models/passRateX');
const TeacherClassRate = require('../models/tcPassRateX')
const TeacherExamRate = require('../models/tcPassRate')
const Expenses = require('../models/expenses')
const FeesUpdate =require('../models/feesUpdate');
const StudentSub =require('../models/studentSubject');
const TeacherSub =require('../models/teacherSubject');
const Room =require('../models/room');
var Quiz = require('../models/quiz');
const stripe = require('stripe')('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');
const keys = require('../config1/keys')
var mongoose = require('mongoose')
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const jwt = require('jsonwebtoken');
const JWT_KEY = "jwtactive987";
const JWT_RESET_KEY = "jwtreset987";
var nodemailer = require('nodemailer');
var passport = require('passport')
var xlsx = require('xlsx')
var multer = require('multer')
const fs = require('fs')
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport')
var moment = require('moment')
var bcrypt = require('bcrypt-nodejs');
const { countReset } = require('console');


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
            res.render("clerk/change", {
               
                user: doc,pro:pro
              
            });
        }
    });
  });
  
  
  
  router.post('/pass',isLoggedIn, function(req,res){
    var user = new User();
    req.check('password','Enter New Password').notEmpty();
  
    req.check('confirmPassword', 'Confirm Password').notEmpty();
  
  
  req.check('password', 'Password do not match').isLength({min: 4}).equals(req.body.confirmPassword);
  var errors = req.validationErrors();
  
  
  
  
   if (errors) {
  
   
  
      req.session.errors = errors;
      req.session.success = false;
      res.render('clerk/change',{ title: 'User Update', user:req.body, errors:req.session.errors, pro:pro
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
        res.render('clerk/change',{message:req.session.message, user:req.user, pro:pro
         }); }
      else {
        console.log('error'+err)
  
      }
    
  })
  }
  
  
  
  })
  
  
  
      
      




router.get('/pollCheck',isLoggedIn,function(req,res){
  var m = moment()
  var year = m.format('YYYY')
  var month = m.format('MMMM')
  var companyId = req.user.companyId


User.find({companyId:companyId,role:"student"},function(err,docs){
for(var i = 0; i<docs.length;i++){
if(docs[i].pollUrl === "null"){
i++;

}else{

let pollUrl = docs[i].pollurl;
let paynow = new Paynow(14808, "e351cf17-54bc-4549-81f2-b66feed63768");

paynow.pollTransaction(pollUrl).then(transaction => {
  if(transaction.status === 'awaiting delivery') {
    // User showed us the doe
    let amount = docs[i].paynow;
    let uid = docs[i].uid;
    let balance = docs[i].balance
    let receiptNumber = 'paynow'
    let class1 = docs[i].class1
    let term = docs[i].term
    let id = docs[i]._id
    let newBalance;
    var fees = new Fees();

    fees.date = m.toString();
    fees.uid = uid;
    fees.class1 = class1;
    fees.fullname = fullname;
    fees.amount= amount;
    fees.term = term;
    fees.year = year;
    fees.month = month;
    fees.method = 'paynow';
    fees.paymentId = pollUrl
    fees.receiptNumber = 'paynow';
  
  
  
    fees.save()
      .then(fee =>{
 

         User.findByIdAndUpdate(id,{$set:{studentId:uid,amount:amount,receiptNumber:'paynow'}},function(err,gocs){




      
          newBalance = balance + fees.amount;

          if(newBalance >= 0){
  
            User.findByIdAndUpdate(id,{$set:{balance:newBalance, status:"paid", term:term, year:year,balanceCarriedOver:balance,paynow:0,pollUrl:'null'}},function(err,docs){
          
      
            
          
            })
        
          }else
          
          User.findByIdAndUpdate(id,{$set:{balance:newBalance, status:"owing", term:term, year:year,balanceCarriedOver:balance,paynow:0,pollUrl:'null'}},function(err,docs){
          
          
            
          

          })
          })
          
        })

    

         }
        })

}





}
res.redirect('/clerk/stats')




})



})
















router.get('/stats',isLoggedIn, function(req,res){
    var students, teachers, paid, unpaid, depts, class1
    var companyId = req.user.companyId
    var m = moment()
    var year = m.format('YYYY')
  User.find({companyId:companyId,role:'student'},function(err,focs){
    students = focs.length
    
  User.find({companyId:companyId,role:'teacher'},function(err,nocs){
    teachers = nocs.length;
    User.find({companyId:companyId,role:'student',status:'paid'},function(err,jocs){
   paid = jocs.length;
  
   User.find({companyId:companyId,role:'student',status:'owing'},function(err,klocs){
     unpaid = klocs.length

     Dept.find({companyId:companyId},function(err,pocs){
      depts = pocs.length;
     
      Class1.find({companyId:companyId},function(err,locs){
        class1 = locs.length

  
     Stats.find({companyId:companyId,year:year},function(err,docs){
  
  if(docs == 0){
  
  
  var stat = new Stats();
  stat.students = students;
  stat.teachers = teachers
  stat.paid = paid;
  stat.unpaid = unpaid
  stat.depts = depts
  stat.class1 = class1
  stat.year = year
  stat.companyId = companyId
  
  
  stat.save()
  .then(sta =>{
  
    res.redirect('/clerk/dashInc')
  
  })
  }
  else
 
  var id = docs[0]._id
  
  Stats.findByIdAndUpdate(id,{$set:{students:students, teachers:teachers,paid:paid, unpaid:unpaid, class1:class1, depts:depts}},function(err,sox){
    


  })
  
  res.redirect('/clerk/dashInc')

  
  
  })
  
    
})
     })
     
   })
  
  
    })
  })
  
  })
  
    
  })
  













  router.get('/dashInc',isLoggedIn,function(req,res){
    var term = req.user.term
    var m = moment()
    var year = m.format('YYYY')
    var fees
    var arr1=[]
    var number1
    var totalStudents, students, passRate
    var companyId = req.user.companyId
  
  
    Income.find({companyId:companyId,year:year},function(err,docs){
  
      Fees.find({companyId:companyId,term:term,year:year},function(err,hods){
  
  
      
  
      if(docs.length == 0 ){
  
        
  
        var inc = Income();
              inc.firstTermIncome = 0;
              inc.firstTermExpense = 0;
              inc.secondTermIncome = 0;
              inc.secondTermExpense = 0
              inc.thirdTermIncome = 0
              inc.thirdTermExpense = 0
              inc.year = year
              inc.companyId = companyId
  
              inc.save()
      .then(incX =>{
  
        res.redirect('/clerk/dashExp')
  
      })
  
      }
      else
      Income.find({companyId:companyId,year:year},function(err,docs){
  
        var id3 = docs[0]._id
      Fees.find({companyId:companyId,term:term,year:year},function(err,hods){
  
        for(var q = 0;q<hods.length; q++){
            
          arr1.push(hods[q].amount)
            }
            //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
             number1=0;
            for(var z in arr1) { number1 += arr1[z]; }
  
  
            
        if(term == 1){
  
    
          Income.findByIdAndUpdate(id3,{$set:{firstTermIncome:number1}},function(err,kocs){
       
          
          })
        }else if(term == 2){
        
          Income.findByIdAndUpdate(id3,{$set:{secondTermIncome:number1}},function(err,kocs){
        
              
              })
            }else{
              Income.findByIdAndUpdate(id3,{$set:{thirdTermIncome:number1}},function(err,kocs){
              
                  
                  })
            }
  
  
  
            res.redirect('/clerk/dashExp')
  
  
      })
    })
  
  
  
  
  
    })
  
  
  })
  
  
  
  })
  
  
  
  
  router.get('/dashExp',isLoggedIn,function(req,res){
  
    let arrX = []
    let totalX
    var term = req.user.term
    var m = moment()
    var year = m.format('YYYY')
    var fees
    var arr1=[]
    var number1
    var companyId = req.user.companyId
  
    Expenses.find({companyId:companyId,term:term,year:year},function(err,hods){
  
      if(hods.length == 0){
  
        res.redirect('/clerk/dashX')
      }
  else
  Income.find({companyId:companyId,year:year},function(err,docs){
    var incX = docs[0]._id
    Expenses.find({companyId:companyId,term:term,year:year},function(err,pods){
    
    
  for(var q = 0;q<pods.length; q++){
            
    arrX.push(pods[q].amount)
    }
    //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
     totalX=0;
    for(var z in arrX) { totalX += arrX[z]; }
    
    
    if(term == 1){
    
    
    Income.findByIdAndUpdate(incX,{$set:{firstTermExpense:totalX}},function(err,kocs){
  
    
    })
    }else if(term == 2){
    
    Income.findByIdAndUpdate(incX,{$set:{secondTermExpense:totalX}},function(err,kocs){
  
      
      })
    }else{
      Income.findByIdAndUpdate(incX,{$set:{thirdTermExpense:totalX}},function(err,kocs){
        
          
          })
        
    }
    res.redirect('/clerk/adminMonthInc')
  })
  })
    })
  
  
  })
  
  





//Monthly Income Stats

router.get('/adminMonthInc', isLoggedIn,  function(req,res){
  var term = req.user.term
  var m = moment()
  var year = m.format('YYYY')
  var month = m.format('MMMM')
  var fees
  var arr1=[]
  var number1
  var totalStudents, students, passRate
  var companyId = req.user.companyId


  MonthIncome.find({companyId:companyId,year:year,month:month},function(err,docs){

    Fees.find({companyId:companyId,year:year,month:month},function(err,hods){


    

    if(docs.length == 0  && hods.length == 0){

      

      var inc = MonthIncome();
            inc.amount = 0;
            inc.month = month;
            inc.year = year
            inc.companyId = companyId

            inc.save()
    .then(incX =>{

      res.redirect('/clerk/adminMonthExp')

    })

    }
    else
    MonthIncome.find({companyId:companyId,year:year,month:month},function(err,docs){

      var id3 = docs[0]._id
    Fees.find({companyId:companyId,year:year,month:month},function(err,hods){

      for(var q = 0;q<hods.length; q++){
          
        arr1.push(hods[q].amount)
          }
          //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
           number1=0;
          for(var z in arr1) { number1 += arr1[z]; }



          MonthIncome.findByIdAndUpdate(id3,{$set:{amount:number1}},function(err,kocs){

          })
          
      



          res.redirect('/clerk/adminMonthExp')


    })
  })





  })


})



})





router.get('/adminMonthExp', isLoggedIn,  function(req,res){
  var term = req.user.term
  var m = moment()
  var year = m.format('YYYY')
  var month = m.format('MMMM')
  var fees
  var arr1=[]
  var number1
  var totalStudents, students, passRate
  var companyId = req.user.companyId


  MonthExpense.find({companyId:companyId,year:year,month:month},function(err,docs){

    Expenses.find({companyId:companyId,year:year,month:month},function(err,hods){


    

    if(docs.length == 0  && hods.length == 0){

      

      var exp = MonthExpense();
            exp.amount = 0;
            exp.month = month;
            exp.year = year
            exp.companyId = companyId

            exp.save()
    .then(incX =>{

      res.redirect('/clerk/dashX')

    })

    }
    else
    MonthExpense.find({companyId:companyId,year:year,month:month},function(err,docs){

      var id3 = docs[0]._id
    Expenses.find({companyId:companyId,year:year,month:month},function(err,hods){

      for(var q = 0;q<hods.length; q++){
          
        arr1.push(hods[q].amount)
          }
          //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
           number1=0;
          for(var z in arr1) { number1 += arr1[z]; }



          MonthExpense.findByIdAndUpdate(id3,{$set:{amount:number1}},function(err,kocs){

          })
          
      



          res.redirect('/clerk/dashX')


    })
  })





  })


})



})










/*
router.get('/fUpdate',isLoggedIn,function(req,res){

  var feeX = req.user.fees
  var annual = req.user.annual
  var companyId = req.user.companyId
  var term = req.user.term
  var year = req.user.year
  var feeId = req.user.feesUpdate


User.find({companyId:companyId,role:"student"},function(err,docs){
  if(docs.length == 0){
    res.redirect('/clerk/dashX')
  }else
     
    for(var i  = 0; i< docs.length; i++){
      let balanceX;
      let balance
      let balanceCarriedOver
    balanceX = docs[i].balance 
    balance = balanceX - feeX
    balanceCarriedOver = docs[i].balance
  
    console.log('balance',balance)
    console.log('balanceX', balanceX)
    console.log('fees',feeX)
  
    if(balance > 0){
      
      User.findByIdAndUpdate(docs[i]._id,{$set:{balance:balance, status:"paid", term:term, year:year,balanceCarriedOver:balanceCarriedOver,feesUpdate:feeId,annual:annual,fees:feeX}},function(err,docs){
    
    
      
    
      })
  
    }else
    
    User.findByIdAndUpdate(docs[i]._id,{$set:{balance:balance, status:"owing", term:term, year:year,balanceCarriedOver:balanceCarriedOver,feesUpdate:feeId,annual:annual,fees:feeX}},function(err,docs){
    
    
      
    
    })
    
    }
    res.redirect('/clerk/dashX')
    })

    })








*/

  
  router.get('/dashX',isLoggedIn,function(req,res){
    var pro = req.user
      res.render('dashboard/clerk',{pro:pro})
  })
  


  router.get('/dash',isLoggedIn, function(req,res){
    res.redirect('/clerk/stats')
    })



  
     router.post('/statChart',isLoggedIn,function(req,res){
  var m = moment()
  var year = m.format('YYYY')
  var companyId = req.user.companyId

        Stats.find({companyId:companyId,year:year},function(err,docs){
          if(docs == undefined){
            res.redirect('/clerk/dash')
          }else
      
             res.send(docs)
         
          
           })
      
      })
      //calendar
  
      router.post('/calendarChart',isLoggedIn,function(req,res){
        var companyId = req.user.companyId
        Calendar.find({companyId:companyId},function(err,docs){
          if(docs == undefined){
            res.redirect('/clerk/dash')
          }else
      
             res.send(docs)
         
          
           })
      
      
        })







        

        router.post('/statChart',isLoggedIn,function(req,res){
          var m = moment()
          var year = m.format('YYYY')
        var companyId = req.user.companyId
                Stats.find({companyId:companyId,year:year},function(err,docs){
                  if(docs == undefined){
                    res.redirect('/dash')
                  }else
              
                     res.send(docs)
                 
                  
                   })
              
              })





//Income Chart for School terms

        router.post('/incomeChart',isLoggedIn, function(req,res){
          var m = moment()
          var year = m.format('YYYY')
           var companyId = req.user.companyId
                Income.find({companyId:companyId,year:year},function(err,docs){
                  if(docs == undefined){
                    res.redirect('/dash')
                  }else
              
                     res.send(docs)
                 
                  
                   })
              
              })
      
      
 //feesMonthIncomeChart             
      router.post('/feesChart',isLoggedIn, function(req,res){
          var m = moment()
          var year = m.format('YYYY')
          var companyId = req.user.companyId
                MonthIncome.find({companyId:companyId,year:year},function(err,docs){
                  if(docs == undefined){
                    res.redirect('/dash')
                  }else
              
                     res.send(docs)
                 
                  
                   })
              
              })


                   
 //expenseMonthIncomeChart             
      router.post('/expenseChart',isLoggedIn, function(req,res){
        var m = moment()
        var year = m.format('YYYY')
        var companyId = req.user.companyId
              MonthExpense.find({companyId:companyId,year:year},function(err,docs){
                if(docs == undefined){
                  res.redirect('/dash')
                }else
            
                   res.send(docs)
               
                
                 })
            
            })




























            router.get('/msgX',isLoggedIn,function(req,res){
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
            
          res.redirect('/msg')
          })
          
          })
          
          
          
          
          
          
          
          
          
          
          
          
          router.get('/msg',isLoggedIn,function(req,res){
          var id = req.user.id
          const list2 =[]
          const list = []
          var num
           
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
          console.log(list,'list yacho')
          
          
          }
          
          num  = docs.length
          }
          })  
          
          //})
          
          }
          res.render('clerkMess/inbox',{list:list, num:num})
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
          
          
          router.get('/sentXX',isLoggedIn,function(req,res){
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
          res.redirect('/sent')
          })
          
          })
          
          
          
          
          
          router.get('/sent',isLoggedIn,function(req,res){
          var id = req.user.id
          const list2 =[]
          const list = []
          var num
           
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
          
          
          res.render('clerkMess/sent',{list:list, num:num})
          })
          
          })
          
          
          
          router.get('/archiveXX',isLoggedIn,function(req,res){
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
          res.redirect('/archive')
          
          })
          
          })
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          router.get('/archive',isLoggedIn,function(req,res){
          var id = req.user.id
          const list2 =[]
          const list = []
          var num
          
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
          
          res.render('clerkMess/sent',{list:list, num:num})
                 
          })
          
          })
          
          
          
          
          router.post('/marked',isLoggedIn,function(req,res){
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
          
          router.post('/archiveX',isLoggedIn,function(req,res){
          
          let id = req.user.id
          Recepient.find({ statusX:'marked', recepientId:id },function(err,docs){
          
          for(var i = 0; i<docs.length;i++){
          
          
          Recepient.findByIdAndUpdate(docs[i]._id,{$set:{archive:'yes',statusXX:'yes'}},function(err,nocs){
          
          })
          
          }
          
          res.send(docs)
          })
          })
          
          
          
          router.post('/readX',isLoggedIn,function(req,res){
          
          let id = req.user.id
          Recepient.find({ statusX:'marked', recepientId:id },function(err,docs){
          
          for(var i = 0; i<docs.length;i++){
          
          
          Recepient.findByIdAndUpdate(docs[i]._id,{$set:{read:'yes',statusXX:'yes'}},function(err,nocs){
          
          })
          
          }
          
          res.send(docs)
          })
          })
          
          
          
          
          
          
          
          
          router.post('/delete',isLoggedIn,function(req,res){
          
          let id = req.user.id
          Recepient.find({ statusX:'marked', recepientId:id },function(err,docs){
          
          for(var i = 0; i<docs.length;i++){
          
          
          Recepient.findByIdAndUpdate(docs[i]._id,{$set:{status:'deleted',statusXX:'yes'}},function(err,nocs){
          
          })
          
          }
          
          res.send(docs)
          })
          })
          
          
            router.get('/comp',isLoggedIn,  function(req,res){
              res.render('clerkMess/compose')
            })
          
           
            router.post('/userX',isLoggedIn,function(req,res){
              var id =req.user.id
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
          
          
          
          router.post('/dataX',isLoggedIn,function(req,res){
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
          res.redirect('/sentX')
          })
          
          
          
          
          
          })
          
          router.get('/reply/:id', isLoggedIn, function(req,res){
          var id = req.params.id
          var uid = req.user._id
          console.log(id,'id')
          var arr = []
          Message.find({msgId:id,status:'sent'},function(err,tocs){
          arr.push(tocs[0].senderEmail)
          let sub = tocs[0].subject
          Message.find({msgId:id,status:'reply',recepientId:uid},function(err,docs){
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
          
          
          Message.findByIdAndUpdate(Vid,{$set:{status4:timeX2,status5:timeX3}},function(err,locs){
          
          
          
          // Format relative time using negative value (-1).
          
          
          })
          
          }
          console.log(arr,'arr')
          
          res.render('messages/reply',{list:docs,id:id, arr:arr, subject:sub})
          })
          
          })
          })
          })
          
          
          
          router.post('/reply/:id', isLoggedIn, function(req,res){
          var m = moment()
          var year = m.format('YYYY')
          var numDate = m.valueOf()
          var id = req.params.id
          var senderId = req.user._id
          var senderName = req.user.fullname
          var senderEmail = req.user.email
          var sub = req.body.compose_subject
          let msg = 'vocal tone'
          
          Message.findById({msgId:id, status:'sent'},function(err,docs){
          
          
          
          
          
          
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
          
          
          
          
          router.post('/replyX/:id',isLoggedIn,function(req,res){
          console.log(req.body.code1,'code1')
          console.log(req.body['compose_to[]'],'compose_to')
          let code = req.body.code1
          var sub = req.body.code1
          let id = req.params.id
          var arr = []
          Message.find({msgId:id,status:'sent'},function(err,tocs){
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
          
          
          router.post('/replyX2/:id',isLoggedIn,function(req,res){
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
          
          })
          
          
          })
          
          
          
          router.post('/replyX3/:id',isLoggedIn,function(req,res){
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
          
          
          })
          })
          
          
          
          
          
























  //profile
  router.get('/profile',isLoggedIn ,function(req,res){
    var pro = req.user
    res.render('clerk/overview',{pro:pro})
  })


  
router.post('/profile',isLoggedIn,upload.single('file'),function(req,res){
  var pro = req.user


  if(!req.file){
   req.session.message = {
     type:'errors',
     message:'Select Picture'
   }     
     res.render('clerk/overview', {
          user:req.body, message:req.session.message,pic:req.user.photo,user:req.user , pro:pro
      }) 
   
  } else
  var imageFile = req.file.filename;
  var id  = req.user._id;
 console.log(imageFile)
 console.log(id)
  User.findByIdAndUpdate(id,{$set:{photo:imageFile}},function(err,data){ 
  
  
    
  
  
  })
 
  res.redirect('/clerk/profile')

     //res.render('uploads/index',{title:'Upload File',records:data, success:success})


   

  
 
})

     
   
  
  
  
  
  //role admin
  //capturing school fees
  router.get('/addFees',isLoggedIn,clerk, function(req,res){
    var day = moment().toString()
    var pro = req.user
    res.render('students/addFees',{day:day, pro:pro})
  })
  
  
  
  
  
  router.post('/incomeChart',isLoggedIn,function(req,res){
      var m = moment()
      var year = m.format('YYYY')
      var term = req.user.term
      var companyId = req.user.companyId
            Income.find({companyId:companyId,year:year, term:term},function(err,docs){
              if(docs == undefined){
                res.redirect('/clerk/dash')
              }else
          
                 res.send(docs)
             
              
               })
          
          })
  
  
  
  router.post('/addFees',isLoggedIn,clerk, function(req,res){
    var pro = req.user
  var m = moment()
  var xId = req.user._id;
  var uid = req.body.uid;
  var fullname = req.body.fullname;
  var class1 = req.body.class1;
  var date = moment().toString();
  var term = req.body.term;
  var amount = req.body.amount;
  var year = m.format('YYYY')
  var month = m.format('MMMM')
  var receiptNumber = req.body.receiptNumber;
  var method = 'manual'
  var day = moment().toString()
  var companyId = req.user.companyId
  
    req.check('uid','Enter Student ID').notEmpty();
    req.check('fullname','Enter Student Name').notEmpty();
    req.check('date','Enter Date').notEmpty();
    req.check('term','Enter Term').notEmpty();
    req.check('amount','Enter Fees Amount').notEmpty();
    req.check('receiptNumber','Enter Receipt Number').notEmpty();
    
  
    var errors = req.validationErrors();
       
    if (errors) {
      
      req.session.errors = errors;
      req.session.success = false
      res.render('students/addFees',{errors:req.session.errors,pro:pro})
    }
  else
  {
    User.findOne({'uid':uid})
    .then(user=>{
      if(user){
  
  
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
        fees.paymentId = 'null'
        fees.receiptNumber = receiptNumber;
        fees.companyId = companyId
      
      
      
        fees.save()
          .then(fee =>{
            User.find({companyId:companyId,uid:uid},function(err,docs){
  
             User.findByIdAndUpdate(xId,{$set:{studentId:uid,amount:amount,receiptNumber:receiptNumber}},function(err,gocs){
            
  
  console.log('xId',xId)
  
              balance = docs[0].balance;
              newBalance = balance + fees.amount;
  
              if(newBalance >= 0){
      
                User.findByIdAndUpdate(docs[0]._id,{$set:{balance:newBalance, status:"paid", term:term, year:year,balanceCarriedOver:balance}},function(err,docs){
              
          
                
              
                })
            
              }else
              
              User.findByIdAndUpdate(docs[0]._id,{$set:{balance:newBalance, status:"owing", term:term, year:year,balanceCarriedOver:balance}},function(err,docs){
              
              
                
              
              })
              
              
  
  
  
            })
  
          })
  
          })
  
  
  
      }
      
    res.redirect('/clerk/printX')
  })
  }
   
  })
  
  
  router.get('/printX',isLoggedIn,function(req,res){
    res.redirect('/clerk/print')
  })
  
  router.get('/print',isLoggedIn,function(req,res){
    var uid =req.user.studentId;
    var day = moment().toString();
    var amount = req.user.amount
    var companyId = req.user.companyId
    User.find({companyId:companyId,uid:uid},function(err,zocs){
  
      
         
         res.render('accounts/receipt', {
           date:day,uid:uid,user:zocs[0], clerk:req.user.fullname, amount:amount})
     
    })
  })
  
  
  
  
    //role admin
    //Autocomplete for student details when recording school fees
    router.get('/autocompleteX/',isLoggedIn, function(req, res, next) {
      var name,uid, surname
    var companyId = req.user.companyId
        var regex= new RegExp(req.query["term"],'i');
       
        var uidFilter =User.find({companyId:companyId,uid:regex, role:"student"},{'uid':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
      
        
        uidFilter.exec(function(err,data){
       
     
      console.log('data',data)
      
      var result=[];
      
      if(!err){
         if(data && data.length && data.length>0){
           data.forEach(user=>{
     
            
         
      
              
             let obj={
               id:user._id,
               label: user.uid
    
           
         
           
             
              
      
               
             };
            
             result.push(obj);
          
         
           });
      
         }
       
         res.jsonp(result);
    
        }
      
      })
     
      });
    
    //role admin
  //this route autopopulates info of the title selected from the autompleteX route
      router.post('/autoX',isLoggedIn,function(req,res){
          var uid = req.body.code
          var companyId = req.user.companyId
      
          
         
          User.find({companyId:companyId,uid:uid},function(err,docs){
         if(docs == undefined){
           res.redirect('/clerk/addFees')
         }else
        
            res.send(docs[0])
          })
        
        
        })
        
      
      
      
  
  
  
        router.get('/feesRecords',isLoggedIn, (req, res) => {
          var pro = req.user
          var companyId = req.user.companyId
          Fees.find({companyId:companyId},(err, docs) => {
              if (!err) {
                  res.render("clerk/feesRecord", {
                     list:docs, pro:pro
                    
                  });
              }
          });
        });
        
  
  
  
  
  
  

  
  
router.get('/subscriptions',isLoggedIn,function(req,res){
  var pro = req.user

  Subscriptions.find({},(err, docs) => {

  res.render('clerk/subscriptions1',{doc:docs[0],pro:pro})

  })
})

router.get('/startup',isLoggedIn,function(req,res){
  const { Paynow } = require("paynow");
  // Create instance of Paynow class
  let paynow = new Paynow(14808, "e351cf17-54bc-4549-81f2-b66feed63768");
  var m = moment()
  var id  = req.user._id
  var companyId = req.user.companyId;
  var schoolName = req.user.schoolName;
  var date = moment().toString();
  var amount , pollCount, duration
  Subscriptions.find({},function(err,docs){
    amount = docs[0].startup
    pollCount = docs[0].startupCount
    duration = docs[0].startupDuration
     
      console.log(amount,'money')
 /*
  Subscriptions.find({},function(err,docs){
amount = docs[0].startup
  })*/
  
  let payment = paynow.createPayment("Subscription");

  
// Add items to the payment list passing in the name of the item and it's price
payment.add("Startup Quartely Package", amount);
// Send off the payment to Paynow
paynow.send(payment).then( (response) => {

    if(response.success) {
        // Get the link to redirect the user to, then use it as you see fit
        let link = response.redirectUrl;

        let pollUrl = response.pollUrl;

        var poll = new Poll2();
 
        poll.pollUrl = pollUrl;
        poll.companyId = companyId;
        poll.schoolName = schoolName;
        poll.date = date;
        poll.package = "Startup Quarterly Package"
        poll.amount = amount
        poll.count = pollCount
        poll.duration = duration
        poll.save()
           .then(poll =>{
           
            User.findByIdAndUpdate(id,{$set:{pollUrl2:pollUrl,paynow:amount,pollCount:pollCount, duration:duration}},function(err,docs){
               
               
                 
               
            })
        



              res.redirect(link)
           })
    }
    else{
res.redirect('/clerk/subscriptions')
    }
  })
})
})

//startup A
router.get('/startupA',isLoggedIn,function(req,res){
  var m = moment()
  var companyId = req.user.companyId;
  var schoolName = req.user.schoolName;
  var date = moment().toString();
  var id  = req.user._id

  const { Paynow } = require("paynow");
  // Create instance of Paynow class
  let paynow = new Paynow(14808, "e351cf17-54bc-4549-81f2-b66feed63768");
  var amount , pollCount, duration
  Subscriptions.find({},function(err,docs){
    amount = docs[0].startupA
    pollCount = docs[0].startupCount
    duration = docs[0].startupAduration
     
  
  let payment = paynow.createPayment("Subscription");

  
// Add items to the payment list passing in the name of the item and it's price
payment.add("Startup Annual Package", amount);
// Send off the payment to Paynow
paynow.send(payment).then( (response) => {

    if(response.success) {
        // Get the link to redirect the user to, then use it as you see fit
        let link = response.redirectUrl;

        let pollUrl = response.pollUrl;

        var poll = new Poll2();
 
        poll.pollUrl = pollUrl;
        poll.companyId = companyId;
        poll.schoolName = schoolName;
        poll.date = date;
        poll.package = "Startup Annual Package"
        poll.amount = amount
        poll.count = pollCount
        poll.duration = duration
        poll.save()
           .then(poll =>{
           
            User.findByIdAndUpdate(id,{$set:{pollUrl2:pollUrl,paynow:amount,pollCount:pollCount,duration:duration}},function(err,docs){
               
               
                 
               
            })
        



              res.redirect(link)
           })
    }
    else{
res.redirect('/clerk/subscriptions')
    }
  })
  })
})


//advanced Q
router.get('/advanced',isLoggedIn, function(req,res){
  var m = moment()
  var companyId = req.user.companyId;
  var schoolName = req.user.schoolName;
  var date = moment().toString();
  var id  = req.user._id

  var count = 100
  const { Paynow } = require("paynow");
  // Create instance of Paynow class
  let paynow = new Paynow(14808, "e351cf17-54bc-4549-81f2-b66feed63768");
  var amount , pollCount, duration
  Subscriptions.find({},function(err,docs){
    amount = docs[0].advanced
    pollCount = docs[0].advancedCount
    duration = docs[0].advancedDuration
    
  
  let payment = paynow.createPayment("Subscription");

  
// Add items to the payment list passing in the name of the item and it's price
payment.add("Advanced Quartely Package", amount);
// Send off the payment to Paynow
paynow.send(payment).then( (response) => {

    if(response.success) {
        // Get the link to redirect the user to, then use it as you see fit
        let link = response.redirectUrl;

        let pollUrl = response.pollUrl;

        var poll = new Poll2();
 
        poll.pollUrl = pollUrl;
        poll.companyId = companyId;
        poll.schoolName = schoolName;
        poll.package = "Advanced Quartely Package"
        poll.date = date;
        poll.amount = amount
        poll.count = pollCount
        poll.duration = duration
        poll.save()
           .then(poll =>{
           
            User.findByIdAndUpdate(id,{$set:{pollUrl2:pollUrl,paynow:amount,pollCount:pollCount, duration:duration}},function(err,docs){
               
               
                 
               
            })
        



              res.redirect(link)
           })
    }
    else{
res.redirect('/clerk/subscriptions')
    }
  })
  })
})

//advanced A
router.get('/advancedA',isLoggedIn, function(req,res){
  var m = moment()
  var companyId = req.user.companyId;
  var schoolName = req.user.schoolName;
  var date = moment().toString();
  var id  = req.user._id
 
  const { Paynow } = require("paynow");
  // Create instance of Paynow class
  let paynow = new Paynow(14808, "e351cf17-54bc-4549-81f2-b66feed63768");
  var amount , pollCount, duration
  Subscriptions.find({},function(err,docs){
    amount = docs[0].advancedA
        pollCount = docs[0].advancedCount
        duration = docs[0].advancedAduration
     
  
  let payment = paynow.createPayment("Subscription");

  
// Add items to the payment list passing in the name of the item and it's price
payment.add("Advanced Annual Package", amount);
// Send off the payment to Paynow
paynow.send(payment).then( (response) => {

    if(response.success) {
        // Get the link to redirect the user to, then use it as you see fit
        let link = response.redirectUrl;

        let pollUrl = response.pollUrl;

        var poll = new Poll2();
 
        poll.pollUrl = pollUrl;
        poll.companyId = companyId;
        poll.schoolName = schoolName;
        poll.package = "Advanced Quartely Package"
        poll.date = date;
        poll.amount = amount
        poll.count = pollCount
        poll.duration = duration
        poll.save()
           .then(poll =>{
           
            User.findByIdAndUpdate(id,{$set:{pollUrl2:pollUrl,paynow:amount,pollCount:pollCount, duration:duration}},function(err,docs){
               
               
                 
               
            })
        



              res.redirect(link)
           })
    }
    else{
res.redirect('/clerk/subscriptions')
    }
  })
  })
})

//enterprise Q
router.get('/enterprise',isLoggedIn, function(req,res){
  var m = moment()
  var companyId = req.user.companyId;
  var schoolName = req.user.schoolName;
  var date = moment().toString();
  var id  = req.user._id
 
  const { Paynow } = require("paynow");
  // Create instance of Paynow class
  let paynow = new Paynow(14808, "e351cf17-54bc-4549-81f2-b66feed63768");
  var amount , pollCount, duration
  Subscriptions.find({},function(err,docs){
    amount = docs[0].enterprise
    pollCount = docs[0].enterpriseCount
    duration = docs[0].enterpriseDuration
      
  
  let payment = paynow.createPayment("Subscription");

  
// Add items to the payment list passing in the name of the item and it's price
payment.add("Enterprise Quartely Package", amount);
// Send off the payment to Paynow
paynow.send(payment).then( (response) => {

    if(response.success) {
        // Get the link to redirect the user to, then use it as you see fit
        let link = response.redirectUrl;

        let pollUrl = response.pollUrl;

        var poll = new Poll2();
 
        poll.pollUrl = pollUrl;
        poll.companyId = companyId;
        poll.schoolName = schoolName;
        poll.package = "Enterprise Quartely Package"
        poll.date = date;
        poll.amount = amount
        poll.count = pollCount
        poll.duration = duration
        poll.save()
           .then(poll =>{
           
            User.findByIdAndUpdate(id,{$set:{pollUrl2:pollUrl,paynow:amount,pollCount:pollCount,duration:duration}},function(err,docs){
               
               
                 
               
            })
        



              res.redirect(link)
           })
    }
    else{
res.redirect('/clerk/subscriptions')
    }
  })
  })
})

//enterprise A
router.get('/enterpriseA',isLoggedIn, function(req,res){
  var m = moment()
  var companyId = req.user.companyId;
  var schoolName = req.user.schoolName;
  var date = moment().toString();
  var id  = req.user._id

  const { Paynow } = require("paynow");
  // Create instance of Paynow class
  let paynow = new Paynow(14808, "e351cf17-54bc-4549-81f2-b66feed63768");
  var amount , pollCount, duration
  Subscriptions.find({},function(err,docs){
    amount = docs[0].enterprise
    pollCount = docs[0].enterpriseCount
    duration = docs[0].enterpriseAduration
     
  
  let payment = paynow.createPayment("Subscription");

  
// Add items to the payment list passing in the name of the item and it's price
payment.add("Enterprise Annual Package", amount);
// Send off the payment to Paynow
paynow.send(payment).then( (response) => {

    if(response.success) {
        // Get the link to redirect the user to, then use it as you see fit
        let link = response.redirectUrl;

        let pollUrl = response.pollUrl;

        var poll = new Poll2();
 
        poll.pollUrl = pollUrl;
        poll.companyId = companyId;
        poll.schoolName = schoolName;
        poll.package = "Enterprise Annual Package"
        poll.date = date;
        poll.amount = amount
        poll.count = pollCount
        poll.duration = duration
        poll.save()
           .then(poll =>{
           
            User.findByIdAndUpdate(id,{$set:{pollUrl2:pollUrl,paynow:amount,pollCount:pollCount, duration:duration}},function(err,docs){
               
               
                 
               
            })
        



              res.redirect(link)
           })
    }
    else{
res.redirect('/clerk/subscriptions')
    }
  })
  })
})
  



router.get('/subsPoll',isLoggedIn, (req, res) => {
  var pro = req.user 
  var companyId = req.user.companyId 
  var set = moment()
  var m2 = moment(req.user.expStr)
  
  var msg ="Package Expired"
  var days=m2.diff(set,"days");
  console.log(days)
  var les = days<=0;
  console.log(les)
  var mor = days>0;
  Poll2.find({companyId:companyId}, (err, doc) => {
      if (!err) {
      
          res.render("clerk/subPoll", {
             
              list: doc, pro:pro, msg:msg, days:days, les:les, mor:mor
            
              
          });
        
      }
  });
  });

  
  //role admin
  //adding expenses
  router.get('/expenses',isLoggedIn,clerk, function(req,res){
       var pro = req.user
    var days = moment().toString()
    res.render('accounts/expenses',{days:days, pro:pro})
  })
  
  
      
    router.post('/expenses',isLoggedIn,clerk, function(req,res){
         var pro = req.user
      var m = moment()
      var n = moment().toString()
      var description = req.body.description;
      var type = req.body.type;
      var amount = req.body.amount;
      var voucherNumber = req.body.voucherNumber;
      var status = req.body.status;
      var term = req.user.term;
      var payment = req.body.payment;
      var year = m.format('YYYY')
      var month = m.format('MMMM')
      var days = moment().toString()
      var voucherNumber = req.body.voucherNumber
      var companyId = req.user.companyId
  
  
  
      req.check('description','Enter Description').notEmpty();
      req.check('type','Enter Expense Type').notEmpty();
      req.check('amount','Enter Amount').notEmpty();
      req.check('voucherNumber','Enter Voucher #').notEmpty();
      req.check('status','Enter Status').notEmpty();
      req.check('payment','Enter payment method').notEmpty();
    
  
      var errors = req.validationErrors();
      if (errors) {
     
        req.session.errors = errors;
        req.session.success = false;
        res.render('accounts/expenses',{errors:req.session.errors, pro:pro})
     
      
     }
     else
     Expenses.findOne({'companyId':companyId,'voucherNumber':voucherNumber})
    .then(exp=>{
      if(exp){
        req.session.message = {
          type:'errors',
          message:'Expense already Recorded'
        }     
           res.render('accounts/expenses', {
              message:req.session.message,days:days, pro:pro })
           }
           else
  
     var expenses = new Expenses();
      
     expenses.date = n;
     expenses.description = description;
     expenses.type = type;
     expenses.amount= amount;
     expenses.term = term;
     expenses.year = year;
     expenses.voucherNumber = voucherNumber;
     expenses.status = status;
     expenses.payment = payment;
     expenses.month = month;
     expenses.companyId = companyId
   
   
     expenses.save()
       .then(expense =>{
  
       
        req.session.message = {
          type:'success',
          message:'Expense Recorded'
        }     
           res.render('accounts/expenses', {
              message:req.session.message,days:days, pro:pro })
       })
  
   
    })
  })
           
     
  
  router.get('/expenseList',isLoggedIn, (req, res) => {
    var pro = req.user
    var companyId = req.user.companyId
    Expenses.find({companyId:companyId},(err, docs) => {
        if (!err) {
            res.render("clerk/expenseRecord", {
               list:docs, pro:pro
              
            });
        }
    });
  });
  
    
  
  


 //new term fees update
 router.get('/feesUpdate',isLoggedIn,clerk, function(req,res){
   var pro = req.user
    var id = req.user.feesUpdate;
    var m = moment()
    var day = moment().toString()
    var days, endDate;
    var user = req.user.feesUpdate
    var companyId = req.user.companyId
    if(user == 'null'){
    

    
        res.render('clerk/feesUpdate',{pro:pro})

    }
    else
    

    
    FeesUpdate.find({_id:id},function(err,docs){
      let readonly
      try{
        
    
    if(!docs){
      throw new SyntaxError('No data')
    }
    
      endDate = moment(docs[0].endDate);
      //moment(endDate)
      days = endDate.diff(m,'days')
    console.log(days,'days')
      if(days >  0){
    readonly = 'readonly'
    title = days + '' + ' '+ 'days left until you can add new term'
        res.render('clerk/feesUpdate2',{readonly:readonly,day:day, title:title,pro:pro,doc:docs[0]})
    
      }else
    
      readonly = " ";
      console.log(readonly)
    title = ' Update '
        res.render('clerk/feesUpdate',{readonly:readonly,day:day,title:title,pro:pro})
      
      }catch(e){
        res.send(e.message)
       }
    
    
    })
      })
      
      router.post('/feesUpdate',isLoggedIn,clerk,  function(req,res){
      var startDate = req.body.startDate;
      var endDate = req.body.endDate;
      var balanceX, status, term, year, balanceCarriedOver, balance
      var id = req.user._id
      var m = moment()
      var date = moment().toString()
      term = req.body.term
      year = m.format('YYYY')
      var feeX = req.body.fees
      var annual = req.body.annual
      var companyId = req.user.companyId
      
     
      
      b =moment(startDate).valueOf()
      bs = moment(b).toString()
      console.log('startDate',b)
      f = moment(endDate).valueOf()
      fstr = moment(f)
      console.log('fstr',fstr)
      console.log('endDate',f)
     //var days = f.diff(b,"days")
     var days = m.diff(bs,'days')
     
       
     console.log(days,'days')
     req.check('startDate','Enter Start of Term').notEmpty();
     req.check('endDate','Enter End of Term').notEmpty();
     req.check('fees','Enter Fees').notEmpty().isNumeric();
     req.check('annual','Enter Annual Fees').notEmpty().isNumeric();
     req.check('term','Enter Term').notEmpty();
    
     var errors = req.validationErrors();
     if (errors) {
    
       req.session.errors = errors;
       req.session.success = false;
       res.render('clerk/feesUpdate',{errors:req.session.errors,pro:pro})
    
     
    }
    
      var fees = new FeesUpdate();
        
      fees.date = date;
      fees.startDate = startDate;
      fees.endDate = endDate;
      fees.fees= req.body.fees;
      fees.annual = annual;
      fees.term = term;
      fees.year = year
      fees.companyId = companyId
    
      fees.person = req.user.fullname
    
    
      fees.save()
        .then(fee =>{
       var adminBal = 0 - fee.fees
          User.findByIdAndUpdate(id,{$set:{feesUpdate:fee._id,term:term,balance:adminBal,fees:feeX,annual:annual}},function(err,docs){
    
    
          })
    
    
      User.find({companyId:companyId,role:"student"},function(err,nocs){
      
      for(var i  = 0; i< nocs.length; i++){
      balanceX = nocs[i].balance 
      balance = balanceX - feeX
      balanceCarriedOver = nocs[i].balance
    
      console.log('balance',balance)
      console.log('balanceX', balanceX)
      console.log('fees',feeX)
    
      if(balance > 0){
        
        User.findByIdAndUpdate(nocs[i]._id,{$set:{balance:balance, status:"paid", term:term, year:year,balanceCarriedOver:balanceCarriedOver,feesUpdate:fee._id,annual:annual,fees:feeX}},function(err,docs){
      
      
        
      
        })
    
      }else
      
      User.findByIdAndUpdate(nocs[i]._id,{$set:{balance:balance, status:"owing", term:term, year:year,balanceCarriedOver:balanceCarriedOver,feesUpdate:fee._id,annual:annual,fees:feeX}},function(err,docs){
      
      
        
      
      })
      
      }
      res.redirect('/clerk/feesUpdateX')
      })
    })
      
      })
    


router.get('/feesUpdateX',isLoggedIn,function(req,res){
  res.redirect('/clerk/feesUpdate')
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



function clerk(req,res,next){
    if(req.user.role == "clerk"){
      return next()
    }
    res.render('errors/access')
    }  
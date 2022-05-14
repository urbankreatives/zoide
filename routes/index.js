require('dotenv').config();

var express = require('express');
var router = express.Router();
const User =require('../models/user')
const Class1 =require('../models/class');
const Subject =require('../models/subject');
const Fees =require('../models/fees');
const Grade =require('../models/grade');
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


//login route
router.get('/', function (req, res, next) {
    var messages = req.flash('error');
    
    res.render('users/login', { messages: messages, hasErrors: messages.length > 0});
  });
  router.post('/', passport.authenticate('local.signin', {
    failureRedirect: '/',
    failureFlash: true
  }), function (req, res, next) {
    if(req.user.role == "admin"){
      res.redirect("/adminMonthInc");
    }else if(req.user.role == 'teacher')
    res.redirect('/teacher/passRate')
    else if(req.user.role == 'clerk')
    res.redirect('/clerk/stats')
  
    else if(req.user.role == 'records')
    res.redirect('/records/stats')
      else 
      res.redirect('/student/passRate')
  
    
  });
  
  



  //logout route
  router.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('/');
  });


     
// change password
router.get('/pass',isLoggedIn, (req, res) => {
 var pro = req.user
  User.findById(req.user._id, (err, doc) => {
      if (!err) {
          res.render("records/change", {
             
              user: doc,pro:pro
            
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
    res.render('records/change',{ title: 'User Update', user:req.body, errors:req.session.errors, pro:pro
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
      res.render('records/change',{message:req.session.message, user:req.user, pro:pro
       }); }
    else {
      console.log('error'+err)

    }
  
})
}



})



    
    
// change password
router.get('/pass2',isLoggedIn, (req, res) => {
 var pro = req.user
  User.findById(req.user._id, (err, doc) => {
      if (!err) {
          res.render("admin/change", {
             
              user: doc,pro:pro
            
          });
      }
  });
});



router.post('/pass2',isLoggedIn, function(req,res){
  var user = new User();
  var pro = req.user
  req.check('password','Enter New Password').notEmpty();

  req.check('confirmPassword', 'Confirm Password').notEmpty();


req.check('password', 'Password do not match').isLength({min: 4}).equals(req.body.confirmPassword);
var errors = req.validationErrors();




 if (errors) {

 

    req.session.errors = errors;
    req.session.success = false;
    res.render('admin/change',{ title: 'User Update', user:req.body, errors:req.session.errors, pro:pro 
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
      res.render('admin/change',{message:req.session.message, user:req.user, pro:pro
       }); }
    else {
      console.log('error'+err)

    }
  
})
}



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


  MonthIncome.find({year:year,month:month},function(err,docs){

    Fees.find({year:year,month:month},function(err,hods){


    

    if(docs.length == 0  && hods.length == 0){

      

      var inc = MonthIncome();
            inc.amount = 0;
            inc.month = month;
            inc.year = year

            inc.save()
    .then(incX =>{

      res.redirect('/adminMonthExp')

    })

    }
    else
    MonthIncome.find({year:year,month:month},function(err,docs){

      var id3 = docs[0]._id
    Fees.find({year:year,month:month},function(err,hods){

      for(var q = 0;q<hods.length; q++){
          
        arr1.push(hods[q].amount)
          }
          //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
           number1=0;
          for(var z in arr1) { number1 += arr1[z]; }



          MonthIncome.findByIdAndUpdate(id3,{$set:{amount:number1}},function(err,kocs){

          })
          
      



          res.redirect('/adminMonthExp')


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


  MonthExpense.find({year:year,month:month},function(err,docs){

    Expenses.find({year:year,month:month},function(err,hods){


    

    if(docs.length == 0  && hods.length == 0){

      

      var exp = MonthExpense();
            exp.amount = 0;
            exp.month = month;
            exp.year = year

            exp.save()
    .then(incX =>{

      res.redirect('/adminDashInc')

    })

    }
    else
    MonthExpense.find({year:year,month:month},function(err,docs){

      var id3 = docs[0]._id
    Expenses.find({year:year,month:month},function(err,hods){

      for(var q = 0;q<hods.length; q++){
          
        arr1.push(hods[q].amount)
          }
          //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
           number1=0;
          for(var z in arr1) { number1 += arr1[z]; }



          MonthExpense.findByIdAndUpdate(id3,{$set:{amount:number1}},function(err,kocs){

          })
          
      



          res.redirect('/adminDashInc')


    })
  })





  })


})



})





router.get('/adminDashInc',isLoggedIn,function(req,res){
  var term = req.user.term
  var m = moment()
  var year = m.format('YYYY')
  var fees
  var arr1=[]
  var number1
  var totalStudents, students, passRate


  Income.find({year:year},function(err,docs){

    Fees.find({term:term,year:year},function(err,hods){


    

    if(docs.length == 0  && hods.length == 0){

      

      var inc = Income();
            inc.firstTermIncome = 0;
            inc.firstTermExpense = 0;
            inc.secondTermIncome = 0;
            inc.secondTermExpense = 0
            inc.thirdTermIncome = 0
            inc.thirdTermExpense = 0
            inc.year = year

            inc.save()
    .then(incX =>{

      res.redirect('/adminDashExp')

    })

    }
    else
    Income.find({year:year},function(err,docs){

      var id3 = docs[0]._id
    Fees.find({term:term,year:year},function(err,hods){

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



          res.redirect('/adminDashExp')


    })
  })





  })


})



})




router.get('/adminDashExp',isLoggedIn,function(req,res){

  let arrX = []
  let totalX
  var term = req.user.term
  var m = moment()
  var year = m.format('YYYY')
  var fees
  var arr1=[]
  var number1

  Expenses.find({term:term,year:year},function(err,hods){

    if(hods.length == 0){

      res.redirect('/passRate')
    }
else
Income.find({year:year},function(err,docs){
   var incX = docs[0]._id
for(var q = 0;q<hods.length; q++){
          
  arrX.push(hods[q].amount)
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
  res.redirect('/passRate')
})
  })


})







//Exam Pass Rate

router.get('/passRate',isLoggedIn, function(req,res){
  var totalStudents, students, passRate
  var m = moment()
  var year = m.format('YYYY')
  var term = req.user.term


  Pass.find({year:year},function(err,docs){

    TestX.find({term:term,year:year,type:'Final Exam'},function(err,hods){

  
    if(docs.length == 0 && hods.length == 0){

      var pass = Pass();
      pass.firstTerm = 0;
      pass.secondTerm= 0;
      pass.thirdTerm = 0
      pass.year = year

      pass.save()
      .then(pas =>{

        res.redirect('/passRateX')
      })

    }
    else

    
  Pass.find({year:year},function(err,docs){
 var idX = docs[0]._id;
    TestX.find({term:term,year:year},function(err,hods){

      TestX.find({term:term,year:year, result:'pass', type:'Final Exam'},function(err,lods){

      totalStudents = hods.length;
      students = lods.length
      passRate = students / totalStudents * 100

      if(term == 1){
 
   
        Pass.findByIdAndUpdate(idX,{$set:{firstTerm:passRate}},function(err,kocs){
     
        
        })
      }else if(term == 2){
      
        Pass.findByIdAndUpdate(idX,{$set:{secondTerm:passRate}},function(err,kocs){
      
            
            })
          }else{
            Pass.findByIdAndUpdate(idX,{$set:{thirdTerm:passRate}},function(err,kocs){
            
                
                })
              }

res.redirect('/passRateX')
            })
    })

  })

  })
  })

})




//Class Test

router.get('/passRateX',isLoggedIn, function(req,res){
  var totalStudents, students, passRate;
  var m = moment()
  var year = m.format('YYYY')
  var term = req.user.term


  PassX.find({year:year},function(err,docs){

    TestX.find({term:term,year:year,type:'Class Test'},function(err,hods){

  
    if(docs.length == 0 && hods.length == 0){

      var pass = PassX();
      pass.firstTerm = 0;
      pass.secondTerm= 0;
      pass.thirdTerm = 0
      pass.year = year

      pass.save()
      .then(pas =>{

        res.redirect('/adminGender')
      })

    }
    else

    
  PassX.find({year:year},function(err,docs){
 var idX = docs[0]._id;
 console.log('class testX',idX)
    TestX.find({term:term,year:year},function(err,hods){

      TestX.find({term:term,year:year, result:'pass', type:'Class Test'},function(err,lods){

      totalStudents = hods.length;
      students = lods.length
      passRate = students / totalStudents * 100

      console.log('pass Rate68', passRate)

      if(term == 1){
 
   
        PassX.findByIdAndUpdate(idX,{$set:{firstTerm:passRate}},function(err,kocs){
     
        
        })
      }else if(term == 2){
      
        PassX.findByIdAndUpdate(idX,{$set:{secondTerm:passRate}},function(err,kocs){
      
            
            })
          }else{
            PassX.findByIdAndUpdate(idX,{$set:{thirdTerm:passRate}},function(err,kocs){
            
                
                })
              }

res.redirect('/adminGender')
            })
    })

  })

  })
  })

})













//student gender


router.get('/adminGender',isLoggedIn,function(req,res){
  var term = req.user.term
  var m = moment()
  var year = m.format('YYYY')
  var male, female
  var fees
  var arr1=[]
  var number1
  var totalStudents, students, passRate


  Gender.find({},function(err,docs){

    User.find({role:'student'},function(err,hods){


    

    if(docs.length == 0  && hods.length == 0){

      

      var gen = Gender();
            gen.male = 0;
            gen.female = 0;
           
            gen.save()
    .then(genX =>{

      res.redirect('/dash')

    })

    }
    else
    Gender.find({},function(err,docs){

      var id3 = docs[0]._id
      console.log('id3',id3)
      User.find({role:'student',gender:'male'},function(err,hods){

      User.find({role:'student', gender:'female'},function(err,pods){

       male = hods.length;
       female = pods.length
          
       console.log('male',male)
       console.log('female',female)
    
    

      Gender.findByIdAndUpdate(id3,{$set:{male:male, female:female}},function(err,docs){
            
                
      })

    

      res.redirect('/dash')

       


    })
    })
  })






  })


})



})


//dashboard

router.get('/dash',isLoggedIn, function(req,res){
 var pro = req.user
  res.render('dashboard/index',{pro:pro})
 
})


     





//passChart


router.post('/passChart',isLoggedIn,function(req,res){
  var m = moment()
  var year = m.format('YYYY')
  var term = req.user.term
        Pass.find({year:year, term:term},function(err,docs){
          if(docs == undefined){
            res.redirect('/dash')
          }else
      
             res.send(docs)
         
          
           })
      
      })

//passChartX
      router.post('/passChartX',isLoggedIn,function(req,res){
        var m = moment()
        var year = m.format('YYYY')
        var term = req.user.term
              PassX.find({year:year, term:term},function(err,docs){
                if(docs == undefined){
                  res.redirect('/dash')
                }else
            
                   res.send(docs)
               
                
                 })
            
            })

//genderChart
      router.post('/genChart',isLoggedIn,function(req,res){
       
              Gender.find({},function(err,docs){
                if(docs == undefined){
                  res.redirect('/dash')
                }else
            
                   res.send(docs)
               
                
                 })
            
            })
  
  




//stats


            router.post('/statChart',isLoggedIn,function(req,res){
              var m = moment()
              var year = m.format('YYYY')
            
                    Stats.find({year:year},function(err,docs){
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
          
                    Income.find({year:year},function(err,docs){
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
          
                    MonthIncome.find({year:year},function(err,docs){
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
        
                  MonthExpense.find({year:year},function(err,docs){
                    if(docs == undefined){
                      res.redirect('/dash')
                    }else
                
                       res.send(docs)
                   
                    
                     })
                
                })







 
//adding staff
router.get('/addStaff',isLoggedIn,adminX,  function(req,res){
    
 var pro = req.user
  res.render('admin/staff',{pro:pro})
  
})



router.post('/addStaff',isLoggedIn,adminX,function(req, res, next) {
var pro = req.user
  var uid = req.body.uid;
  var name = req.body.name;
  var surname = req.body.surname;
  var mobile = req.body.mobile;
  var gender = req.body.gender;
  var dob = req.body.dob;
  var role = req.body.role;
  var password = req.body.password;
  var term = req.user.term
  var year = req.user.year
  var email = req.body.email

 
  req.check('name','Enter Name').notEmpty();
  req.check('surname','Enter Surname').notEmpty();
  req.check('email','Enter email').notEmpty().isEmail();
  req.check('dob','Enter Date Of Birth').notEmpty();
  req.check('uid','Enter Student ID').notEmpty();
  req.check('gender','Enter Gender').notEmpty();
  req.check('role', 'Enter Role').notEmpty();
  req.check('mobile', 'Enter Phone Number').notEmpty();
  req.check('password', 'Password do not match').isLength({min: 4}).equals(req.body.confirmPassword);
      
    
 
     
  var errors = req.validationErrors();
      if (errors) {

        req.session.errors = errors;
        req.session.success = false;
        res.render('admin/staff',{user:req.body, errors:req.session.errors,pro:pro
    
  })
      
    }
    else
  
   {
      User.findOne({'uid':uid})
      .then(user =>{
          if(user){ 
        // req.session.errors = errors
          //req.success.user = false;
         
         req.session.message = {
           type:'errors',
           message:'user already in the system'
         }     
         
            res.render('admin/staff', {
                user:req.body, message:req.session.message,pro:pro 
            }) 
        
    }
    
                  else  {   
                 

                    var user = new User();
                    user.uid = uid;
                    user.name = name;
                    user.fullname = name + " " + surname;
                    user.surname = surname;
                    user.role = role;
                    user.email = email
                    user.role1 = 'staff';
                    user.gender = gender;
                    user.dob = dob;
                    user.studentId = 'null'
                    user.teacherName='null'
                    user.teacherId = 'null'
                    user.grade = 0;
                    user.class1 = 'null';
                    user.mobile = mobile;
                    user.classLength = 0;
                    user.classNo = 0
                    user.studentNum = 0;
                    user.uidNum = 309;
                    user.examDate = 'null';
                    user.feeStatus = 'null';
                    user.feesUpdate = 'null';
                    user.term = term;
                    user.amount = 0;
                    user.receiptNumber = 0;
                    user.year = year;
                    user.balance = 0;
                    user.balanceCarriedOver = 0;
                    user.status = 'null';
                    user.paymentId = 'null';
                    user.prefix = 'null';
                    user.photo = 'propic.jpg';
                    user.level = 'null';
                    user.pollUrl='null'
                    user.annual =0
                    user.fees = 0
                    user.type = 'null';
                    user.address = 'null';
                    user.dept = 'null';
                    user.subject = 0;
                    user.subjectCode = 'null'
                    user.subjects = 'null'
                    user.dept = 'null';
                    user.password = user.encryptPassword(password)
                    user.save()
                      .then(user =>{
                       
                      
                          
                        req.session.message = {
                          type:'success',
                          message:'Account Registered'
                        }  
                       
                        res.render('admin/staff',{message:req.session.message,pro:pro});
                      
                    })
                      .catch(err => console.log(err))
                    }
                    
                      })
                     }
              });





//staff List

router.get('/staffList',isLoggedIn,adminX,(req, res) => {
var pro = req.user
User.find({role1:"staff"},(err, docs) => {
    if (!err) {
        res.render("admin/slist", {
            list: docs, pro:pro
            
        });
    }
    else {
        console.log('Error in retrieving Student list :' + err);
    }
});
});




//student List


router.get('/studentList',isLoggedIn,adminX,(req, res) => {
var pro = req.user
User.find({role:"student"},(err, docs) => {
    if (!err) {
        res.render("admin/stdlist", {
            list: docs,pro:pro 
            
        });
    }
    else {
        console.log('Error in retrieving Student list :' + err);
    }
});
});



//role student

router.get('/profile',isLoggedIn,function(req,res){
 
var pro = req.user
res.render('admin/overview',{pro:pro})


})

router.post('/profile',isLoggedIn,upload.single('file'),function(req,res){



if(!req.file){
 req.session.message = {
   type:'errors',
   message:'Select Picture'
 }     
   res.render('admin/overview', {
        user:req.body, message:req.session.message,pic:req.user.photo,user:req.user 
    }) 
 
} else
var imageFile = req.file.filename;
var id  = req.user._id;
console.log(imageFile)
console.log(id)
User.findByIdAndUpdate(id,{$set:{photo:imageFile}},function(err,data){ 


  


})

res.redirect('/profile')

   //res.render('uploads/index',{title:'Upload File',records:data, success:success})


 



})


//teacherList

router.get('/teacherList',isLoggedIn,adminX,(req, res) => {
var pro = req.user
User.find({role:"teacher"},(err, docs) => {
    if (!err) {
        res.render("admin/tList", {
            list: docs, pro:pro
            
        });
    }
    else {
        console.log('Error in retrieving Teachers list :' + err);
    }
});
});


//teacher results exams
router.get('/tstats',isLoggedIn,function(req,res){
 var pro = req.user                      
var m = moment()
var year = m.format('YYYY')
var uid = req.user.uid
var term = req.user.term
TeacherExamRate.find({year:year,  type:"Final Exam"},function(err,docs){
  if (!err) {
      res.render('admin/statX', {
         list:docs,pro:pro
        
      });
  }
});



})  


//teacher results class test
router.get('/cstats',isLoggedIn,function(req,res){
 var pro = req.user                      
var m = moment()
var year = m.format('YYYY')
var uid = req.user.uid
var term = req.user.term
TeacherExamRate.find({year:year,   type:"Class Test"},function(err,docs){
  if (!err) {
      res.render('admin/statc', {
         list:docs, pro:pro
        
      });
  }
});



})  


//student results
router.get('/results',isLoggedIn, (req, res) => {
  var pro = req.user
  var uid= req.user.uid
  TestX.find({ type:'Class Test'},(err, docs) => {
  if (!err) {
     res.render("admin/result", {
        list:docs, pro:pro
       
     });
  }
  });
  });
  
  
  //student results - final exam
  router.get('/examResults',isLoggedIn, (req, res) => {
    var pro = req.user
  var uid= req.user.uid
  TestX.find({ type:'Final Exam'},(err, docs) => {
  if (!err) {
     res.render("admin/resultX", {
        list:docs, pro:pro
       
     });
  }
  });
  });
  






//role admin
//add admin
router.get('/addAdmin',   function(req,res){

res.render('admin/admit-form');



})

router.post('/addAdmin',   function(req,res){
var uid = req.body.uid;
var name = req.body.name;
var surname = req.body.surname;
var mobile = req.body.mobile;
var gender = req.body.gender;
var dob = req.body.dob;
var class1 = 'null';
var fullname = name +" "+ surname 
var grade = 'null'
var password = req.body.password;
var term = 1;
var year = 2022;
var admin = 'admin'





req.check('name','Enter Name').notEmpty();
req.check('surname','Enter Surname').notEmpty();
req.check('dob','Enter Date Of Birth').notEmpty();

req.check('uid','Enter Admin ID').notEmpty();

req.check('gender','Enter Gender').notEmpty();
req.check('mobile', 'Enter Phone Number').notEmpty();
req.check('password', 'Password do not match').isLength({min: 4}).equals(req.body.confirmPassword);
  

    
 
var errors = req.validationErrors();
  if (errors) {
  
    req.session.errors = errors;
    req.session.success = false;
    res.render('admin/admit-form',{user:req.body, errors:req.session.errors,

})
  
}

{
  User.findOne({'uid':uid, 'role':admin})
  .then(user =>{
      if(user){ 
    // req.session.errors = errors
      //req.success.user = false;
      
     req.session.message = {
       type:'errors',
       message:'admin already in the system'
     }     
     
        res.render('admin/admit-form', {
            user:req.body, message:req.session.message 
        }) 
      
}

              else  {   
           

                var user = new User();
                user.uid = uid;
                user.name = name;
                user.fullname = name + " " + surname;
                user.surname = surname;
                user.role = 'admin';
                user.dob = dob;
                user.gender = gender;
                user.grade = 0;
                user.class1 = class1;
                user.classLength = 0
                user.mobile = mobile;
                user.role = 'admin';
                user.classLength = 0;
                user.studentNum = 0;
                user.uidNum = 22000;
                user.examDate = 'null';
                user.feeStatus = 'null';
                user.feesUpdate = 'null';
                user.term = term;
                user.year = year;
                user.balance = 0;
                user.balanceCarriedOver = 0;
                user.amount = 0;
                user.receiptNumber = 0;
                user.status = 'null';
                user.paymentId = 'null';
                user.studentId = 'null';
                user.prefix = 'null';
                user.photo = 'propic.jpg';
                user.level = 'null';
                user.annual = 0
                user.pollUrl = 'null'
                user.fees = 0
                user.type = 'null';
                user.address = 'null';
                user.dept = 'null';
                user.subject = 0;
                user.subjectCode = 'null'
                user.subjects = 'null';
                user.teacherId = 'null';
                user.teacherName = 'null';
                user.classNo = 0
                user.password = user.encryptPassword(password)

                
                 
            
                 
        
                user.save()
                  .then(user =>{
                   
                  
                    res.redirect('/addAdmin')
               
                })
                  .catch(err => console.log(err))
                }
                
                  })
                 }
})




router.get('/rem',function(req,res){
  User.find({role:'student'},function(err,docs){
    for(var i = 0; i<docs.length;i++){
      User.findByIdAndRemove(docs[i]._id,function(err,locs){

      })
    }
  })
})


router.get('/remX',function(req,res){
  User.find({role:'teacher'},function(err,docs){
    for(var i = 0; i<docs.length;i++){
      User.findByIdAndRemove(docs[i]._id,function(err,locs){

      })
    }
  })
})




router.get('/deptList',isLoggedIn, (req, res) => {
var pro = req.user
Dept.find({},(err, docs) => {
    if (!err) {
        res.render("admin/deptlist", {
           list:docs, pro:pro
          
        });
    }
});
});

router.get('/cList',isLoggedIn, (req, res) => {
var pro = req.user
Class1.find({},(err, docs) => {
    if (!err) {
        res.render("admin/clist", {
           list:docs, pro:pro
          
        });
    }
});
});







//student registering subjects
router.get('/studentSub',isLoggedIn,adminX,function(req,res){
var pro = req.user
User.find({role:'student'},function(err,docs){



for(var i = 0; i<docs.length; i++){
let studentName = docs[i].fullname;
let studentId = docs[i].uid;
let studentClass = docs[i].class1;
let grade = docs[i].grade;

Subject.find({grade:grade},function(err,nocs){
for(var x = 0; x < nocs.length; x++){
let subjectName = nocs[x].name;
let subjectCode = nocs[x].code
let dept = nocs[x].dept
 
 
StudentSub.findOne({'studentName':studentName, 'subjectCode':subjectCode})
.then(clax =>{
    if(clax){ 
 
res.redirect('/dash')
    }
    else

var student = new StudentSub();
student.studentName = studentName;
student.studentId = studentId;
student.studentClass = studentClass;
student.subjectCode = subjectCode;
student.subjectName = subjectName;
student.dept = dept;
student.save()


})
}


})

}
res.redirect('/subTotal')
})


})




//update student subject number
router.get('/subTotal',isLoggedIn,function(req,res){
User.find({role:'student'},function(err,docs){

for(var i = 0; i<docs.length; i++){
  let id = docs[i]._id;
  let studentId = docs[i].uid;

StudentSub.find({studentId:studentId},function(err,nocs){
let total = nocs.length;

User.findByIdAndUpdate(id,{$set:{subject:total}},function(err,tocs){

})




})


}
res.redirect('/adminDash')


})
})








router.get('/teacherSubject',isLoggedIn, function(req,res){
  var pro = req.user
Class1.find({},function(err,docs){
  Subject.find({},function(err,locs){
  var arr1 = docs;
  var arr = locs
res.render('teachers/subjects',{arr1:arr1, arr:arr, pro:pro})
  })
})
})



router.post('/teacherSubject', isLoggedIn, function(req,res){
var teacherId, subjectCode, grade, dept, id;
var teacherName = req.body.teacherName;
teacherId = req.body.uid;
var class1 = req.body.class1;
var subjectName = req.body.subjectName;
var arr, arr1
console.log(teacherName)
var pro = req.user


req.check('teacherName','Enter Name Of Teacher').notEmpty();
req.check('class1','Enter Class').notEmpty();
req.check('subjectName','Enter Name of Subject').notEmpty();



var errors = req.validationErrors();



if (errors) {


  Class1.find({},function(err,docs){
  Subject.find({},function(err,locs){
  arr1 = docs;
  arr = locs
    req.session.errors = errors;
    req.session.success = false;
    res.render('teachers/subjects',{ errors:req.session.errors,arr:arr,arr1:arr1,pro:pro})
  })
})

}
else
TeacherSub.findOne({'teacherName':teacherName, 'class1':class1, 'subjectName':subjectName})
.then(clax =>{
  if(clax){ 
 
    
    Class1.find({},function(err,docs){
      Subject.find({},function(err,locs){
      arr1 = docs;
      arr = locs
    
      req.session.message = {
        type:'errors',
        message:'subject already allocated'
      }   
    res.render('teachers/subjects',{message:req.session.message, arr:arr, arr1:arr1,pro:pro});
      })
    })
    
  }
  else

var teacher = new TeacherSub();
teacher.teacherName = teacherName;
teacher.teacherId = teacherId;
teacher.subjectCode = 'null';
teacher.subjectName = subjectName;
teacher.grade = 0;
teacher.class1 = class1;
teacher.dept ='null';
teacher.save()
.then(teach =>{
                   
id = teach._id;

Subject.find({name:subjectName, class1:class1},function(err,docs){
subjectCode=docs[0].code;
grade = docs[0].grade;
dept = docs[0].dept;
console.log(subjectCode)
TeacherSub.findByIdAndUpdate(id,{$set:{subjectCode:subjectCode, grade:grade, dept:dept}},function(err,nocs){





})

Class1.find({},function(err,docs){
Subject.find({},function(err,locs){
arr1 = docs;
arr = locs

req.session.message = {
type:'success',
message:'Subject allocated'
}  
res.render('teachers/subjects',{message:req.session.message, arr:arr, arr1:arr1,pro:pro});
})
})


})


})





})

})









//autocomplete teacherName & uid

router.get('/autocompleteTS/',isLoggedIn, function(req, res, next) {


var regex= new RegExp(req.query["term"],'i');

var uidFilter =User.find({fullname:regex, role:"teacher"},{'fullname':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);


uidFilter.exec(function(err,data){


console.log('data',data)

var result=[];

if(!err){
 if(data && data.length && data.length>0){
   data.forEach(user=>{

    
 

      
     let obj={
       id:user._id,
       label: user.fullname,

   
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
router.post('/autoTS',isLoggedIn,function(req,res){
var fullname = req.body.code


User.find({fullname:fullname},function(err,docs){
if(docs == undefined){
 res.redirect('/autoTS')
}else

  res.send(docs[0])
})


})








//autocomplete teacherName & uid

router.get('/autocompleteSub/',isLoggedIn, function(req, res, next) {


var regex= new RegExp(req.query["term"],'i');

var uidFilter =Subject.find({name:regex},{'name':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);


uidFilter.exec(function(err,data){


console.log('data',data)

var result=[];

if(!err){
 if(data && data.length && data.length>0){
   data.forEach(sub=>{

    
 

      
     let obj={
       id:sub._id,
       label: sub.name,

   
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
router.post('/autoSub',isLoggedIn,function(req,res){
var name = req.body.code


  Subject.find({name:name},function(err,docs){
if(docs == undefined){
 res.redirect('/autoSub')
}else

  res.send(docs[0])
})


})




















//update teacher subjectNumber
//update student subject number
router.get('/subTotalX',isLoggedIn,function(req,res){
User.find({role:'teacher'},function(err,docs){

  for(var i = 0; i<docs.length; i++){
    let id = docs[i]._id;
    let teacherId = docs[i].uid;

TeacherSub.find({teacherId:teacherId},function(err,nocs){
 let total = nocs.length;

 User.findByIdAndUpdate(id,{$set:{subject:total}},function(err,tocs){

 })
 



})


  }
  res.redirect('/adminDash')


})
})





















  
//role admin
//new term fees update
router.get('/termInfo',isLoggedIn,adminX, function(req,res){
  var m = moment()
  var pro = req.user
  var year = m.format('YYYY')
  var term = req.user.term
  

FeesUpdate.find({term:term, year:year},(err, docs) => {
    if (!err) {
        res.render("admin/newTerm", {
           list:docs, pro:pro
          
        });
    }
});
  
    })
    
    router.post('/feesUpdate',isLoggedIn,adminX,  function(req,res){
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var balanceX, status, term, year, balanceCarriedOver, balance
    var id = req.user._id
    var m = moment()
    var date = moment().toString()
    term = req.body.term
    year = m.format('YYYY')
    var feeX = req.body.fees
    
   
    
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
   req.check('term','Enter Term').notEmpty();
  
   var errors = req.validationErrors();
   if (errors) {
  
     req.session.errors = errors;
     req.session.success = false;
     res.render('admin/feesUpdate',{errors:req.session.errors})
  
   
  }
  
    var fees = new FeesUpdate();
      
    fees.date = date;
    fees.startDate = startDate;
    fees.endDate = endDate;
    fees.fees= req.body.fees;
    fees.term = term;
    fees.year = year
  
    fees.person = req.user.fullname
  
  
    fees.save()
      .then(fee =>{
     var adminBal = 0 - fee.fees
        User.findByIdAndUpdate(id,{$set:{feesUpdate:fee._id,term:term,balance:adminBal}},function(err,docs){
  
  
        })
  
  
    User.find({role:"student"},function(err,nocs){
    
    for(var i  = 0; i< nocs.length; i++){
    balanceX = nocs[i].balance 
    balance = balanceX - feeX
    balanceCarriedOver = nocs[i].balance
  
    console.log('balance',balance)
    console.log('balanceX', balanceX)
    console.log('fees',feeX)
  
    if(balance > 0){
      
      User.findByIdAndUpdate(nocs[i]._id,{$set:{balance:balance, status:"paid", term:term, year:year,balanceCarriedOver:balanceCarriedOver,feesUpdate:fee._id,}},function(err,docs){
    
    
      
    
      })
  
    }else
    
    User.findByIdAndUpdate(nocs[i]._id,{$set:{balance:balance, status:"owing", term:term, year:year,balanceCarriedOver:balanceCarriedOver,feesUpdate:fee._id,}},function(err,docs){
    
    
      
    
    })
    
    }
    res.redirect('/feesUpdate')
    })
  })
    
    })
  




//student lesson timetable
router.get('/timetable',isLoggedIn, (req, res) => {
  var term = req.user.term
  var arr= []
  var pro = req.user
  Lesson.find({term:term},(err, docs) => {
    for(var i = 0; i<docs.length; i++){
      arr.push(docs[i].start)
    }
      if (!err) {
          res.render("admin/timetableAdmin", {
             list:docs,arr:arr,pro:pro
            
          });
      }
  });
});










//role - all
//exam timetable
router.get('/examList',isLoggedIn, (req, res) => {
var pro = req.user
Exam.find({},(err, docs) => {
    if (!err) {
        res.render("adminExam/examList", {
           list:docs,pro:pro
          
        });
    }
});
});










//role - admin
//grade List
router.get('/gradeList',isLoggedIn,adminX, (req, res) => {
var pro = req.user
  Grade.find({},(err, docs) => {
      if (!err) {
          res.render("adminExam/glist", {
             list:docs, pro:pro
            
          });
      }
  });
});







    router.get('/feesRecords',isLoggedIn, (req, res) => {
var pro = req.user
      Fees.find({},(err, docs) => {
          if (!err) {
              res.render("accounts/listX", {
                 list:docs, pro:pro
                
              });
          }
      });
    });
    























router.get('/expenseList',isLoggedIn, (req, res) => {
var pro = req.user
Expenses.find({},(err, docs) => {
    if (!err) {
        res.render("accounts/listE", {
           list:docs, pro:pro
          
        });
    }
});
});


//list of users
router.get('/listX',isLoggedIn,adminX, (req, res) => {
var pro = req.user
User.find({},(err, docs) => {
    if (!err) {
        res.render("admin/users", {
           list:docs,
            user: docs,pro:pro
        });
    }
});
});






//role admin
//updating user
router.get('/:id',isLoggedIn,adminX, (req, res) => {
var pro = req.user  
User.findById(req.params.id, (err, doc) => {
    if (!err) {
    
        res.render("users/update", {
           
            user: doc, pro:pro
          
            
        });
      
    }
});
});

router.post('/:id',isLoggedIn,adminX, upload.single('myFile'),  (req, res) => {
var user = new User();
var id = req.body._id;
var name = req.body.name;
var surname = req.body.surname;
req.body.fullname = name +" "+ surname
var gender = req.body.gender;
var dob = req.body.dob
var pro = req.user

req.check('name','Enter Name').notEmpty();
req.check('surname','Enter Surname').notEmpty();

req.check('dob', 'Enter Date Of Birth').notEmpty();

if(req.body.password === req.body.confirmPassword && !req.validationErrors()){
  user.password=req.body.password=encryptPassword(req.body.password)
 }
  
var errors = req.validationErrors();



 if (errors) {

   
      req.session.errors = errors;
      req.session.success = false;
      res.render('users/list',{ errors:req.session.errors,pro:pro})
   
  
  }

else
{

      User.findOneAndUpdate({_id:id},req.body,
        { new: true }, (err, doc) => {
           if (!err) {
           
              res.redirect('/listX'); }
           else {
             console.log('error'+err)
     
           }
         
       })


  
}

});











function encryptPassword(password) {
return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);  
};
             




module.exports = router;



function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  else{
      res.redirect('/')
  }
}




function adminX(req,res,next){
  if(req.user.role == "admin"){
    return next()
  }
  res.render('errors/access')
  }  














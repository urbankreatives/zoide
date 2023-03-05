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
      res.redirect("/idUp");
    }else if(req.user.role == 'teacher')
    res.redirect('/teacher/passRate')
    else if(req.user.role == 'clerk')
    res.redirect('/clerk/pollCheck')
  
    else if(req.user.role == 'records')
    res.redirect('/records/stats')
      else 
      res.redirect('/student/passRate')
  
    
  });
  
  


  



  router.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});

 

  
//adding departments

router.get('/addNum', function(req,res){
  
  res.render('admin/numX')
})

router.post('/addNum',  function(req,res){

  var accountNumber = req.body.accountNumber;
  var idNumber = req.body.idNumber;
  
 
      req.check('accountNumber','Enter Account Number').notEmpty().isNumeric();
      req.check('idNumber','Enter ID Number').notEmpty().isNumeric();

    
      
      var errors = req.validationErrors();
           
      if (errors) {
      
        req.session.errors = errors;
        req.session.success = false;
        res.render('admin/numX',{ errors:req.session.errors,})
      
    }
    else{
      
        Num.findOne({'idNumber':idNumber})
        .then(dept =>{
            if(dept){ 
  
           req.session.message = {
            type:'errors',
             message:'Number already exists'
           }     
              res.render('admin/numX', {
                 message:req.session.message ,
              })
            }else
    
      var num = new Num();
    
      num.accountNumber = accountNumber;
      num.idNumber = idNumber;
     
   
    
    
      num.save()
        .then(dep =>{
         
          req.session.message = {
            type:'success',
            message:'Number added'
          }  
          res.render('admin/numX',{message:req.session.message,});
      
    
      })
    
        .catch(err => console.log(err))
      
      
      })
    }
    
    
})








//multi steps
router.get('/multi',function(req,res){
 

res.render('users/steps')

})


router.post('/multi', function(req,res){
  var accountType = req.body.account_type;
  var size = req.body.account_team_size;
  var accountName = req.body.account_name;
  var schoolName = req.body.school_name;
  var schoolType = req.body.school_type;
  var businessEmail = req.body.business_email
  var prefix = req.body.prefix;
  var suffix = req.body.suffix;
  var adminName = req.body.admin_name;
  var adminSurname = req.body.admin_surname;
  var fullname = adminName +" "+ adminSurname
  var role = 'admin'
  var email = req.body.business_email
  var accountNumber,idNumber ;

  var id //= req.body._id

  var password = req.body.password
var uid
  
  
  Num.find(function(err,docs){
accountNumber = docs[0].accountNumber
idNumber=docs[0].idNumber
id = docs[0]._id
 uid = prefix + idNumber 
  })
  

 

  
  
    Setup.findOne({'schoolName':schoolName})
    .then(user =>{
        if(user){ 
      // req.session.errors = errors
        //req.success.user = false;
        
       req.session.message = {
         type:'errors',
         message:'school already in the system'
       }     
       
          res.render('users/steps', {
              user:req.body, message:req.session.message 
          }) 
        
  }
  
                else  {   
             
  
                   var companyId = accountNumber
                      const token = jwt.sign({adminName,adminSurname,email,schoolName, fullname,prefix,suffix,uid,companyId,role,id, password,accountNumber,idNumber }, JWT_KEY, { expiresIn: '100000m' });
                      const CLIENT_URL = 'http://' + req.headers.host;
                
                      const output = `
                      <h2>Please click on below link to activate your account</h2>
                      <a href="${CLIENT_URL}/activate/${token}">click here</a>
                      <h1> User credentials</h1>
                      <p>userId:${uid}</p>
                      <p>password:${password}</p>
                      <p><b>NOTE: </b> The above activation link expires in 1 week.</p>
                      `;
                
                      const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: "cashreq00@gmail.com",
                            pass: "itzgkkqtmchvciik",
                        },
                        port:465,
                        host:'smtp.gmail.com'
                      });
                      
                
                      // send mail with defined transport object
                      const mailOptions = {
                          from: '"Admin" <cashreq00@gmail.com>', // sender address
                          to: email, // list of receivers
                          subject: "Account Verification ✔", // Subject line
                          html: output, // html body
                      };
                
                      transporter.sendMail(mailOptions, (error, info) => {
                          if (error) {
                            console.log(error)
                       req.session.message = {
                         type:'errors',
                         message:'confirmation email not sent'
                       }
                       
                       res.render('users/steps',{message:req.session.message,
                       
                    })
                    
                          }
                          else {
                              console.log('Mail sent : %s', info.response);

                              
                  var set = new Setup();
                  set.accountType = accountType;
                  set.size = size;
                  set.accountName = accountName;
                  set.accountNumber = accountNumber;
                  set.schoolName = schoolName;
                  set.schoolType = schoolType;
                  set.business_email = businessEmail;
                  set.prefix = prefix;
                  set.suffix = suffix;
                  set.name = adminName;
             
                  set.surname = adminSurname;
                  set.password = set.encryptPassword(password)

                
  
                  
                   
              
                   
          
                  set.save()
                    .then(user =>{
                              accountNumber++
                             
                              Num.findByIdAndUpdate(id,{$set:{accountNumber:accountNumber}},function(err,locs){
                              req.session.message = {
                                type:'success',
                                message:'confirmation email sent'
                              }     
                              
                                 res.render('users/steps', {
                                      message:req.session.message 
                                  
                                 })
                                }) 
                              })
                          }
                      })
                     // res.redirect('/multi')
                 
                                
                  }
                  
                    })
                   
  })
  
  
  

//admin account activation route

router.get('/activate/:token',(req,res)=>{
  const token = req.params.token;
  var a = moment();
  var year = a.format('YYYY')
  let errors = [];
  if (token) {
      jwt.verify(token, JWT_KEY, (err, decodedToken) => {
          if (err) {
              
              req.session.message = {
                  type:'errors',
                  message:'Incorrect or expired link! Please register again'
                } 
                res.render('users/login',{message:req.session.message});
          }
          else {
            const { adminName,adminSurname,fullname,prefix,email,accountNumber, suffix,companyId,role,uid, password,schoolName,idNumber } = decodedToken;
              User.findOne({ uid: uid }).then(user => {
                  if (user) {
                      //------------ User already exists ------------//
                  
                      req.session.message = {
                          type:'errors',
                          message:'User  already registered! Please log in.'
                        }  
                        res.render('users/login',{message:req.session.message});
               
                      
                  }
                  else  {      

                    var user = new User();
                    user.uid = uid;
                    user.name = adminName;
                    user.surname = adminSurname;
                    user.fullname = fullname;
                    user.email = email;
                    user.role = role;
                    user.prefix = prefix;
                    user.suffix = suffix;
                    user.companyId = companyId;
                    user.schoolName = schoolName;
                    user.recNumber = 0
                    user.gender = 'null';
                    user.dob = 'null';
                    user.studentId = 'null'
                    user.teacherName='null'
                    user.teacherId = 'null'
                    user.grade = 0;
                    user.class1 = 'null';
                    user.mobile = 'null';
                    user.classLength = 0;
                    user.classNo = 0
                    user.studentNum = 0;
                    user.uidNum = 309;
                    user.number = accountNumber;
                    user.idNumber = idNumber;
                    user.idNumX = idNumber;
                    user.examDate = 'null';
                    user.feeStatus = 'null';
                    user.feesUpdate = 'null';
                    user.term = 1;
                    user.amount = 0;
                    user.receiptNumber = 0;
                    user.year = year;
                    user.balance = 0;
                    user.possibleMark = 0;
                    user.topic = 'null';
                    user.balanceCarriedOver = 0;
                    user.status = 'null';
                    user.paymentId = 'null';
                    user.possibleMark = 0;
                    user.topic = 'null';
                    user.photo = 'propic.jpg';
                    user.level = 'null';
                    user.pollUrl='null'
                    user.annual =0
                    user.fees = 0
                    user.paynow = 0
                    user.type = 'null';
                    user.address = 'null';
                    user.dept = 'null';
                    user.subject = 0;
                    user.subjectCode = 'null'
                    user.subjects = 'null'
                    user.dept = 'null';
                    user.expdate=a.valueOf();
                    user.expStr = a.toString();
                    user.duration = 0;
               
                    user.status3 = "null"
                    user.status4 = "null"
                    user.levelX = "null"
                    user.pollUrl2 = "null"
                    user.count=0
                    user.pollCount = 0
                    user.actualCount = 0   
                    user.startYear = year
                    user.currentYearCount = 0
                    user.stdYearCount = 0
                    user.admissionYear = 0  
                    user.password = user.encryptPassword(password)
                    user.save()
                      .then(user =>{
                
                          
                          
                        req.session.message = {
                          type:'success',
                          message:'Account Registered'
                        }  
                        res.render('users/login',{message:req.session.message});
                    


                  })
                      .catch(err => console.log(err))
                    }
                    
                      })
                     }
              });
            }
  });







  
router.get('/forgot', function (req, res, next) {
  var messages = req.flash('error');
  res.render('users/forgot', { messages: messages, hasErrors: messages.length > 0});
});

router.post('/forgot',function(req,res){
  const { email } = req.body;

  let errors = [];

  //------------ Checking required fields ------------//
  if (!email) {
      errors.push({ msg: 'Please enter an email ID' });
  }

  if (errors.length > 0) {
      res.render('users/forgot', {
          errors,
          email
      });
  } else {
      User.findOne({ email: email }).then(user => {
          if (!user) {
              //------------ User already exists ------------//
              errors.push({ msg: 'User with Email ID does not exist!' });
              res.render('users/forgot', {
                  errors,
                  email
              });
          } else {

              const oauth2Client = new OAuth2(
                  "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com", // ClientID
                  "OKXIYR14wBB_zumf30EC__iJ", // Client Secret
                  "https://developers.google.com/oauthplayground" // Redirect URL
              );

              oauth2Client.setCredentials({
                  refresh_token: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w"
              });
              const accessToken = oauth2Client.getAccessToken()

              const token = jwt.sign({ _id: user._id }, JWT_RESET_KEY, { expiresIn: '30m' });
              const CLIENT_URL = 'http://' + req.headers.host;
              const output = `
              <h2>Please click on below link to reset your account password</h2>
              
              <a href="${CLIENT_URL}/forgot/${token}">click here</a>
              <p><b>NOTE: </b> The activation link expires in 30 minutes.</p>
              `;

              User.updateOne({ resetLink: token }, (err, success) => {
                  if (err) {
                      errors.push({ msg: 'Error resetting password!' });
                      res.render('users/forgot', {
                          errors,
                          email
                      });
                  }
                  else {
                      const transporter = nodemailer.createTransport({
                         
                          service: 'gmail',
                          auth: {
                              user: "cashreq00@gmail.com",
                              pass: "itzgkkqtmchvciik",
                          },
                      });

                      // send mail with defined transport object
                      const mailOptions = {
                          from: '"Auth Admin" <cashreq00@gmail.com>', // sender address
                          to: email, // list of receivers
                          subject: "Account Password Reset: NodeJS Auth ✔", // Subject line
                          html: output, // html body
                      };

                      transporter.sendMail(mailOptions, (error, info) => {
                          if (error) {
                              console.log(error);
                              req.flash(
                                  'error_msg',
                                  'Something went wrong on our end. Please try again later.'
                              );
                              res.redirect('/forgot');
                          }
                          else {
                              console.log('Mail sent : %s', info.response);
                              req.flash(
                                  'success_msg',
                                  'Password reset link sent to email ID. Please follow the instructions.'
                              );
                              res.redirect('/');
                          }
                      })
                  }
              })

          }
      });
  }
})



//------------ Reset Password Route ------------//
router.get('/reset/:id', (req, res) => {
  // console.log(id)
  res.render('users/reset', { id: req.params.id })
});

router.post('/reset/:id',(req,res)=>{
  var { password, confirmPassword } = req.body;
    const id = req.body.id
    console.log('id',id)
    let errors = [];

    //------------ Checking required fields ------------//
    if (!password || !confirmPassword) {
        req.flash(
            'error_msg',
            'Please enter all fields.'
        );
        res.redirect(`/reset/${id}`);
    }

    //------------ Checking password length ------------//
    else if (password.length < 8) {
        req.flash(
            'error_msg',
            'Password must be at least 8 characters.'
        );
        res.redirect(`/reset/${id}`);
    }

    //------------ Checking password mismatch ------------//
    else if (password != confirmPassword) {
        req.flash(
            'error_msg',
            'Passwords do not match.'
        );
        res.redirect(`/reset/${id}`);
    }

    else {
       var user = User();
       password=req.body.password=encryptPassword(req.body.password)

console.log(password)
       User.findByIdAndUpdate(id,{$set:{password:password}},function(err,toc){

       })

       res.redirect('/');
             
            
    }
});


router.get('/forgot/:token', (req,res)=>{
  const { token } = req.params;

  if (token) {
      jwt.verify(token, JWT_RESET_KEY, (err, decodedToken) => {
          if (err) {
              req.flash(
                  'error_msg',
                  'Incorrect or expired link! Please try again.'
              );
              res.redirect('/');
          }
          else {
              const { _id } = decodedToken;
              User.findById(_id, (err, user) => {
                  if (err) {
                      req.flash(
                          'error_msg',
                          'User with email ID does not exist! Please try again.'
                      );
                      res.redirect('/');
                  }
                  else {
                      res.redirect(`/reset/${_id}`)
                  }
              })
          }
      })
  }
  else {
      console.log("Password reset error!")
  }

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


router.get('/idUp',isLoggedIn,function(req,res){
  var id = req.user._id
  var companyId = req.user.companyId
  var total, total2
  var num
  var idNumX = req.user.idNumX
  
  
  User.find({companyId:companyId},function(err,docs){
  num = docs.length
  total = idNumX + docs.length;
  
  
  
  User.findByIdAndUpdate(id,{$set:{actualCount:num }},function(err,locs){
  
  })
  
  res.redirect('/pollCheck')
  
  })
  
  
  })



router.get('/pollCheck',isLoggedIn,function(req,res){
  const { Paynow } = require("paynow");
  // Create instance of Paynow class
  let paynow = new Paynow(14808, "e351cf17-54bc-4549-81f2-b66feed63768");
  var m = moment()
  var a = moment()
  var curr = a.valueOf()
  var sett = new Date()
  var expdate = req.user.expdate
  var currdate = sett.getTime()
  var set =moment(); 
  var stt = req.user.expStr;
  
  var set2 = moment(stt)
  console.log(set2,'what')
  var year = m.format('YYYY')
  var month = m.format('MMMM')
  var companyId = req.user.companyId
 var id = req.user._id
var pollUrl = req.user.pollUrl2
var duration = req.user.duration
var count = req.user.actualCount
var pollCount = req.user.pollCount
console.log(pollCount,'PollCount')
console.log(count,'Count')


if(pollUrl == "null"){

  res.redirect('/classCheck')
}

else{



if(pollCount <= count){
  console.log('front')
paynow.pollTransaction(pollUrl).then(transaction => {
  
  if(transaction.status === 'paid') {
    console.log('yess')


  
   
    if(expdate>curr){
      set2.add(duration,"months")
      User.find({companyId:companyId}, function(err,docs){
        // console.log(docs)
        
       for(var i =0;i<docs.length;i++){
         User.findByIdAndUpdate(docs[i]._id,{$set:{expdate:set2.valueOf(), expStr:set2.toString(),status3:'activate', status4:'deactivate', pollUrl2:'null',count:pollCount}},function(err,locs){
        
          
         })
       }
    
   
           
      res.redirect('/classCheck')
     })
     
    }
    else if(expdate<curr){
      set.add(duration,"months")
      
      User.find({companyId:companyId}, function(err,docs){
         // console.log(docs)
        for(var i =0;i<docs.length;i++){
          User.findByIdAndUpdate(docs[i]._id,{$set:{expdate:set.valueOf(), expStr:set.toString(),status3:'activate', status4:'deactivate',  pollUrl2:'null',count:pollCount}},function(err,locs){
           // console.log(locs)
            
              
           
          })
        }
       
            
        res.redirect('/classCheck')
      
      
      })

    }
  }
})
}else{
  res.redirect('pollCheckX')
}


}
})
    
    
  

  



  

    
  
    






router.get('/pollCheckX',isLoggedIn,function(req,res){
const { Paynow } = require("paynow");
  // Create instance of Paynow class
  let paynow = new Paynow(14808, "e351cf17-54bc-4549-81f2-b66feed63768");
  var m = moment()
  var a = moment()
  var curr = a.valueOf()
  var sett = new Date()
  var expdate = req.user.expdate
  var currdate = sett.getTime()
  var set =moment(); 
  var stt = req.user.expStr;
  
  var set2 = moment(stt)
  console.log(set2,'what')
  var year = m.format('YYYY')
  var month = m.format('MMMM')
  var companyId = req.user.companyId
 var id = req.user._id
var pollUrl = req.user.pollUrl2
var duration = req.user.duration
var count = req.user.actualCount
var pollCount = req.user.pollCount
console.log(pollCount,'PollCount')
console.log(count,'Count')

if(pollUrl == 'null'){
  res.redirect('/classCheck')
}
paynow.pollTransaction(pollUrl).then(transaction => {
  
  if(transaction.status === 'paid') {
    console.log('zvaita wena')

    if(expdate > curr){

    console.log('wadiii')
    set2.add(duration,"months")
    User.find({companyId:companyId}, function(err,docs){
      // console.log(docs)
      
     for(var i =0;i<count;i++){
       User.findByIdAndUpdate(docs[i]._id,{$set:{expdate:set2.valueOf(), expStr:set2.toString(),status3:'activate', status4:'deactivate', pollUrl2:'null',count:pollCount}},function(err,locs){
      
        
       })
     }

         
    res.redirect('/classCheck')
   })
   
  }
  else if(expdate < curr){

    set.add(duration,"months")
    
    User.find({companyId:companyId}, function(err,docs){
       // console.log(docs)
      for(var i =0;i<count;i++){
        User.findByIdAndUpdate(docs[i]._id,{$set:{expdate:set.valueOf(), expStr:set.toString(),status3:'activate', status4:'deactivate', pollUrl2:'null',count:pollCount}},function(err,locs){
         // console.log(locs)
          
            
         
        })
      }
    
          
    res.redirect('/classCheck')
    })
    }

  }

  })



})


router.get('/classCheck',isLoggedIn,function(req,res){
  var companyId = req.user.companyId
  Class1.find({companyId:companyId},function(err,docs){


    for(var i= 0;i<docs.length;i++){
      let classX = docs[i].class1
      let id = docs[i]._id
      User.find({companyId:companyId,class1:docs[i].class1},function(err,gocs){
let students = gocs.length;
User.find({companyId:companyId, class1:classX, status:'paid'},function(err,yocs){
  let paid = yocs.length;

  User.find({companyId:companyId,class1:classX,status:'owing'},function(err,locs){
    let unpaid= locs.length

    User.find({companyId:companyId, class1:classX,gender:'male'},function(err,xocs){
      let male= xocs.length

      User.find({companyId:companyId,  class1:classX,gender:'female'},function(err,zocs){
        let female= zocs.length

    Class1.findByIdAndUpdate(id,{$set:{numberOfStudents:students, paid:paid,unpaid:unpaid,male:male,female:female}},function(err,vocs){

    })
  })
  })
})
})
      })
    }
    res.redirect('/std')
  })
  
})



router.get('/upCheck',function(req,res){
 User.find(function(err,focs){
for(var i = 0;i<focs.length; i++){

let id = focs[i]._id

  User.findByIdAndUpdate(id,{$set:{admissionYear:2021,startYear:2021, stdYearCount:1,currentYearCount:1}},{multi:true},function(err,docs){

  })
}
})
})

router.get('/std',isLoggedIn,function(req,res){
  var companyId = req.user.companyId
  var m = moment()
  var year = m.format('YYYY')
  var currCount = req.user.currentYearCount
  var startYear = req.user.startYear
  Student.find({companyId:companyId}, function(err,locs){
    if(locs.length == 0){
var std = Student();
std.year1 = 0;
std.year2 = 0;
std.year3 = 0;
std.year4 = 0;
std.year5 = 0;
std.year6 = 0;
std.year7 = 0;
std.year8 = 0;
std.year9 = 0;
std.year10 = 0;
std.count = 0;
std.startYear = 0;
std.companyId = companyId

std.save()
.then(std=>{

  User.find({companyId:companyId,  role:'student',stdYearCount:currCount},function(err,docs){
    let total = docs.length;
   if(currCount == 0){
     Student.findByIdAndUpdate(std._id,{$set:{year1:total,count:currCount,startYear:startYear}},function(err,locs){

     })
   } else if(currCount == 1){
    Student.findByIdAndUpdate(std._id,{$set:{year2:total,count:currCount,startYear:startYear}},function(err,locs){

    })
   }else if(currCount == 2){
    Student.findByIdAndUpdate(std._id,{$set:{year3:total,count:currCount,startYear:startYear}},function(err,locs){

    })

   }
   res.redirect('/adminMonthInc')
    
      })


})

    }else{
Student.find({companyId:companyId},function(err,docs){
  
  User.find({companyId:companyId,  role:'student',stdYearCount:currCount},function(err,nocs){
    if(nocs){

   
    let total = nocs.length;

  
let id = docs[0]._id;


if(currCount == 0){
  Student.findByIdAndUpdate(id,{$set:{year1:total,count:currCount,startYear:startYear}},function(err,locs){

  })
} 

     else if(currCount == 1){
        Student.findByIdAndUpdate(id,{$set:{year2:total,count:currCount,startYear:startYear}},function(err,locs){
   
        })
      } 
      else if (currCount == 2){
        Student.findByIdAndUpdate(id,{$set:{year3:total,count:currCount,startYear:startYear}},function(err,locs){
   
        })
      } 

       else if (currCount == 3){
        Student.findByIdAndUpdate(id,{$set:{year4:total,count:currCount,startYear:startYear}},function(err,locs){
   
        })
      } 

      else if (currCount == 4){
        Student.findByIdAndUpdate(id,{$set:{year5:total,count:currCount,startYear:startYear}},function(err,locs){
   
        })
      } 

      else if (currCount == 5){
        Student.findByIdAndUpdate(id,{$set:{year6:total,count:currCount,startYear:startYear}},function(err,locs){
   
        })
      } 

      else if (currCount == 6){
        Student.findByIdAndUpdate(id,{$set:{year7:total,count:currCount,startYear:startYear}},function(err,locs){
   
        })
      } 

      else if (currCount == 7){
        Student.findByIdAndUpdate(id,{$set:{year8:total,count:currCount,startYear:startYear}},function(err,locs){
   
        })
      } 
      else if (currCount == 8){
        Student.findByIdAndUpdate(id,{$set:{year9:total,count:currCount,startYear:startYear}},function(err,locs){
   
        })
      } 
      else if (currCount == 9){
        Student.findByIdAndUpdate(id,{$set:{year10:total,count:currCount,startYear:startYear}},function(err,locs){
   
        })
      } 
    }else{
      console.log('flint')
    }
    })
    res.redirect('/adminMonthInc')
    })
    }
  })
  

})



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


router.get('/passX',isLoggedIn, (req, res) => {
 res.render('admin/change4')
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
    res.render('admin/change',{  errors:req.session.errors, pro:pro 
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

      res.redirect('/adminMonthExp')

    })

    }
    else
    MonthIncome.find({year:year,month:month},function(err,docs){

      var id3 = docs[0]._id
    Fees.find({ companyId:companyId ,year:year,month:month},function(err,hods){

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
  var companyId = req.user.companyId


  MonthExpense.find({ companyId:companyId, year:year,month:month},function(err,docs){

    Expenses.find({ companyId:companyId,year:year,month:month},function(err,hods){


    

    if(docs.length == 0  && hods.length == 0){

      

      var exp = MonthExpense();
            exp.amount = 0;
            exp.month = month;
            exp.year = year
            exp.companyId = companyId

            exp.save()
    .then(incX =>{

      res.redirect('/adminDashInc')

    })

    }
    else
    MonthExpense.find({ companyId:companyId,year:year,month:month},function(err,docs){

      var id3 = docs[0]._id
    Expenses.find({  companyId:companyId,year:year,month:month},function(err,hods){

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
  var companyId = req.user.companyId


  Income.find({ companyId:companyId,year:year},function(err,docs){

    Fees.find({  companyId:companyId,term:term,year:year},function(err,hods){


    

    if(docs.length == 0  && hods.length == 0){

      

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

      res.redirect('/adminDashExp')

    })

    }
    else
    Income.find({companyId:companyId,year:year},function(err,docs){

      var id3 = docs[0]._id
    Fees.find({ companyId:companyId, term:term,year:year},function(err,hods){

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
  var companyId = req.user.companyId

  Expenses.find({ companyId:companyId,term:term,year:year},function(err,hods){

    if(hods.length == 0){

      res.redirect('/passRate')
    }
else
Income.find({  companyId:companyId,year:year},function(err,docs){
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
  var companyId = req.user.companyId


  Pass.find({ companyId:companyId,year:year},function(err,docs){

    TestX.find({ companyId:companyId,term:term,year:year,type:'Final Exam'},function(err,hods){

  
    if(docs.length == 0 && hods.length == 0){

      var pass = Pass();
      pass.firstTerm = 0;
      pass.secondTerm= 0;
      pass.thirdTerm = 0
      pass.year = year
      pass.companyId = companyId

      pass.save()
      .then(pas =>{

        res.redirect('/passRateX')
      })

    }
    else

    
  Pass.find({ companyId:companyId,year:year},function(err,docs){
 var idX = docs[0]._id;
    TestX.find({companyId:companyId,term:term,year:year},function(err,hods){

      TestX.find({companyId:companyId,term:term,year:year, result:'pass', type:'Final Exam'},function(err,lods){

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
  var companyId = req.user.companyId

  PassX.find({companyId:companyId,year:year},function(err,docs){

    TestX.find({companyId:companyId,term:term,year:year,type:'Class Test'},function(err,hods){

  
    if(docs.length == 0 && hods.length == 0){

      var pass = PassX();
      pass.firstTerm = 0;
      pass.secondTerm= 0;
      pass.thirdTerm = 0
      pass.year = year
      pass.companyId = companyId

      pass.save()
      .then(pas =>{

        res.redirect('/adminGender')
      })

    }
    else

    
  PassX.find({companyId:companyId,year:year},function(err,docs){
 var idX = docs[0]._id;
 console.log('class testX',idX)
    TestX.find({companyId:companyId,term:term,year:year},function(err,hods){

      TestX.find({companyId:companyId,term:term,year:year, result:'pass', type:'Class Test'},function(err,lods){

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
  var companyId = req.user.companyId


  Gender.find({companyId:companyId},function(err,docs){

    User.find({companyId:companyId,role:'student'},function(err,hods){


    

    if(docs.length == 0  && hods.length == 0){

      

      var gen = Gender();
            gen.male = 0;
            gen.female = 0;
            gen.companyId = companyId
            gen.save()
    .then(genX =>{

      res.redirect('/dash')

    })

    }
    else
    Gender.find({},function(err,docs){

      var id3 = docs[0]._id
      console.log('id3',id3)
      User.find({companyId:companyId,role:'student',gender:'male'},function(err,hods){

      User.find({companyId:companyId,role:'student', gender:'female'},function(err,pods){

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
  var companyId = req.user.companyId
        Pass.find({companyId:companyId,year:year, term:term},function(err,docs){
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
        var companyId = req.user.companyId
              PassX.find({companyId:companyId,year:year, term:term},function(err,docs){
                if(docs == undefined){
                  res.redirect('/dash')
                }else
            
                   res.send(docs)
               
                
                 })
            
            })

//genderChart
      router.post('/genChart',isLoggedIn,function(req,res){
       var companyId = req.user.companyId
              Gender.find({companyId:companyId},function(err,docs){
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



                  router.post('/incomeChart99',isLoggedIn, function(req,res){
                    var m = moment()
                    var year = m.format('YYYY')
                    var count = req.user.currentYearCount
                    var companyId = req.user.companyId
                
                          Student.find({companyId:companyId},function(err,docs){
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




//landing page
router.get('/land',function(req,res){
  var pro = req.user
  Subscriptions.find({},(err, docs) => {
    console.log(docs,'docs')
  res.render('landing/land2',{doc:docs[0],pro:pro})

  })
  
})


 
//adding staff
router.get('/addStaff',isLoggedIn, function(req,res){
    var actualCount = req.user.actualCount
    var count = req.user.count
    var pro = req.user
    var prefix = req.user.prefix
    var idNum = req.user.idNumber
  idNum++
    var uid = prefix + idNum
    var title
    var readonly 
    if(actualCount < count){
      title = "Add Staff"
      readonly = ""
      res.render('admin/staff',{pro:pro,uid1:uid, title:title,readonly})
    }
else
title = "You've Reached Maximum Users Limit"
readonly = 'readonly'
res.render('admin/staff',{pro:pro,uid1:uid, title:title,readonly})
 
  
})



              router.post('/addStaff',isLoggedIn, function(req, res, next) {
                var pro = req.user
                var uid = req.body.uid;
                var name = req.body.name;
                var surname = req.body.surname;
                var fullname = name +" "+ surname
                var mobile = req.body.mobile;
                var gender = req.body.gender;
                var dob = req.body.dob;
                var role = req.body.role;
                var password = req.body.password;
                var term = req.user.term
                var year = req.user.year
                var email = req.body.email
                var prefix = req.user.prefix
                var suffix = req.user.suffix
               var expdate = req.user.expdate
               var expStr = req.user.expStr
               var companyId= req.user.companyId
            var id =   req.user._id
            var schoolName = req.user.schoolName
            var count = req.user.count
            var actualCount = req.user.actualCount
            var duration = req.user.duration
           
            var idNumber = req.user.idNumber
            var prefix1 = req.user.prefix
 var idNum1 = req.user.idNumber
 var idNumX = req.user.idNumX
 var uid1 = prefix1 + idNum1
               
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
                      res.render('admin/staff',{user:req.body, errors:req.session.errors,pro:pro,uid1:uid1
                  
                })
              }
                   {
                      User.findOne({'uid':uid})
                      .then(user =>{
                          if(user){ 
                        // req.session.errors = errors
                          //req.success.user = false;
                         req.session.message = {
                           type:'errors',
                           message:'User ID already in use'
                         }     
                       
                            res.render('admin/staff', {
                                user:req.body, message:req.session.message,uid1:uid1 
                            }) 
                    }
                    
                  
                      else  {
                        
                        const token = jwt.sign({uid, name,surname,fullname,mobile,gender, idNumber,idNumX, dob,role,term,year,expdate,expStr,count,actualCount,duration, companyId,schoolName, email,prefix,suffix, password, }, JWT_KEY, { expiresIn: '100000m' });
                        const CLIENT_URL = 'http://' + req.headers.host;
                  
                        const output = `
                        <h2>Please click on below link to activate your account</h2>
                        <a href="${CLIENT_URL}/activate1/${token}">click here</a>
                        <h1> User credentials</h1>
                        <p>usrId:${uid}</p>
                        <p>password:${password}</p>
                        <p><b>NOTE: </b> The above activation link expires in 1 week.</p>
                        `;
                  
                        const transporter = nodemailer.createTransport({
                          service: 'gmail',
                          auth: {
                              user: "cashreq00@gmail.com",
                              pass: "itzgkkqtmchvciik",
                          },
                        });
                        
                  
                        // send mail with defined transport object
                        const mailOptions = {
                            from: '"Admin" <cashreq00@gmail.com>', // sender address
                            to: email, // list of receivers
                            subject: "Account Verification ✔", // Subject line
                            html: output, // html body
                        };
                  
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                              console.log(error)
                            
                         req.session.message = {
                           type:'errors',
                           message:'confirmation email not sent'
                         }
                       
                         res.render('admin/staff',{message:req.session.message,uid1:uid1,pro:pro
                         })
                      
                      
                            }
                            else {
                        
                              
                              actualCount++
                              idNumber++ 
                              actualCount + 1
                              let idNumQ = idNumber + 1
                              let uid9 = prefix + idNumQ
                              User.findByIdAndUpdate(id,{$set:{idNumber:idNumber,actualCount:actualCount}},function(err,ocs){
                                console.log('Mail sent : %s', info.response);
                                req.session.message = {
                                  type:'success',
                                  message:'confirmation email sent'
                                }     
                               
                                res.render('admin/staff',{message:req.session.message,uid1:uid9,pro:pro
                                })
                              })
                               
                                 
                            }
                        })
                  
                    }
                          
                    
                  })
                  
                  
                     
                  }
                    
                    
                  
                      
                  
                      
                      })
              
              
              
                  
              
              //user account activation route  (teachers & librarian users)
              router.get('/activate1/:token',(req,res)=>{
                  const token = req.params.token;
                  var m = moment()
                  var year = m.format('YYYY')
                  let errors = [];
                  if (token) {
                      jwt.verify(token, JWT_KEY, (err, decodedToken) => {
                          if (err) {
                              
                              req.session.message = {
                                  type:'errors',
                                  message:'Incorrect or expired link! Please register again'
                                } 
                                res.render('user/login',{message:req.session.message});
                          }
                          else {
                              const {uid, name,surname,fullname,mobile,gender,dob,role,term,year,expdate,expStr,idNumX, count,actualCount,duration, companyId, email,prefix,suffix,idNumber,schoolName, password,} = decodedToken;
                              User.findOne({ uid: uid }).then(user => {
                                  if (user) {
                                      //------------ User already exists ------------//
                                  
                                      req.session.message = {
                                          type:'errors',
                                          message:'User already registered! Please log in.'
                                        }  
                                        res.render('users/login',{message:req.session.message});
                               
                                      
                                  }
                                  else  {      
                
                                    var user = new User();
                                    user.uid = uid;
                                    user.name = name;
                                    user.surname = surname;
                                    user.fullname = fullname;
                                    user.email = email;
                                    user.role = role;
                                    user.prefix = prefix;
                                    user.suffix = suffix;
                                    user.companyId = companyId;
                                    user.gender = gender;
                                    user.dob = dob;
                                    user.mobile= mobile;
                                    user.studentId = 'null'
                                    user.teacherName='null'
                                    user.teacherId = 'null'
                                    user.grade = 0;
                                    user.idNumber= idNumber;
                                    user.idNumX = idNumX;
                                    user.class1 = 'null';
                                    user.mobile = mobile;
                                    user.classLength = 0;
                                    user.classNo = 0
                                    user.studentNum = 0;
                                    user.uidNum = 309;
                                    user.number = 0;
                                    user.schoolName=schoolName
                                    user.examDate = 'null';
                                    user.feeStatus = 'null';
                                    user.feesUpdate = 'null';
                                    user.term = term;
                                    user.amount = 0;
                                    user.receiptNumber = 0;
                                    user.possibleMark = 0;
                                    user.topic = 'null';
                                    user.year = year;
                                    user.recNumber = 0;
                                    user.balance = 0;
                                    user.balanceCarriedOver = 0;
                                    user.status = 'null';
                                    user.paymentId = 'null';
                                    user.role1 = 'staff'
                                    user.photo = 'propic.jpg';
                                    user.level = 'null';
                                    user.pollUrl='null'
                                    user.annual =0
                                    user.fees = 0
                                    user.paynow = 0
                                    user.type = 'null';
                                    user.address = 'null';
                                    user.dept = 'null';
                                    user.subject = 0;
                                    user.subjectCode = 'null'
                                    user.subjects = 'null'
                                    user.dept = 'null';
                                    user.expdate=expdate;
                                    user.expStr = expStr; 
                                    user.duration = duration;   
                                    user.levelX = 'null';
                                    user.status4 = 'null';
                                    user.status3 = "null"
                                    user.pollUrl2 = "null"
                                    user.count= count
                                    user.pollCount = 0
                                    user.actualCount = actualCount   
                                    user.startYear = year
                                    user.currentYearCount = 0
                                    user.stdYearCount = 0
                                    user.admissionYear = 0  
                                    user.password = user.encryptPassword(password)
                                    user.save()
                                      .then(user =>{
                                       
                                      
                                          
                                        req.session.message = {
                                          type:'success',
                                          message:'Account Registered'
                                        }  
                                        res.render('users/login',{message:req.session.message});
                                      })
                                      .catch(err => console.log(err))
                                    }
                                    
                                      })
                                     }
                              });
                            }
                  });
              

//staff List

router.get('/staffList',isLoggedIn,adminX,(req, res) => {
var pro = req.user
var companyId = req.user.companyId
User.find({companyId:companyId,role1:"staff"},(err, docs) => {
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


router.get('/landX',isLoggedIn,function(req,res){
  res.render('landing/land2')
})

//student List


router.get('/studentList',isLoggedIn,adminX,(req, res) => {
var pro = req.user
var companyId = req.user.companyId
User.find({companyId:companyId,role:"student"},(err, docs) => {
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


   //view profile
   router.get('/student/:id',isLoggedIn,function(req,res){
    var pro = req.user
    User.findById(req.params.id, (err, doc) => {
      if (!err) {
      
          res.render("admin/overviewStudent", {
             
              doc: doc,pro:pro
            
              
          });
        
      }
  });
  
  
  
  })
  


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
var companyId = req.user.companyId
User.find({companyId:companyId,role:"teacher"},(err, docs) => {
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
var companyId = req.user.companyId
var term = req.user.term
TeacherExamRate.find({companyId:companyId,year:year,  type:"Final Exam"},function(err,docs){
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
var companyId = req.user.companyId
TeacherExamRate.find({companyId:companyId,year:year,   type:"Class Test"},function(err,docs){
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
  var companyId = req.user.companyId
  TestX.find({companyId:companyId, type:'Class Test'},(err, docs) => {
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
  var companyId = req.user.companyId
  TestX.find({companyId:companyId, type:'Final Exam'},(err, docs) => {
  if (!err) {
     res.render("admin/resultX", {
        list:docs, pro:pro
       
     });
  }
  });
  });
  


router.get('/subscriptions',isLoggedIn,function(req,res){
  var pro = req.user

  Subscriptions.find({},(err, docs) => {
    console.log(docs,'docs')
  res.render('accounts/subscriptions1',{doc:docs[0],pro:pro})

  })
})
//subscription packages
router.get('/subX1',isLoggedIn, function(req,res){
  res.render('accounts/subscriptions1')
})

router.get('/addSub',function(req,res){
  var pro = req.user
  res.render('accounts/subs',{pro:pro})
})
//startup Q
router.get('/startup',isLoggedIn,function(req,res){

  // Create instance of Paynow class
  let paynow = new Paynow(14808, "e351cf17-54bc-4549-81f2-b66feed63768");
  var m = moment()
  var id  = req.user._id
  var companyId = req.user.companyId;
  var schoolName = req.user.schoolName;
  var date = moment().toString();
  var amount , pollCount, duration
  Subscriptions.find({},function(err,docs){
   // amount = docs[0].startup
   amount = 100
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
res.redirect('/subscriptions')
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
   // amount = docs[0].startup
   amount = 100
    pollCount = docs[0].startupCount
    duration = docs[0].startupDuration
    
  
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
        poll.duration = duration
        poll.count = pollCount
        poll.save()
           .then(poll =>{
           
            User.findByIdAndUpdate(id,{$set:{pollUrl2:pollUrl,paynow:amount,pollCount:pollCount,duration:duration}},function(err,docs){
               
               
                 
               
            })
        



              res.redirect(link)
           })
    }
    else{
res.redirect('/subscriptions')
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
   // amount = docs[0].startup
   amount = 100
    pollCount = docs[0].startupCount
    duration = docs[0].startupDuration
     
  
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
res.redirect('/subscriptions')
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
   // amount = docs[0].startup
   amount = 100
    pollCount = docs[0].startupCount
    duration = docs[0].startupDuration
      
  
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
res.redirect('/subscriptions')
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
    //amount = docs[0].startup
    amount = 100
    pollCount = docs[0].startupCount
    duration = docs[0].startupDuration
      
  
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
res.redirect('/subscriptions')
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
   // amount = docs[0].startup
   amount = 100
    pollCount = docs[0].startupCount
    duration = docs[0].startupDuration
    
  
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
res.redirect('/subscriptions')
    }
  })
  })
})

router.post('/addSub', (req,res)=>{
  var startup = req.body.startup;
  var startupCount = req.body.startupCount;
  var startupDuration = req.body.startupDuration
  var advanced = req.body.advanced;
  var advancedDuration = req.body.advancedDuration;
  var advancedCount = req.body.advancedCount;
  var enterprise = req.body.enterprise;
  var enterpriseDuration = req.body.enterpriseDuration;
  var enterpriseCount = req.body.enterpriseCount;
  var startupA = req.body.startupA;
  var startupAduration = req.body.startupAduration;
  var advancedA = req.body.advancedA;
  var advancedAduration = req.body.advancedAduration;
  var enterpriseA = req.body.enterpriseA;
  var enterpriseAduration = req.body.enterpriseAduration;
  var pro = req.user

 
  req.check('startup','Enter Startup Amount').notEmpty().isNumeric();
  req.check('startupCount','Enter Startup Amount').notEmpty().isNumeric();
  req.check('advanced','Enter Advanced').notEmpty().isNumeric();
  req.check('advancedCount','Enter Advanced').notEmpty().isNumeric();
  req.check('enterprise', 'Enter Enterprise').notEmpty().isNumeric();
  req.check('enterpriseCount', 'Enter Enterprise').notEmpty().isNumeric();
  req.check('startupA','Enter Annual Startup Amount ').notEmpty().isNumeric();
  req.check('advancedA','Enter Annual Advanced').notEmpty().isNumeric();
  req.check('enterpriseA', 'Enter Annual Enterprise').notEmpty().isNumeric(); 
  req.check('startupDuration', 'Enter Startup Duration').notEmpty().isNumeric(); 
  req.check('advancedDuration', 'Enter Advanced Duration').notEmpty().isNumeric(); 
  req.check('enterpriseDuration', 'Enter Enterprise Duration').notEmpty().isNumeric(); 
  req.check('startupAduration', 'Enter Startup Annual Duration').notEmpty().isNumeric(); 
  req.check('advancedAduration', 'Enter Advanced Annual Duration').notEmpty().isNumeric(); 
  req.check('enterpriseAduration', 'Enter Enterprise Annual Duration').notEmpty().isNumeric(); 

 
 
    
  var errors = req.validationErrors();
  
  
  
   if (errors) {
  
     
        req.session.errors = errors;
        req.session.success = false;
        res.render('accounts/subs',{ errors:req.session.errors,pro:pro})
     
    
    }
else{
  
    Subscriptions.findOne({'startup':startup})
    .then(clax =>{
        if(clax){ 

       req.session.message = {
        type:'errors',
         message:'Subscription already exists'
       }     
          res.render('accounts/subs', {
             message:req.session.message ,pro:pro
          })
        }else

  var sub = new Subscriptions();

  sub.startup = startup;
  sub.startupDuration = startupDuration
  sub.startupCount = startupCount;
  sub.advanced = advanced;
  sub.advancedDuration = advancedDuration;
  sub.advancedCount = advancedCount;
  sub.enterprise = enterprise;
  sub.enterpriseDuration = enterpriseDuration
  sub.enterpriseCount = enterpriseCount;
  sub.startupA = startupA;
  sub.startupAduration = startupAduration
  sub.advancedA = advancedA;
  sub.advancedAduration = advancedAduration
  sub.enterpriseA = enterpriseA;
  sub.enterpriseAduration = enterpriseAduration
  
 


  sub.save()
    .then(romm =>{
     
      req.session.message = {
        type:'success',
        message:'Subscription added'
      }  
      res.render('accounts/subs',{message:req.session.message,pro:pro});
  

  })

    .catch(err => console.log(err))
  
  
  })
}







})
  











router.get('/listSub',isLoggedIn, (req, res) => {
  var pro = req.user  
  Subscriptions.find( (err, doc) => {
      if (!err) {
      
          res.render("accounts/subList", {
             
              list: doc, pro:pro
            
              
          });
        
      }
  });
  });



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
        
            res.render("accounts/subPoll", {
               
                list: doc, pro:pro, msg:msg, days:days, les:les, mor:mor
              
                
            });
          
        }
    });
    });
  





//role admin
//updating user
router.get('/sub/:id', (req, res) => {
  var pro = req.user  
 Subscriptions.findById(req.params.id, (err, doc) => {
      if (!err) {
      
          res.render("accounts/update", {
             
              user: doc, pro:pro
            
              
          });
        
      }
  });
  });
  
  router.post('/sub/:id',  (req, res) => {
  var sub = new Subscriptions();
  var id = req.body._id;
  var startup = req.body.startup;
  var startupA = req.body.startupA;
  var advanced = req.body.advanced;
  var advancedA = req.body.advancedA;
  var enterprise = req.body.enterprise;
  var enterpriseA = req.body.enterpriseA;

  var pro = req.user
  
  req.check('startup','Enter Startup Amount').notEmpty().isNumeric();
  req.check('startupA','Enter Startup Annual Amount').notEmpty().isNumeric();
  req.check('advanced','Enter Advanced').notEmpty().isNumeric();
  req.check('advancedA','Enter Advanced Annual').notEmpty().isNumeric();
  req.check('enterprise', 'Enter Enterprise').notEmpty().isNumeric();
  req.check('enterpriseA', 'Enter Enterprise Annual').notEmpty().isNumeric();
  
 
    
  var errors = req.validationErrors();
  
  
  
   if (errors) {
  
     
        req.session.errors = errors;
        req.session.success = false;
        res.render('accounts/subList',{ errors:req.session.errors,pro:pro})
     
    
    }
  
  else
  {
  
        Subscriptions.findOneAndUpdate({_id:id},req.body,
          { new: true }, (err, doc) => {
             if (!err) {
             
                res.redirect('/listSub'); }
             else {
               console.log('error'+err)
       
             }
           
         })
  
  
    
  }
  
  });
  


router.get('/rem',function(req,res){
  User.find({role1:'staff'},function(err,docs){
    for(var i = 0; i<docs.length;i++){
      User.findByIdAndRemove(docs[i]._id,function(err,locs){

      })
    }
  })
})



router.get('/remX3',function(req,res){
  User.find({},function(err,docs){
    for(var i = 0; i<docs.length;i++){
      User.findByIdAndUpdate(docs[i]._id,{$set:{balance:-30000,balanceCarriedOver:0,}},function(err,locs){

      })
    }
  })
})

/*
router.get('/remX',function(req,res){
  User.find({role:'teacher'},function(err,docs){
    for(var i = 0; i<docs.length;i++){
      User.findByIdAndRemove(docs[i]._id,function(err,locs){

      })
    }
  })
})

*/


router.get('/deptList',isLoggedIn, (req, res) => {
var pro = req.user
var companyId = req.user.companyId
Dept.find({companyId:companyId},(err, docs) => {
    if (!err) {
        res.render("admin/deptlist", {
           list:docs, pro:pro
          
        });
    }
});
});

router.get('/cList',isLoggedIn, (req, res) => {
var pro = req.user
var companyId = req.user.companyId
Class1.find({companyId:companyId},(err, docs) => {
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
var companyId = req.user.companyId
User.find({companyId:companyId,role:'student'},function(err,docs){



for(var i = 0; i<docs.length; i++){
let studentName = docs[i].fullname;
let studentId = docs[i].uid;
let studentClass = docs[i].class1;
let grade = docs[i].grade;

Subject.find({companyId:companyId,grade:grade},function(err,nocs){
for(var x = 0; x < nocs.length; x++){
let subjectName = nocs[x].name;
let subjectCode = nocs[x].code
let dept = nocs[x].dept
 
 
StudentSub.findOne({'companyId':companyId,'studentName':studentName, 'subjectCode':subjectCode})
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
  var companyId = req.user.companyId
User.find({companyId:companyId,role:'student'},function(err,docs){

for(var i = 0; i<docs.length; i++){
  let id = docs[i]._id;
  let studentId = docs[i].uid;

StudentSub.find({companyId:companyId,studentId:studentId},function(err,nocs){
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
  var companyId = req.user.companyId
Class1.find({companyId:companyId},function(err,docs){
  Subject.find({companyId:companyId},function(err,locs){
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
var companyId= req.user.companyId


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
TeacherSub.findOne({'companyId':companyId, 'teacherName':teacherName, 'class1':class1, 'subjectName':subjectName})
.then(clax =>{
  if(clax){ 
 
    
    Class1.find({companyId:companyId},function(err,docs){
      Subject.find({companyId:companyId},function(err,locs){
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

Subject.find({companyId:companyId,name:subjectName, class1:class1},function(err,docs){
subjectCode=docs[0].code;
grade = docs[0].grade;
dept = docs[0].dept;
console.log(subjectCode)
TeacherSub.findByIdAndUpdate(id,{$set:{subjectCode:subjectCode, grade:grade, dept:dept}},function(err,nocs){





})

Class1.find({companyId:companyId},function(err,docs){
Subject.find({companyId:companyId},function(err,locs){
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

var companyId = req.user.companyId
var regex= new RegExp(req.query["term"],'i');

var uidFilter =User.find({companyId:companyId,fullname:regex, role:"teacher"},{'fullname':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);


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
var companyId = req.user.companyId


User.find({companyId:companyId,fullname:fullname},function(err,docs){
if(docs == undefined){
 res.redirect('/autoTS')
}else

  res.send(docs[0])
})


})








//autocomplete teacherName & uid

router.get('/autocompleteSub/',isLoggedIn, function(req, res, next) {
var companyId = req.user.companyId

var regex= new RegExp(req.query["term"],'i');

var uidFilter =Subject.find({companyId:companyId,name:regex},{'name':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);


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
var companyId = req.user.companyId

  Subject.find({companyId:companyId,name:name},function(err,docs){
if(docs == undefined){
 res.redirect('/autoSub')
}else

  res.send(docs[0])
})


})









router.get('/mess',isLoggedIn, function(req,res){
  res.render('admin/message')
})

router.post('/mess',isLoggedIn, function(req,res){

  const message = req.body.message
  var companyId = req.user.companyId
  var subject = req.body.subject



  User.find({role:"teacher",companyId:companyId},function(err,docs){
for(var i = 0; i<docs.length;i++){

  let email = docs[i].email
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "cashreq00@gmail.com",
        pass: "itzgkkqtmchvciik",
    },
  });
  
  const output = `
  <h2>${subject}</h2>
  <br>
  <p> ${message}</p>
 
  `;

  // send mail with defined transport object
  const mailOptions = {
      from: '"Admin" <cashreq00@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Account Verification ✔", // Subject line
      html: output, // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
      
   req.session.message = {
     type:'errors',
     message:'confirmation email not sent'
   }
 
   res.render('admin/message',{message:req.session.message,pro:pro
   })


      }
      else {

       
          console.log('Mail sent : %s', info.response);
          req.session.message = {
            type:'success',
            message:'confirmation email sent'
          }     
         
          res.render('admin/message',{message:req.session.message,pro:pro
          })
        
         
           
      }
    
    })
  }
  })
})




router.get('/messX',isLoggedIn, function(req,res){
  res.render('admin/message1')
})

router.post('/messX',isLoggedIn, function(req,res){

  const message = req.body.message
  var companyId = req.user.companyId
  var subject = req.body.subject



  User.find({role:"students",companyId:companyId},function(err,docs){
for(var i = 0; i<docs.length;i++){

  let email = docs[i].email
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "cashreq00@gmail.com",
        pass: "itzgkkqtmchvciik",
    },
  });
  
  const output = `
  <h2>${subject}</h2>
  <br>
  <p> ${message}</p>
 
  `;

  // send mail with defined transport object
  const mailOptions = {
      from: '"Admin" <cashreq00@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Account Verification ✔", // Subject line
      html: output, // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
      
   req.session.message = {
     type:'errors',
     message:'confirmation email not sent'
   }
 
   res.render('admin/message1',{message:req.session.message,pro:pro
   })


      }
      else {

       
          console.log('Mail sent : %s', info.response);
          req.session.message = {
            type:'success',
            message:'confirmation email sent'
          }     
         
          res.render('admin/message1',{message:req.session.message,pro:pro
          })
        
         
           
      }
    
    })
  }
  })
})




router.get('/messXX',isLoggedIn, function(req,res){
  res.render('admin/message2')
})

router.post('/messXX',isLoggedIn, function(req,res){

  const message = req.body.message
  var companyId = req.user.companyId
  var subject = req.body.subject



  User.find({role:"all",companyId:companyId},function(err,docs){
for(var i = 0; i<docs.length;i++){

  let email = docs[i].email
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "cashreq00@gmail.com",
        pass: "itzgkkqtmchvciik",
    },
  });
  
  const output = `
  <h2>${subject}</h2>
  <br>
  <p> ${message}</p>
 
  `;

  // send mail with defined transport object
  const mailOptions = {
      from: '"Admin" <cashreq00@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Account Verification ✔", // Subject line
      html: output, // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
      
   req.session.message = {
     type:'errors',
     message:'confirmation email not sent'
   }
 
   res.render('admin/message2',{message:req.session.message,pro:pro
   })


      }
      else {

       
          console.log('Mail sent : %s', info.response);
          req.session.message = {
            type:'success',
            message:'confirmation email sent'
          }     
         
          res.render('admin/message2',{message:req.session.message,pro:pro
          })
        
         
           
      }
    
    })
  }
  })
})





//update teacher subjectNumber
//update student subject number
router.get('/subTotalX',isLoggedIn,function(req,res){
  var companyId = req.user.companyId
User.find({companyId:companyId,role:'teacher'},function(err,docs){

  for(var i = 0; i<docs.length; i++){
    let id = docs[i]._id;
    let teacherId = docs[i].uid;

TeacherSub.find({companyId:companyId,teacherId:teacherId},function(err,nocs){
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
   var companyId = req.user.companyId

FeesUpdate.find({companyId:companyId,term:term, year:year},(err, docs) => {
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
    fees.companyId = companyId
  
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
  var companyId = req.user.companyId
  Lesson.find({companyId:companyId,term:term},(err, docs) => {
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
var companyId = req.user.companyId
Exam.find({companyId:companyId},(err, docs) => {
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
var companyId = req.user.companyId
  Grade.find({companyId:companyId},(err, docs) => {
      if (!err) {
          res.render("adminExam/glist", {
             list:docs, pro:pro
            
          });
      }
  });
});







    router.get('/feesRecords',isLoggedIn, (req, res) => {
var pro = req.user
var companyId = req.user.companyId
      Fees.find({companyId:companyId},(err, docs) => {
          if (!err) {
              res.render("accounts/listX", {
                 list:docs, pro:pro
                
              });
          }
      });
    });
    























router.get('/expenseList',isLoggedIn, (req, res) => {
var pro = req.user
var companyId = req.user.companyId
Expenses.find({companyId:companyId},(err, docs) => {
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
var companyId = req.user.companyId
User.find({companyId:companyId},(err, docs) => {
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

router.post('/:id',isLoggedIn,adminX,  (req, res) => {
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
req.check('email','Enter email').notEmpty().isEmail();
req.check('dob','Enter Date Of Birth').notEmpty();
req.check('address','Enter Address').notEmpty();
req.check('grade','Enter Grade/Form').notEmpty();
req.check('uid','Enter Student ID').notEmpty();
req.check('class1','Enter Class').notEmpty();
req.check('gender','Enter Gender').notEmpty();
req.check('mobile', 'Enter Phone Number').notEmpty()

  
var errors = req.validationErrors();



 if (errors) {

   
      req.session.errors = errors;
      req.session.success = false;
      res.render('users/update',{ errors:req.session.errors,pro:pro})
   
  
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














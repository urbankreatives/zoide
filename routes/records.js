require('dotenv').config();

var express = require('express');
var router = express.Router();
const User =require('../models/user')
const Class1 =require('../models/class');
const Subject =require('../models/subject');
const Fees =require('../models/fees');
const Calendar =require('../models/calendar');
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




router.get('/stats',isLoggedIn, function(req,res){
    var students, teachers, paid, unpaid, depts, class1
    var m = moment()
    var year = m.format('YYYY')
  User.find({role:'student'},function(err,nocs){
    students = nocs.length
    
  User.find({role:'teacher'},function(err,nocs){
    teachers = nocs.length;
    User.find({role:'student',status:'paid'},function(err,rocs){
   paid = rocs.length;
  
   User.find({role:'student',status:'owing'},function(err,locs){
     unpaid =locs.length

     Dept.find({},function(err,jocs){
      depts = jocs.length;
     
      Class1.find({},function(err,klocs){
        class1 = klocs.length

  
     Stats.find({year:year},function(err,docs){
  
  if(docs == 0){
  
  
  var stat = new Stats();
  stat.students = students;
  stat.teachers = teachers
  stat.paid = paid;
  stat.unpaid = unpaid
  stat.depts = depts
  stat.class1 = class1
  stat.year = year
  
  
  stat.save()
  .then(sta =>{
  
    res.redirect('/records/dash')
  
  })
  }
  else

  var id = docs[0]._id
  console.log(students,'students',teachers,'teachers',class1,'class1',depts,'depts', paid,'paid',unpaid,'unpaid')
  Stats.findByIdAndUpdate(id,{$set:{students:students, teachers:teachers,paid:paid, unpaid:unpaid, class1:class1, depts:depts}},function(err,tocs){


    
  })
  
  res.redirect('/records/dash')

  
  

  
  })
  
    
})
     })
     
   })
  
  
    })
  })
  
  })
  
    
  })
  
  
  router.get('/dash',isLoggedIn,function(req,res){
   var pro = req.user
      res.render('dashboard/records',{pro:pro})
  })
  
  
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
      //calendar
  
      router.post('/calendarChart',isLoggedIn,function(req,res){
  
        Calendar.find({},function(err,docs){
          if(docs == undefined){
            res.redirect('/dash')
          }else
      
             res.send(docs)
         
          
           })
      
      })
      
    //profile
    router.get('/profile',isLoggedIn ,function(req,res){
      var pro = req.user
      var user = req.user
      res.render('records/overview',{pro:pro,user:user})
    })


    
  router.post('/profile',isLoggedIn,upload.single('file'),function(req,res){
 
  
  var pro = req.user
    if(!req.file){
     req.session.message = {
       type:'errors',
       message:'Select Picture'
     }     
       res.render('records/overview', {
            user:req.body, message:req.session.message,pic:req.user.photo,user:req.user ,pro:pro
        }) 
     
    } else
    var imageFile = req.file.filename;
    var id  = req.user._id;
   console.log(imageFile)
   console.log(id)
    User.findByIdAndUpdate(id,{$set:{photo:imageFile}},function(err,data){ 
    
    
      
    
    
    })
   
    res.redirect('/records/profile')
  
       //res.render('uploads/index',{title:'Upload File',records:data, success:success})
  
  
     
  
    
   
  })
  
      //add student

router.get('/addStudent',isLoggedIn,  function(req,res){
var pro = req.user
  Class1.find({},function(err,docs){
    var arr1 = docs;
   var classes = docs.length;
    if(classes == 0){
      res.redirect('/records/addClass')
    }else
    res.render('students/admit',{arr1:arr1,pro:pro})
      
    })
})



router.post('/addStudent',isLoggedIn,upload.single('file'),function(req, res, next) {
  var pro = req.user
    var adminBal = req.user.balance
    var uid = req.body.uid;
    var name = req.body.name;
    var surname = req.body.surname;
    var role = 'student';
    var address = req.body.address
    var mobile = req.body.mobile;
    var gender = req.body.gender;
    var dob = req.body.dob;
  var email = req.body.email
    var class1 = req.body.class1;
    var grade = req.body.grade
    var password = req.body.password;
    var term = req.user.term
    var year = req.user.year

  
   
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
    req.check('password', 'Password do not match').isLength({min: 4}).equals(req.body.confirmPassword);
        
          
       
    var errors = req.validationErrors();

        if (errors) {
          Class1.find({}, function(err,docs){
            var arr1 = docs;  
          req.session.errors = errors;
          req.session.success = false;
          res.render('students/admit',{ errors:req.session.errors, arr1:arr1,pro:pro})
    })
        
      }
      else
    
     {
        User.findOne({'uid':uid})
        .then(user =>{
            if(user){ 
          // req.session.errors = errors
            //req.success.user = false;
            Class1.find({}, function(err,docs){
              var arr1 = docs;
           req.session.message = {
             type:'errors',
             message:'student already in the system'
           }     
           
              res.render('students/admit', {
                   message:req.session.message ,arr1:arr1,pro:pro
              }) 
            })
      }
      
                    else  {   
                 
                      var user = new User();
                      user.uid = uid;
                      user.name = name;
                      user.fullname = name + " " + surname;
                      user.surname = surname;
                      user.role = role;
                      user.gender = gender;
                      user.dob = dob;
                      user.studentId = 'null'
                      user.grade = grade;
                      user.class1 = class1;
                      user.mobile = mobile;
                      user.classLength = 0;
                      user.studentNum = 0;
                      user.uidNum = 0;
                      user.teacherId = 'null';
                      user.teacherName = 'null';
                      user.classNo = 0
                      user.examDate = 'null';
                      user.feeStatus = 'null';
                      user.feesUpdate = 'null';
                      user.term = term;
                      user.amount = 0;
                      user.receiptNumber = 0;
                      user.year = year;
                      user.balance = adminBal;
                      user.balanceCarriedOver = 0;
                      user.status = 'owing';
                      user.paymentId = 'null';
                      user.prefix = 'null';
                      user.photo = req.body.file;
                      user.level = 'null';
                      user.pollUrl ='null';
                      user.annual = 0;
                      user.fees = 0
                      user.type = 'null';
                      user.address = address;
                      user.email = email
                      user.category = 'null';
                      user.subject = 0;
                      user.subjects = 'null'
                      user.subjectCode = 'null'
                      user.dept = 'null';
                      user.password = user.encryptPassword(password)
                      user.save()
                        .then(user =>{
                         
                        
                            
                          req.session.message = {
                            type:'success',
                            message:'Account Registered'
                          }  
                          Class1.find({}, function(err,docs){
                            var arr1 = docs;  
                          res.render('students/admit',{message:req.session.message,arr1:arr1,pro:pro});
                        })
                      })
                        .catch(err => console.log(err))
                      }
                      
                        })
                       }
                });

                 //importing students details from excel
  
  router.get('/import',isLoggedIn,records, function(req,res){
   
    var pro = req.user
    Class1.find({},function(err,docs){
  classes = docs.length;
  if(classes == 0){
    res.redirect('/records/addClass')
  }else
  res.render('imports/students',{pro:pro})
    })
  
  
    
  })
  
  
  
  
  
  router.post('/import',isLoggedIn,records, upload.single('file'),  (req,res)=>{
  
    var term = req.user.term;
    var year = req.user.year;
    var adminBal = req.user.balance
    var pro = req.user
  
    if(!req.file){
        req.session.message = {
          type:'errors',
          message:'Select File!'
        }     
          res.render('imports/students', {message:req.session.message,grower:req.body,admin:req.user.role=='admin',pro:pro}) 
        }else if (req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
            req.session.message = {
                type:'errors',
                message:'Upload Excel File'
              }     
                res.render('imports/students', {message:req.session.message,grower:req.body,admin:req.user.role=='admin', user:req.user,pro:pro
                     
                 }) 
  
  
  
        }
          
        else{
     

        
            const file = req.file.filename;
    
            
                 var wb =  xlsx.readFile('./public/uploads/' + file)
         
                 var sheets = wb.Sheets;
                 var sheetNames = wb.SheetNames;
     
                 var sheetName = wb.SheetNames[0];
     var sheet = wb.Sheets[sheetName ];
     
        for (var i = 0; i < wb.SheetNames.length; ++i) {
         var sheet = wb.Sheets[wb.SheetNames[i]];
     
         console.log(wb.SheetNames.length)
         var data =xlsx.utils.sheet_to_json(sheet)
             
         var newData = data.map(async function (record){
     
        
         
      
          
          try{
        
       
            
                
        
              
         
                   var user = new User();
                    user.uid = record.studentId;
                    user.name = record.name;
                    user.surname = record.surname;
                    user.gender = record.gender;
                    user.fullname = record.name +"  "+ record.surname;
                    user.dob= record.dob;
                    user.grade = record.grade;
                    user.class1 = record.class1;
                    user.mobile = record.mobile;
                    user.email = record.email;
                    user.address = record.address;
                    user.role = 'student';
                    user.classLength = 0;
                    user.studentNum = 0;
                    user.examDate = 'null';
                    user.feeStatus = 'null';
                    user.feesUpdate = 'null';
                    user.term = term;
                    user.year = year;
                    user.balance = adminBal;
                    user.balanceCarriedOver =0;
                    user.status = 'owing';
                    user.uidNum=0;
                    user.amount =0 ;
                    user.receiptNumber = 0;
                    user.studentId = 'null';
                    user.paymentId = 'null';
                    user.prefix = 'null';
                    user.photo = 'propic.jpg';
                    user.level = 'null';
                    user.pollUrl = 'null';
                    user.type = 'null';
                    user.annual = 0;
                    user.fees = 0
                    user.category = 'null';
                    user.subject = 0;
                    user.dept = 'null';
                    
                    user.subjects = 'null';
                    user.subjectCode = 'null'
                    user.teacherId = 'null';
                    user.teacherName = 'null';
                    user.classNo = 0;
                    user.password = user.encryptPassword(record.password)
  
                    
                     
                
              
                
                   await user.save()

             
                     
                     .then(user =>{ 
                     
  
                   
                      res.redirect('/records/studentList')
                  
                     })
                 
                   
                    // .catch(err => console.log(err))
                  }
                  catch(error){
                 
                  res.status(500).send( error.message  );

                    
                   }
                    })
                  
                  
         
                  }
                  
                  
                    
                    
        
                   
        
                    
             
                }
      
        
  
  
  })
  
  
  
  
  
  
  

//calendar
router.get('/calendar',isLoggedIn, function(req,res){
    var pro = req.user
  res.render('events/calendar',{pro:pro})
})

    

                  //adding event
  router.get('/addEvent',isLoggedIn, function(req,res){
    var pro = req.user
    res.render('events/event',{pro:pro})
  })
  

  router.post('/addEvent',isLoggedIn,  function(req,res){
    var title = req.body.title;
    var start = req.body.start;
    var end = req.body.end;
    var date = req.body.date;
    var userRole = req.body.role;
    var pro = req.user
  
      req.check('title','Enter Title').notEmpty();
      req.check('start','Time').notEmpty();
      req.check('end','Enter Finish Time').notEmpty();
      req.check('date','Enter Date').notEmpty();
      req.check('role','Enter User Role').notEmpty();
    
      
      var errors = req.validationErrors();
           
      if (errors) {
      
        req.session.errors = errors;
        req.session.success = false;
        res.render('events/event',{ errors:req.session.errors,pro:pro})
      
    }
    else{
      
        Calendar.findOne({'start':start, 'date':date})
        .then(clax =>{
            if(clax){ 
  
           req.session.message = {
            type:'errors',
             message:'Date & Time already in use'
           }     
              res.render('events/event', {
                 message:req.session.message ,pro:pro
              })
            }else
    
      var clas = new Calendar();
    
      clas.title = title;
      clas.start = date+"T"+start;
      clas.end = date+"T"+end;
      clas.userRole = userRole;
      
     
      
    
    
      clas.save()
        .then(clas =>{
         
          req.session.message = {
            type:'success',
            message:'Event added'
          }  
          res.render('events/event',{message:req.session.message,pro:pro});
      
    
      })
    
        .catch(err => console.log(err))
      
      
      })
    }
    
    
    
    
    
    
    })




  //student List 
  
  
  router.get('/studentList',isLoggedIn,(req, res) => {
   var pro = req.user
    User.find({role:"student"},(err, docs) => {
        if (!err) {
            res.render("students/list", {
                list: docs, pro:pro
                
            });
        }
        else {
            console.log('Error in retrieving Student list :' + err);
        }
    });
  });



   //adding student classes
   router.get('/addClass',isLoggedIn, function(req,res){
    var pro = req.user
    res.render('students/classX',{pro:pro})
  })
  
  
  
  router.post('/addClass',isLoggedIn,  function(req,res){
    var class1 = req.body.class1;
  var pro = req.user
      req.check('class1','Enter Class Name').notEmpty();
      req.check('grade','Enter Form Level').notEmpty();
    
      
      var errors = req.validationErrors();
           
      if (errors) {
      
        req.session.errors = errors;
        req.session.success = false;
        res.render('students/classX',{ errors:req.session.errors,pro:pro})
      
    }
    else{
      
        Class1.findOne({'class1':class1})
        .then(clax =>{
            if(clax){ 
  
           req.session.message = {
            type:'errors',
             message:'Class already exists'
           }     
              res.render('students/classX', {
                 message:req.session.message ,pro:pro
              })
            }else
    
      var clas = new Class1();
    
      clas.class1 = req.body.class1;
      clas.numberOfStudents = 0;
      clas.level = 0;
      clas.paid = 0;
      clas.unpaid = 0;
      clas.grade = req.body.grade;
      clas.companyId = 'null'
    
    
      clas.save()
        .then(clas =>{
         
          req.session.message = {
            type:'success',
            message:'Class added'
          }  
          res.render('students/classX',{message:req.session.message,pro:pro});
      
    
      })
    
        .catch(err => console.log(err))
      
      
      })
    }
    
    
    
    
    
    
    })
  
  
  
  
  
  //class list
router.get('/classList',isLoggedIn, (req, res) => {
 var pro = req.user
  Class1.find({},(err, docs) => {
      if (!err) {
          res.render("students/list2", {
             list:docs, pro:pro
            
          });
      }
  });
});

  


//add teachers
router.get('/addTeacher',isLoggedIn, upload.single('file'),  function(req,res){
   var pro = req.user
  var prefix = req.user.prefix
  var uidNum=req.user.uidNum
  Dept.find({},function(err,docs){
    var arr1 = docs;
  if(prefix == 'null'){
   res.redirect('/records/fix')
 }else if(docs.length == 0){
   res.redirect('/records/dept')
 }
 
   uidNum++;
   uid = prefix+uidNum;

   res.render('teachers/admit', {uid:uid, arr1:arr1,pro:pro});
   })

})

router.post('/addTeacher',isLoggedIn, function(req,res){
  var pro = req.user
var uid = req.body.uid;
var name = req.body.name;
var teacher = 'teacher'
var dept = req.body.dept
var surname = req.body.surname;
var role = 'teacher';
var mobile = req.body.mobile;
var gender = req.body.gender;
var dob = req.body.dob;
var class1 = 'null';
var fullname = name +" "+ surname 
var grade = 'null'
var id = req.user._id;
var email = req.body.email
var password = req.body.password;
var term = req.user.term;
var year = req.user.year;
var prefix = req.user.prefix
var uidNum=req.user.uidNum
var uid
var file = req.body.file;

uidNum++;
uid = prefix+uidNum;

req.check('name','Enter Name').notEmpty();
req.check('surname','Enter Surname').notEmpty();
req.check('dob','Enter Date Of Birth').notEmpty();
req.check('email','Enter email').notEmpty().isEmail();
req.check('uid','Enter Teacher ID').notEmpty();

req.check('gender','Enter Gender').notEmpty();
req.check('mobile', 'Enter Phone Number').notEmpty();
req.check('password', 'Password do not match').isLength({min: 4}).equals(req.body.confirmPassword);
    

      
   
var errors = req.validationErrors();
    if (errors) {
    
      req.session.errors = errors;
      req.session.success = false;
      res.render('teachers/admit',{user:req.body, errors:req.session.errors,uid:uid,pro:pro
  
})
    
  }
  else

 {
    User.findOne({'fullname':fullname, 'role':teacher})
    .then(user =>{
        if(user){ 
      // req.session.errors = errors
        //req.success.user = false;
        
       req.session.message = {
         type:'errors',
         message:'teacher already in the system'
       }     
       
          res.render('teachers/admit', {
              user:req.body, message:req.session.message, uid:uid, pro:pro
          }) 
        
  }
  
                else  {   
               

                  var user = new User();
                  user.uid = uid;
                  user.name = name;
                  user.fullname = name + " " + surname;
                  user.surname = surname;
                  user.role = role;
                  user.gender = gender;
                  user.grade = 0;
                  user.class1 = class1;
                  user.email = email
                  user.classLength = 0
                  user.mobile = mobile;
                  user.role = 'teacher';
                  user.classLength = 0;
                  user.studentNum = 0;
                  user.examDate = 'null';
                  user.feeStatus = 'null';
                  user.feesUpdate = 'null';
                  user.term = term;
                  user.year = year;
                  user.balance = 0;
                  user.balanceCarriedOver= 0;
                  user.dob=dob;
                  user.studentId ='null';
                  user.uidNum = 0;
                  user.amount = 0;
                  user.receiptNumber = 0;
                  user.status = 'null';
                  user.paymentId = 'null';
                  user.prefix = 'null';
                  user.photo = file;
                  user.level = 'null';
                  user.pollUrl='null'
                  user.annual =0
                  user.fees = 0
                  user.type = 'null';
                  user.address = req.body.address;
                  user.dept = dept;
                  user.subject = 0;
                  user.subjectCode = 'null'
                  user.subjects = 'null';
                  user.teacherId = 'null';
                  user.teacherName = 'null';
                  user.classNo = 0;
                  user.password = user.encryptPassword(password)

                  
                   
              
                   
          
                  user.save()
                    .then(user =>{
                     
                    
                      
                 
                      User.findByIdAndUpdate(id,{$set:{uidNum:uidNum}},function(err,locs){
                      
                      
                      res.redirect('/records/addTeacher')
                      })
                    
                  })
                    .catch(err => console.log(err))
                  }
                  
                    })
                   }
})


 //importing teachers details from excel
  
 router.get('/importTeacher',isLoggedIn,records, function(req,res){
   var pro = req.user
  res.render('imports/teacher',{pro:pro})
  
  
    
  })
  
  
  
   
  router.post('/importTeacher',isLoggedIn,records, upload.single('file'),function(req,res){
    var term = req.user.term;
    var year = req.user.year;
  
    if(!req.file){
        req.session.message = {
          type:'errors',
          message:'Select File!'
        }     
          res.render('imports/students', {message:req.session.message,grower:req.body,admin:req.user.role=='admin'}) 
        }else if (req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
            req.session.message = {
                type:'errors',
                message:'Upload Excel File'
              }     
                res.render('imports/teacher', {message:req.session.message,grower:req.body,admin:req.user.role=='admin', user:req.user
                     
                 }) 
  
  
  
        }
          
        else{
            const file = req.file.filename;
    
            
                 var wb =  xlsx.readFile('./public/uploads/' + file)
         
                 var sheets = wb.Sheets;
                 var sheetNames = wb.SheetNames;
     
                 var sheetName = wb.SheetNames[0];
     var sheet = wb.Sheets[sheetName ];
     
        for (var i = 0; i < wb.SheetNames.length; ++i) {
         var sheet = wb.Sheets[wb.SheetNames[i]];
     
         console.log(wb.SheetNames.length)
         var data =xlsx.utils.sheet_to_json(sheet)
             
         var newData = data.map(async function(record){
         var fullname = record.name + " " +  record.surname;
         var teacher = 'teacher'
  

          try{
        
        
         
             
                   var user = new User();
                   user.uid = record.teacherId;
                  user.name = record.name;
                  user.surname = record.surname;
                  user.gender = record.gender;
                  user.fullname = record.name +"  "+ record.surname;
                  user.dob= record.dob;
                  user.email = record.email
                  user.address = record.address;
                  user.dept = record.dept;
                  user.grade = 0;
                  user.class1 = 'null';
                  user.mobile = record.mobile;
                  user.role = 'teacher';
                  user.classLength = 0;
                  user.studentNum = 0;
                  user.examDate = 'null';
                  user.feeStatus = 'null';
                  user.feesUpdate = 'null';
                  user.term = term;
                  user.year = year;
                  user.balance = 0;
                  user.balanceCarriedOver = 0;
                  user.uidNum = 0;
                  user.amount = 0;
                  user.receiptNumber = 0;
                  user.studentId ='null';
                  user.status = 'null';
                  user.paymentId = 'null';
                  user.prefix = 'null';
                  user.photo = 'propic.jpg';
                  user.level = 'null';
                  user.pollUrl = 'null';
                  user.annual = 0
                  user.fees = 0
                  user.type = 'null';
                  
                 
                  user.subject = 0;
                  user.subjectCode = 'null'
                  user.subjects = 'null';
                  user.teacherId = 'null';
                  user.teacherName = 'null';
                  user.classNo = 0;
                  user.password = user.encryptPassword(record.password)
                    
                     
                
                     
            
                   await  user.save()
                     .then(user =>{ 
                     
  
                   
                      res.redirect('/records/teacherList')
                  
                     })
                    } catch(e){
                      res.send(e.message)
                     }
                  
                    // .catch(err => console.log(err))
                 
                     
                 
                     });
                   
                   
                    
             
         }
      
        }
  
  
  })
  

  


    //teacher List
router.get('/teacherList',isLoggedIn,(req, res) => {
  var pro = req.user
  User.find({role:"teacher"},(err, docs) => {
      if (!err) {
          res.render("teachers/list", {
              list: docs, pro:pro
              
          });
      }
      else {
          console.log('Error in retrieving Teachers list :' + err);
      }
  });
});



  
//adding departments

router.get('/dept',isLoggedIn, function(req,res){
  var pro = req.user
  res.render('subject/dept',{pro:pro})
})

router.post('/dept',isLoggedIn,  function(req,res){
     var pro = req.user
  var name = req.body.name;
  
 
      req.check('name','Enter Name Of Department').notEmpty();

    
      
      var errors = req.validationErrors();
           
      if (errors) {
      
        req.session.errors = errors;
        req.session.success = false;
        res.render('subject/dept',{ errors:req.session.errors,pro:pro})
      
    }
    else{
      
        Dept.findOne({'name':name})
        .then(dept =>{
            if(dept){ 
  
           req.session.message = {
            type:'errors',
             message:'Department already exists'
           }     
              res.render('subject/dept', {
                 message:req.session.message ,pro:pro
              })
            }else
    
      var dep = new Dept();
    
      dep.name = name;
     
   
    
    
      dep.save()
        .then(dep =>{
         
          req.session.message = {
            type:'success',
            message:'Department added'
          }  
          res.render('subject/dept',{message:req.session.message,pro:pro});
      
    
      })
    
        .catch(err => console.log(err))
      
      
      })
    }
    
    
})


//department List
router.get('/deptList',isLoggedIn, (req, res) => {
  var pro = req.user
  Dept.find({},(err, docs) => {
      if (!err) {
          res.render("subject/deptlist", {
             list:docs,pro:pro
            
          });
      }
  });
});


 //add subjects
 router.get('/subject',isLoggedIn, function(req,res){
  var pro = req.user
  Dept.find({},function(err,docs){
    var arr1 = docs;
    if(docs.length == 0){
      res.redirect('/records/dept')
    }else
  res.render('subject/add',{arr1:arr1,pro:pro})

  })
})

router.post('/subject',isLoggedIn,records,  function(req,res){
     var pro = req.user
  var name = req.body.name;
  var grade = req.body.grade;
  var dept = req.body.dept
  var code = req.body.code;
 
      req.check('name','Enter Name Of Subject').notEmpty();
      req.check('grade','Enter Grade/Level').notEmpty();
      req.check('dept','Enter Department').notEmpty();
      req.check('code','Enter Code Of Subject').notEmpty();
    
      
      var errors = req.validationErrors();
           
      if (errors) {
      
        req.session.errors = errors;
        req.session.success = false;
        res.render('subject/add',{ errors:req.session.errors,pro:pro})
      
    }
    else{
      
        Subject.findOne({'name':name, 'grade':grade})
        .then(subject =>{
            if(subject){ 
              Dept.find({},function(err,docs){
                var arr1 = docs;
           req.session.message = {
            type:'errors',
             message:'Subject already exists'
           }     
              res.render('subject/add', {
                 message:req.session.message ,arr1:arr1,pro:pro
              })
            })
            }else
    
      var sub = new Subject();
    
      sub.name = name;
       sub.grade = grade;
       sub.dept = dept
      sub.code = code;
   
    
    
      sub.save()
        .then(sub =>{
          Dept.find({},function(err,docs){
            var arr1 = docs;
          req.session.message = {
            type:'success',
            message:'Subject added'
          }  
          res.render('subject/add',{message:req.session.message, arr1:arr1,pro:pro});
        })
    
      })
    
        .catch(err => console.log(err))
      
      
      })
    }
    
    
})


router.get('/subjectList',isLoggedIn, (req, res) => {
  var pro = req.user
  Subject.find({},(err, docs) => {
      if (!err) {
          res.render("subject/list", {
             list:docs, pro:pro
            
          });
      }
  });
});

//update subject
router.get('/subject/:id',function(req,res){
     var pro = req.user
  Subject.findById(req.params.id, (err, doc) => {
    if (!err) {
    
        res.render("subject/update", {
           
            sub: doc,pro:pro
          
            
        });
      
    }
});



})


router.post('/subject/:id',isLoggedIn,records, upload.single('myFile'),  (req, res) => {
  var pro = req.user
  var id = req.body._id;
  var name = req.body.name;
  var code = req.body.code;
 
  
  req.check('name','Enter Name Of Subject').notEmpty();
  req.check('grade','Enter Grade/Form').notEmpty();
  req.check('code','Enter Subject Code').notEmpty();
 
  
    
  var errors = req.validationErrors();



   if (errors) {
  
     
        req.session.errors = errors;
        req.session.success = false;
        res.render('subject/update',{ errors:req.session.errors,pro:pro})
     
    
    }
  
else
{
 
        Subject.findOneAndUpdate({_id:id},req.body,
          { new: true }, (err, doc) => {
             if (!err) {
             
                res.redirect('/records/subjectList'); }
             else {
               console.log('error'+err)
       
             }
           
         })


    
}

});



  // this route is for deleting a subject
  router.get('/subject/delete/:id',isLoggedIn, (req, res) => {

    Subject.findByIdAndRemove(req.params.id, (err, doc) => {
      if (!err) {
          res.redirect('/records/subjectList');
      }
      else { console.log('Error in deleting subject :' + err); }
    });
    });











  //student registering subjects
  router.get('/studentSub',isLoggedIn,records,function(req,res){
   
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
       
     res.redirect('/records/dash')
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
    res.redirect('/records/subTotal')
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
      res.redirect('/records/dash')
    
    
    })
    })
  
    



//allocate subjects to teachers

  
    router.get('/teacherSubject',isLoggedIn, function(req,res){
      var pro = req.user
      Class1.find({},function(err,docs){
        Subject.find({},function(err,locs){
        var arr1 = docs;
        var arr = locs
      res.render('teachers/subjects',{arr1:arr1, arr:arr,pro:pro})
        })
      })
    })
    
    
    
    router.post('/teacherSubject', isLoggedIn, function(req,res){
      var pro = req.user
    var teacherId, subjectCode, grade, dept, id;
    var teacherName = req.body.teacherName;
    teacherId = req.body.uid;
    
    var subjectName = req.body.subjectName;
    var arr, arr1
    console.log(teacherName)
    
    
      
    req.check('teacherName','Enter Name Of Teacher').notEmpty();
  
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
    TeacherSub.findOne({'teacherName':teacherName,  'subjectName':subjectName})
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
    
    teacher.dept ='null';
    teacher.save()
    .then(teach =>{
                         
    id = teach._id;
    
    Subject.find({name:subjectName,},function(err,docs){
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
     res.redirect('/records/autoTS')
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
     res.redirect('/records/autoSub')
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
      res.redirect('/records/dash')
    
    
    })
    })
    
  
  
    router.get('/teacherSubList',isLoggedIn, (req, res) => {
       var pro = req.user
      TeacherSub.find({},(err, docs) => {
          if (!err) {
              res.render("records/teacherSubList", {
                 list:docs, pro:pro
                
              });
          }
      });
    });    




//adding lessons to timetable
router.get('/lessonBatch',isLoggedIn,records,function(req,res){
  var pro = req.user
  res.render('lesson/batch',{pro:pro})
  
  })
  
  router.post('/lessonBatch',isLoggedIn, records,function(req,res){
       var pro = req.user
  var uid = req.body.uid;
  var fullname = req.body.fullname;
  var id = req.user._id;
  
    req.check('uid','Enter Teacher ID').notEmpty();
    req.check('fullname','Enter Fullname').notEmpty();
   
    var errors = req.validationErrors();
    if (errors) {
   
      req.session.errors = errors;
      req.session.success = false;
      res.render('lesson/batch',{errors:req.session.errors,pro:pro})
   
    
   }
   else
  User.findOne({'fullname':fullname, 'uid':uid})
  .then(clax =>{
      if(clax){ 
     User.findByIdAndUpdate(id,{$set:{teacherName:fullname, teacherId:uid}},function(err,docs){
  console.log(id)
  
     })
     res.redirect('/records/lessonX')
  
      }else
  
      req.session.message = {
        type:'errors',
        message:'User does not exist'
      }   
    res.render('lesson/batch',{message:req.session.message, pro:pro});
    
  
  
  
    })
  
  })
  
  
  router.get('/lessonX',isLoggedIn,records,function(req,res){
    var pro = req.user
    res.redirect('/records/lesson')
  })
  
  router.get('/lesson',isLoggedIn,records,  function(req,res){
    var pro = req.user
   var fullname = req.user.teacherName;
   var teacherId = req.user.teacherId;
   var arr1 =[]
   Class1.find({},function(err,focs){
   Room.find({},(err, docs) => {
     arr1 = docs
     arr = focs
     if(docs == 0){
       res.redirect('/records/addRoom')
     }
  
  res.render('lesson/add-lesson',{fullname:fullname, teacherId:teacherId,arr:arr, arr1:arr1,pro:pro})
    })
  
   })
  
  })
  
  
  router.post('/lesson',isLoggedIn,records, function(req,res){
    var pro = req.user
    var m = moment()
    var year = m.format('YYYY')
    var month = m.format('MMMM')
    var day = req.body.day
    var fullname = req.user.teacherName;
    var teacherID = req.user.teacherId;
  var teacherName = req.body.teacherName;
  var teacherId = req.body.teacherId;
  var subjectName = req.body.subjectName
  var subjectCode = req.body.subjectCode
  var class1 = req.body.class1;
  var start = req.body.start;
  var room = req.body.room
  var finish = req.body.finish
  var term = req.user.term
  var arr1 = []
  
  
  
  req.check('teacherName','Enter Teacher Name').notEmpty();
  req.check('teacherId','Enter Teacher ID').notEmpty();
  req.check('subjectName','Enter Subject').notEmpty();
  req.check('subjectCode','Enter Subject Code').notEmpty();
  req.check('class1','Enter Class').notEmpty();
  req.check('day','Enter Day').notEmpty();
  req.check('start','Enter Start  Time').notEmpty();
  req.check('finish','Enter Finish Time').notEmpty();
  
  
  var errors = req.validationErrors();
       
  if (errors) {
    Room.find({},(err, wocs) => {
      Class1.find({},function(err,focs){
      arr1 = wocs
      arr = focs
    req.session.errors = errors;
    req.session.success = false
    res.render('lesson/add-lesson',{errors:req.session.errors, arr1:arr1, arr:arr,pro:pro})
    })
  })
    
  }
  
  else 
  {
  TeacherSub.findOne({'subjectCode':subjectCode})
  .then(teach=>{
    if(teach){
      Lesson.findOne({'subjectCode':subjectCode,'start':start, 'class1':class1})
      .then(lsn=>{
        if(lsn){
          Room.find({},(err, wocs) => {
            Class1.find({},function(err,focs){
              arr = focs
            arr1 = wocs
          req.session.message = {
            type:'errors',
            message:'Lesson Clash'
          }     
         
  res.render('lesson/add-lesson',{message:req.session.message,fullname:fullname, teacherId:teacherID,arr:arr, arr1:arr1,pro:pro})
        })
      })
        }
        else{
  
          var lesson = new Lesson();
      
     
          lesson.teacherName = teacherName;
          lesson.teacherId = teacherId;
          lesson.class1 = class1;
          lesson.subjectName = subjectName;
          lesson.subjectCode = subjectCode;
          lesson.start= start;
          lesson.finish = finish;
          lesson.time = start +" - "+ finish
          lesson.day = day;
          lesson.room = room
          lesson.term = term;
          lesson.year = year;
          lesson.month = month;
       
          
      
        lesson.save()
        .then(less =>{
          Room.find({},(err, wocs) => {
            Class1.find({},function(err,focs){
              arr=focs
            arr1 = wocs
          req.session.message = {
            type:'success',
            message:'Lesson Added Successfully'
          }     
         
  res.render('lesson/add-lesson',{message:req.session.message,fullname:fullname, teacherId:teacherID,arr:arr, arr1:arr1,pro:pro})
        })
      })
         
  
        })
  
  
        }
      
      })
    }
    else{
      Room.find({},(err, wocs) => {
        Class1.find({},function(err,focs){
          arr = focs
        arr1 = wocs
      req.session.message = {
        type:'errors',
        message:'Subject Code does not exist'
      }     
         res.render('lesson/add-lesson', {
            message:req.session.message, fullname:fullname, teacherId:teacherID,arr:arr, arr1:arr1,pro:pro})
         })
        })
        
    }
  })
  
  
  }
  
  
  
  
  })
  
  
  
    //role admin
   //this routes autocompletes the fullname of the teacher to be allocated a lesson
   router.get('/autocompleteLBX/',isLoggedIn, function(req, res, next) {
  
  
    var regex= new RegExp(req.query["term"],'i');
   var teacherId = req.user.teacherId
    var uidFilter =TeacherSub.find({subjectCode:regex,teacherId:teacherId},{'subjectCode':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
  
    
    uidFilter.exec(function(err,data){
   
  
  console.log('data',data)
  
  var result=[];
  
  if(!err){
     if(data && data.length && data.length>0){
       data.forEach(sub=>{
  
        
     
  
          
         let obj={
           id:sub._id,
           label: sub.subjectCode,
  
       
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
  router.post('/autoLBX',isLoggedIn,function(req,res){
    var code = req.body.code
  
  
  
    TeacherSub.find({subjectCode:code},function(err,docs){
   if(docs == undefined){
     res.redirect('/records/lesson')
   }else
  
      res.send(docs[0])
    })
  
  
  })
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
    //role admin
   //this routes autocompletes the fullname of the teacher to be allocated a lesson
   router.get('/autocompleteLB/',isLoggedIn, function(req, res, next) {
  
  
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
    router.post('/autoLB',isLoggedIn,function(req,res){
      var fullname = req.body.code
  
    
  
      User.find({fullname:fullname},function(err,docs){
     if(docs == undefined){
       res.redirect('/records/lesson')
     }else
    
        res.send(docs[0])
      })
    
    
    })
    
  
    //role admin - lesson batch
   //this routes autocompletes the fullname of the teacher to be allocated a lesson
   router.get('/autocompleteLBL/',isLoggedIn, function(req, res, next) {
  
  
    var regex= new RegExp(req.query["term"],'i');
   
    var uidFilter =User.find({uid:regex, role:"teacher"},{'uid':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
  
    
    uidFilter.exec(function(err,data){
   
  
  console.log('data',data)
  
  var result=[];
  
  if(!err){
     if(data && data.length && data.length>0){
       data.forEach(user=>{
  
        
     
  
          
         let obj={
           id:user._id,
           label: user.uid,
  
       
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
  router.post('/autoLBL',isLoggedIn,function(req,res){
    var uid = req.body.code
  
  
  
    User.find({uid:uid},function(err,docs){
   if(docs == undefined){
     res.redirect('/lesson')
   }else
  
      res.send(docs[0])
    })
  
  
  })
  
  
  
  
  

      //student lesson timetable
      router.get('/timetable',isLoggedIn, (req, res) => {
        var pro = req.user
        var term = req.user.term
        var arr= []
        Lesson.find({term:term},(err, docs) => {
          for(var i = 0; i<docs.length; i++){
            arr.push(docs[i].start)
          }
            if (!err) {
                res.render("lesson/timetableAdmin", {
                   list:docs,arr:arr,pro:pro
                  
                });
            }
        });
      });
    
    
      router.get('/addRoom',isLoggedIn, (req,res)=>{
        var pro = req.user
        res.render('lesson/room',{pro:pro})
      })
    
    
      router.post('/addRoom', isLoggedIn, (req,res)=>{
        var pro = req.user
    
        var room = req.body.room;
    
        req.check('room','Enter Classroom').notEmpty();
       
      
        
        var errors = req.validationErrors();
             
        if (errors) {
        
          req.session.errors = errors;
          req.session.success = false;
          res.render('lesson/room',{ errors:req.session.errors,pro:pro})
        
      }
      else{
        
          Room.findOne({'name':room})
          .then(clax =>{
              if(clax){ 
    
             req.session.message = {
              type:'errors',
               message:'Classroom already exists'
             }     
                res.render('lesson/room', {
                   message:req.session.message ,pro:pro
                })
              }else
      
        var rom = new Room();
      
        rom.name = room;
       
      
      
        rom.save()
          .then(romm =>{
           
            req.session.message = {
              type:'success',
              message:'Classroom added'
            }  
            res.render('lesson/room',{message:req.session.message,pro:pro});
        
      
        })
      
          .catch(err => console.log(err))
        
        
        })
      }
      
      
      
    
    
    
    
      })
        






 
    
    
    
    
    
    //role - all
    //exam timetable
    router.get('/roomList',isLoggedIn, (req, res) => {
      var pro = req.user
      Room.find({},(err, docs) => {
          if (!err) {
              res.render("lesson/roomList", {
                 list:docs,pro:pro
                
              });
          }
      });
    });
    
  







    
  //role admin
  //new term fees update
  router.get('/termInfo',isLoggedIn, function(req,res){
    var m = moment()
    var pro = req.user
    var year = m.format('YYYY')
    var term = req.user.term
   
  
  FeesUpdate.find({term:term, year:year},(err, docs) => {
      if (!err) {
          res.render("records/newTerm", {
             list:docs, pro:pro
            
          });
      }
  });
    
      })
      router.post('/feesUpdate',isLoggedIn,records,  function(req,res){
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
       res.render('records/feesUpdate',{errors:req.session.errors})
    
     
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
    User.find({},function(err,vocs){
      for(var n = 0; n<vocs.length; n++){
        User.findByIdAndUpdate(vocs[n]._id,{$set:{term:term}},function(err,qocs){
          
        })
      
      }
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
      res.redirect('/records/feesUpdate')
      })
    })
      
      })
    














 //new term fees update
 router.get('/feesUpdate',isLoggedIn,records, function(req,res){
  var id = req.user.feesUpdate;
  var m = moment()
  var day = moment().toString()
  var days, endDate;
  var user = req.user.feesUpdate
  if(user == 'null'){
  

  
      res.render('records/feesUpdate')

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
      res.render('students/feesUpdate2',{readonly:readonly,day:day, title:title})
  
    }else
  
    readonly = " ";
    console.log(readonly)
  title = ' Update '
      res.render('students/feesUpdate',{readonly:readonly,day:day,title:title})
    
    }catch(e){
      res.send(e.message)
     }
  
  
  })
  
  
    })
    
    router.post('/feesUpdate',isLoggedIn,records,  function(req,res){
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
     res.render('records/feesUpdate',{errors:req.session.errors})
  
   
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
  User.find({},function(err,vocs){
    for(var n = 0; n<vocs.length; n++){
      User.findByIdAndUpdate(vocs[n]._id,{$set:{term:term}},function(err,qocs){
        
      })
    
    }
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
    res.redirect('/records/feesUpdate')
    })
  })
    
    })
  




        
      //role - admin & teacher
      //add exam
      router.get('/examSchedule',isLoggedIn,records,  function(req,res){
           var pro = req.user
        var arr = []
        var arr1 = []
        var arr2 = []
 
          Room.find({}, function(err,docs){
          
          arr1 = docs
          
        res.render('exam/exam-schedule',{ arr1:arr1,pro:pro})
       
      })
    })
    
    router.post('/examSchedule',isLoggedIn,records,  function(req,res){
      var pro = req.user
      var examType = req.body.examType;
      var subject = req.body.subject;
      var subjectCode = req.body.subjectCode;
      var grade = req.body.grade;
      var time = req.body.time;
      var date = req.body.date;
      var teacherName = req.body.teacherName;
      var uid = req.body.uid;
      var room = req.body.room;
      var start = req.body.start;
      var finish = req.body.finish
 
      let arr1 = []
    
      
        req.check('examType','Enter Exam Type').notEmpty();
        req.check('subject','Enter Subject ').notEmpty();
        req.check('subjectCode','Enter Subject Code').notEmpty();
        req.check('grade','Enter Grade/Form').notEmpty();
        req.check('start','Enter Start  Time').notEmpty();
        req.check('finish','Enter Finish Time').notEmpty();
        req.check('date','Enter Date').notEmpty();
        req.check('room','Enter Exam Room').notEmpty();
       
      
        var errors = req.validationErrors();
           
        if (errors) {
          Room.find({}, function(err,docs){
          
            arr1 = docs
           
          req.session.errors = errors;
          req.session.success = false
          res.render('exam/exam-schedule',{errors:req.session.errors, arr1:arr1, pro:pro})
          })
          
        }
      else
      {
       
        Exam.findOne({'examType':examType, 'subject':subject, 'grade':grade, 'time':time, 'date':date, 'room':room})
            .then(ex =>{
              if(ex){ 
               
                Room.find({}, function(err,docs){
          
                  arr1 = docs
              
                req.session.message = {
                  type:'errors',
                  message:'Exam already Exists'
                }     
                   res.render('exam/exam-schedule', {
                      message:req.session.message,arr1:arr1, pro:pro })
                
                
                
                })
        
              }
    
    else{
    
    
    
    
    
    
            var exam = new Exam();
          
            exam.examType = examType;
            exam.subject = subject;
            exam.grade = grade;
            exam.teacherName = teacherName;
            exam.uid = uid;
            exam.subjectCode = subjectCode;
            exam.start= start;
            exam.finish = finish;
            exam.time = start +" - "+ finish
            exam.date = date;
            exam.room = room;
            
          
            exam.save()
              .then(exm =>{
               
                Room.find({}, function(err,docs){
          
                  arr1 = docs
              
                req.session.message = {
                  type:'succes',
                   message:'Exam added'
                 }     
                    res.render('exam/exam-schedule', {
                       message:req.session.message ,arr1:arr1,pro:pro
                    })
                
                })
      
                })
      
      
      
              
      
      
      
            
          }
          })
      
        }
        
    })
      
    
    
    //exam autocomplete
    
      //role admin
     //this routes autocompletes the fullname of the teacher to be allocated a lesson
     router.get('/autocompleteXM/',isLoggedIn, function(req, res, next) {
    
    
      var regex= new RegExp(req.query["term"],'i');
      var uidFilter =Subject.find({code:regex},{'code':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    
      
      uidFilter.exec(function(err,data){
     
    
    console.log('data',data)
    
    var result=[];
    
    if(!err){
       if(data && data.length && data.length>0){
         data.forEach(sub=>{
    
          
       
    
            
           let obj={
             id:sub._id,
             label: sub.code,
    
         
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
    router.post('/autoXM',isLoggedIn,function(req,res){
      var code = req.body.code
    
    
    
      Subject.find({code:code},function(err,docs){
     if(docs == undefined){
       res.redirect('/records/lesson')
     }else
    
        res.send(docs[0])
      })
    
    
    })
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    //role - all
    //exam timetable
    router.get('/examList',isLoggedIn, (req, res) => {
      var pro = req.user
      Exam.find({},(err, docs) => {
          if (!err) {
              res.render("records/examList", {
                 list:docs, pro:pro
                
              });
          }
      });
    });
    
    
    
    
    
    
    
    
    
    
    //role - admin
    //add exam grade
    router.get('/examGrade',isLoggedIn,records, function(req,res){
      var pro = req.user
      res.render('exam/exam-grade',{pro:pro})
    })
    
    
    router.post('/examGrade',isLoggedIn,records, function(req,res){
      var pro = req.user
      var symbol = req.body.symbol;
      var from = req.body.from;
      var to = req.body.to;
      var comments = req.body.comments;
    
      
        req.check('symbol','Enter Grade Symbol').notEmpty();
        req.check('from','Enter mark ').notEmpty();
        req.check('to','Enter mark').notEmpty();
        req.check('comments','Enter coments').notEmpty();
       
      
        var errors = req.validationErrors();
           
        if (errors) {
          
          req.session.errors = errors;
          req.session.success = false
          res.render('exam/exam-grade',{errors:req.session.errors,pro:pro})
        }
      else
      {
       
        Grade.findOne({'symbol':symbol})
            .then(grad =>{
              if(grad){ 
               
          
                req.session.message = {
                  type:'errors',
                  message:'Symbol Exists'
                }     
                   res.render('exam/exam-grade', {
                      message:req.session.message,pro:pro })
                
        
              }
    
    else{
    
    
    
    
    
    
            var grade = new Grade();
          
            grade.symbol = symbol;
            grade.from = from;
            grade.to = to;
            grade.comments = comments;
            
          
            grade.save()
              .then(grade =>{
               
      
                res.redirect('/records/gradeList')
      
                })
      
      
      
              
      
      
      
            
          }
          })
      
        }
        
    
       
      })
      
    
      //role - admin
      //grade List
      router.get('/gradeList',isLoggedIn,records, (req, res) => {
        var pro = req.user
        Grade.find({},(err, docs) => {
            if (!err) {
                res.render("exam/glist", {
                   list:docs, pro:pro
                  
                });
            }
        });
      });
    
    
    
    //update exam grade
    router.get('/examGrade/:id',function(req,res){
      var pro = req.user
      Grade.findById(req.params.id, (err, doc) => {
        if (!err) {
        
            res.render("exam/examGradeUpdate", {
               
                exam: doc,pro:pro
              
                
            });
          
        }
    });
    
    
    
    })
    
    
    router.post('/examGrade/:id',isLoggedIn,records, upload.single('myFile'),  (req, res) => {
      var pro = req.user
      var id = req.body._id;
      var symbol = req.body.name;
      var from = req.body.code;
      var to = req.body.to
     
      
      req.check('symbol','Enter Symbol').notEmpty();
      req.check('from','Enter the Starting Grade range').notEmpty();
      req.check('to','Enter the End Grade range').notEmpty();
     
      
        
      var errors = req.validationErrors();
    
    
    
       if (errors) {
      
         
            req.session.errors = errors;
            req.session.success = false;
            res.render('exam/examGradeUpdate',{ errors:req.session.errors, pro:pro})
         
        
        }
      
    else
    {
     
            Grade.findOneAndUpdate({_id:id},req.body,
              { new: true }, (err, doc) => {
                 if (!err) {
                 
                    res.redirect('/records/gradeList'); }
                 else {
                   console.log('error'+err)
           
                 }
               
             })
    
    
        
    }
    
    });
    
    
    
      // this route is for deleting a subject
      router.get('/examGrade/delete/:id',isLoggedIn, (req, res) => {
        Grade.findByIdAndRemove(req.params.id, (err, doc) => {
          if (!err) {
              res.redirect('/records/gradeList');
          }
          else { console.log('Error in deleting exam grade :' + err); }
        });
        });
 
  
  
  
  

  module.exports = router;

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else{
        res.redirect('/')
    }
  }
  
   
  function records(req,res,next){
    if(req.user.role == 'records'){
      return next()
    }
    res.render('errors/access')
    }  






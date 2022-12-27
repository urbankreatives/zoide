require('dotenv').config();
require("../config5/keys")
var express = require('express');
var router = express.Router();
const User =require('../models/user')
const Class1 =require('../models/class');
const Subject =require('../models/subject');
const Fees =require('../models/fees');
const Calendar =require('../models/calendar');
const Student =require('../models/studentStats');
const Grade =require('../models/grade');
const Level =require('../models/level');
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
    var companyId = req.user.companyId
    var m = moment()
    var year = m.format('YYYY')
  User.find({companyId:companyId,role:'student'},function(err,nocs){
    students = nocs.length
    
  User.find({companyId:companyId,role:'teacher'},function(err,nocs){
    teachers = nocs.length;
    User.find({companyId:companyId,role:'student',status:'paid'},function(err,rocs){
   paid = rocs.length;
  
   User.find({companyId:companyId,role:'student',status:'owing'},function(err,locs){
     unpaid =locs.length

     Dept.find({companyId:companyId},function(err,jocs){
      depts = jocs.length;
     
      Class1.find({companyId:companyId},function(err,klocs){
        class1 = klocs.length

  
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
  
    res.redirect('/records/gradeUpdate')
  
  })
  }
  else

  var id = docs[0]._id
  console.log(students,'students',teachers,'teachers',class1,'class1',depts,'depts', paid,'paid',unpaid,'unpaid')
  Stats.findByIdAndUpdate(id,{$set:{students:students, teachers:teachers,paid:paid, unpaid:unpaid, class1:class1, depts:depts}},function(err,tocs){


    
  })
  
  res.redirect('/records/gradeUpdate')

  
  

  
  })
  
    
})
     })
     
   })
  
  
    })
  })
  
  })
  
    
  })





router.get('/gradeUpdate',isLoggedIn,function(req,res){
var companyId = req.user.companyId
console.log('companyId',companyId)
  User.find({companyId:companyId,role:'student'},function(err,docs){
    console.log(docs,'docs')
    for(var i = 0;i<docs.length;i++){
     let grade = docs[i].grade
     let id = docs[i]._id
     console.log(grade,'grade')
     Level.find({grade:grade,companyId:companyId},function(err,tocs){
       let levelX = tocs[0].levelX
       console.log('levelX',levelX)
User.findByIdAndUpdate(id,{$set:{levelX:levelX}},function(err,jocs){

})
     })
  
    }
    res.redirect('/records/idUp')
  })
})



router.get('/idUp',isLoggedIn,function(req,res){
  var id = req.user._id
  var companyId = req.user.companyId
  var total
  var num
  var idNumX = req.user.idNumX
  
  
  User.find({companyId:companyId},function(err,docs){
  num = docs.length
  total = idNumX + docs.length;
  
  
  User.findByIdAndUpdate(id,{$set:{actualCount:num}},function(err,locs){
  
  })
  

res.redirect('/records/classcheck')

})


})



router.get('/classcheck',isLoggedIn,function(req,res){
  var companyId = req.user.companyId
  Class1.find({companyId:companyId},function(err,docs){
    for(var i= 0;i<docs.length;i++){
      let classX = docs[i].class1
      let id = docs[i]._id
      User.find({companyId:companyId,class1:docs[i].class1},function(err,gocs){
let students = gocs.length;
User.find({companyId:companyId,class1:classX, status:'paid'},function(err,yocs){
  let paid = yocs.length;

  User.find({companyId:companyId,class1:classX,status:'owing'},function(err,locs){
    let unpaid= locs.length

    User.find({companyId:companyId,class1:classX,gender:'male'},function(err,xocs){
      let male= xocs.length

      User.find({companyId:companyId,class1:classX,gender:'female'},function(err,zocs){
        let female= zocs.length

    Class1.findByIdAndUpdate(id,{$set:{numberOfStudents:students, paid:paid,unpaid:unpaid,male:male,female:female}},function(err,vocs){

    })
  })
  })
})


})

      })
    
    }
    res.redirect('/records/yearUpdate')
  })
})



router.get('/yearUpdate',isLoggedIn,function(req,res){
  var m = moment()
  var year = m.format('YYYY')
  var startYear = req.user.startYear
  var currentYearCount = year - startYear
  console.log(year, startYear)
  console.log(currentYearCount)
var companyId = req.user.companyId
 User.find({companyId:companyId},function(err,docs){



for(var i = 0;i<docs.length;i++){
  let id = docs[i]._id

  User.findByIdAndUpdate(id,{$set:{currentYearCount:currentYearCount}},function(err,gocs){

  })

}

res.redirect('/records/yearUpdateX')
 })

})



router.get('/yearUpdateX',isLoggedIn,function(req,res){
  var m = moment()
  var year = m.format('YYYY')
  var startYear = req.user.startYear

var companyId = req.user.companyId
 User.find({role:'student', companyId:companyId},function(err,docs){
for(var i = 0;i<docs.length;i++){
  let id = docs[i]._id
  let admissionYear = docs[i].admissionYear
  let stdYearCount = admissionYear - startYear

  User.findByIdAndUpdate(id,{$set:{stdYearCount:stdYearCount}},function(err,gocs){
    
  })
}
res.redirect('/records/actUpdate')

 })

})



router.get('/actUpdate',isLoggedIn,function(req,res){
  var id = req.user._id
  
  var companyId = req.user.companyId
  User.find({companyId:companyId,role:"admin"},function(err,docs){
  console.log(docs,"docs")
  if(docs.length ===  0){
    res.redirect('/records/feeUpdate')
  }else{
  
  
  
  status3 = docs[0].status3;
  status4 = docs[0].status4

  console.log(status3, status4, 'zvfa')
  
  User.find({companyId:companyId},function(err,pocs){

  for(var i = 0; i<pocs.length; i++){

 
  
  User.findByIdAndUpdate(pocs[i]._id,{$set:{status3:status3, status4:status4}},function(err,locs){
  
  
  
  })
}
})
  
  res.redirect('/records/feeUpdate')
  
  }
  
  })
  
  
  
  
  })













router.get('/feeUpdate',isLoggedIn,function(req,res){
var id = req.user._id
var fees, annual
var companyId = req.user.companyId
User.find({companyId:companyId,role:"clerk"},function(err,docs){
console.log(docs,"docs")
if(docs.length ===  0){
  res.redirect('/records/std')
}else{



fees = docs[0].fees;
annual = docs[0].annual

console.log(fees,annual)

User.findByIdAndUpdate(id,{$set:{fees:fees, annual:annual}},function(err,locs){



})

res.redirect('/records/std')

}

})




})

router.get('/std',isLoggedIn,function(req,res){
  var companyId = req.user.companyId
  var m = moment()
  var year = m.format('YYYY')
  var currCount = req.user.currentYearCount
  var startYear = req.user.startYear
  console.log(currCount,'currCount')
  Student.find({companyId:companyId},function(err,locs){
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

  User.find({companyId:companyId,role:'student',state:'new', stdYearCount:currCount},function(err,docs){
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
   res.redirect('/records/dash')
    
      })


})

    }else{
Student.find({companyId:companyId},function(err,docs){
  
  User.find({companyId:companyId,role:'student',state:'new', stdYearCount:currCount},function(err,nocs){
    if(nocs){

   
    let total = nocs.length;
    console.log('totalxxx',total)

  
let id = docs[0]._id;

if(currCount == 0){
  Student.findByIdAndUpdate(id,{$set:{year1:total,count:currCount,startYear:startYear}},function(err,locs){

  })
} 


    else  if(currCount == 1){
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
     console.log('docs')
    }
    })
    res.redirect('/records/dash')
    })
    }
  })
  

})






  
  router.get('/dash',isLoggedIn,function(req,res){
   var pro = req.user
      res.render('dashboard/records',{pro:pro})
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

//student stats
      router.post('/stdStatsChart99',isLoggedIn, function(req,res){
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
    
      //calendar
  
      router.post('/calendarChart',isLoggedIn,function(req,res){
        var companyId = req.user.companyId
        Calendar.find({companyId:companyId},function(err,docs){
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
  
  
  
  
  })

//setting ID prefix  
router.get('/fix',isLoggedIn,function(req,res){
  var id = req.user._id
 var readonly
 var prefix 
   User.find({_id:id},function(err,noc){
     if(noc[0].prefix == 'null'){
       console.log('good')
       readonly = '';
     }else{
     readonly = 'readonly'
     prefix = noc[0].prefix
     }
 
     res.render('users/fix',{readonly:readonly,prefix:prefix})
   })    
 })
 
 router.post('/fix',isLoggedIn,function(req,res){
  
 var prefix = req.body.prefix
 var id = req.user._id
   req.check('prefix','Enter Prefix').notEmpty().isString();
  
      
   var errors = req.validationErrors();
       if (errors) {
 
         req.session.errors = errors;
         req.session.success = false;
         res.render('users/fix',{user:req.body, errors:req.session.errors,
     })
   }
 
 
   User.findByIdAndUpdate(id,{$set:{prefix:prefix}},function(err,docs){
     res.redirect('/fix')
   })
 
 
 })
 











      //add student

router.get('/addStudent',isLoggedIn,  function(req,res){
var pro = req.user
var actualCount = req.user.actualCount
var count = req.user.count
var prefix = req.user.prefix
var title, readonly
var idNum=req.user.idNumber
idNum++
var uid = prefix+idNum
var companyId = req.user.companyId
if(actualCount < count){

  Class1.find({companyId:companyId},function(err,docs){
    Level.find({companyId:companyId},function(err,gocs){

   var arr = gocs
    var arr1 = docs;
    title = "Add Students"
    readonly =" "
   var classes = docs.length;
    if(classes == 0){
      res.redirect('/records/addClass')
    }else
    res.render('students/admit',{arr1:arr1,arr:arr,pro:pro,uid1:uid,title:title,readonly:readonly})
      
    })
  })

}else


res.redirect('/records/addStudentX')
  
})


router.post('/addStudent',isLoggedIn,upload.single('file'),function(req, res, next) {
  var m = moment()
  var m = moment()
  var year = m.format('YYYY')
  var pro = req.user
    var adminBal = req.user.balance
    var uid = req.body.uid;
    var grade = req.body.grade
    var name = req.body.name;
    var surname = req.body.surname;
    var fullname= name +" "+ surname
    var role = 'student';
    var suffix = 'null';
    var expdate = req.user.expdate
    var expStr = req.user.expStr
    var address = req.body.address
    var mobile = req.body.mobile;
    var gender = req.body.gender;
    var dob = req.body.dob;
  var email = req.body.email
    var class1 = req.body.class1;
  

    var idNumber = req.user.idNumber;
    var schoolName = req.user.schoolName;
    var password = req.body.password;
    var term = req.user.term
    idNumber++
    var companyId = req.user.companyId
    var prefix = req.user.prefix
    var photo = req.body.file
    var id = req.user._id
    var count = req.user.count
    var actualCount = req.user.actualCount
   var uid1 = prefix+idNumber
  
   console.log(grade,'gradeX')
  

  
   
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
                      user.fullname = fullname;
                      user.surname = surname;
                      user.role = 'student';
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
                      user.idNumber = idNumber;
                      user.schoolName = 'null';
                      user.receiptNumber = 0;
                      user.year = year;
                      user.prefix = prefix
                      user.balance = adminBal;
                      user.balanceCarriedOver = 0;
                      user.status = 'owing';
                      user.status4 = 'null';
                      user.number = 0;
                      user.paymentId = 'null';
                      user.suffix = suffix;
                      user.photo = "propic.jpg";
                      user.level = 'null';
                      user.levelX = 'normal';
                      user.pollUrl ='null';
                      user.annual = 0;
                      user.fees = 0;
                      user.state = 'new'
                      user.companyId = companyId
                      user.idNumber = 0;
                      user.idNumX = 0
                      user.recNumber=0
                      user.type = 'null';
                      user.address = address;
                      user.email = email
                      user.category = 'null';
                      user.subject = 0;
                      user.subjects = 'null'
                      user.subjectCode = 'null'
                      user.dept = 'null';
                      user.paynow = 0
                      user.password = user.encryptPassword(password)
                      user.expdate=expdate;
                      user.expStr = expStr;    
                      user.status3 = "null"
                      user.pollUrl2 = "null"
                      user.count=count
                      user.pollCount = 0
                      user.actualCount = actualCount
                      user.startYear = year
                      user.currentYearCount = 0
                      user.stdYearCount = 0
                      user.admissionYear = year 
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
    var actualCount = req.user.actualCount
    var count = req.user.count
    var pro = req.user
    var m = moment()
    var year = m.format('YYYY')
    var title
    var readonly 
    var companyId = req.user.companyId
    if(actualCount < count ){
      Class1.find({companyId:companyId},function(err,docs){
        title = "Import Students"
        readonly = ""
        classes = docs.length;
        if(classes == 0){
          res.redirect('/records/addClass')
        }else
        res.render('imports/students',{pro:pro})
          })
        
        
    }else

  res.redirect('/records/importX')
      
   
   
    
  })
  
  
  router.get('/importX',isLoggedIn,function(req,res){
    var pro = req.user
    res.render('imports/studentX',{pro:pro})
  })
  

  
  

  
  router.post('/import',isLoggedIn,records, upload.single('file'),  (req,res)=>{
    var count = req.user.actualCount
    var m = moment()
 
    
    var adminBal = req.user.balance
    var pro = req.user
    var id =   req.user._id
    var idNumber = req.user.idNumber
    var count = req.user.count
    var actualCount = req.user.actualCount
  
  /*  if(!req.file){
        req.session.message = {
          type:'errors',
          message:'Select File!'
        }     
          res.render('imports/students', {message:req.session.message,pro:pro}) */
     if (!req.file || req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
            req.session.message = {
                type:'errors',
                message:'Upload Excel File'
              }     
                res.render('imports/students', {message:req.session.message,pro:pro
                     
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
             
         var newData = data.map(function (record){
     
        
       
      
          
         
        
            let levelX
            let adminBal = req.user.balance
            let uid = record.uid;
            let name = record.name;
            let surname = record.surname;
            let fullname = name +" "+ surname
            let role = 'student';
            let address = record.address
            let mobile = record.mobile;
            let gender = record.gender;
            let dob = record.dob;
            let email = record.email
            let class1 = record.class1;
            let grade = record.grade
            let password = record.password;
            let term = req.user.term
            var year = m.format('YYYY')
            let suffix = 'null'
            let prefix = req.user.prefix
            let num = record.num
            let expdate = req.user.expdate
            let expStr = req.user.expStr
            let companyId = req.user.companyId
            let photo = 'propic.jpg'

          

req.body.uid = record.uid     
req.body.name = record.name  
req.body.surname = record.surname  
req.body.email = record.email  
req.body.dob = record.dob  
req.body.address = record.address 
req.body.grade = record.grade  
req.body.class1 = record.class1 
req.body.gender = record.gender
req.body.mobile = record.mobile  
req.body.password = record.password             

            
        
            try{
              req.check('uid','Enter uid').notEmpty();
              req.check('name','Enter Name').notEmpty();
              req.check('surname','Enter Surname').notEmpty();
              req.check('email','Enter email').notEmpty();
              req.check('email','Enter valid email').notEmpty().isEmail();
              req.check('dob','Enter Date Of Birth').notEmpty();
              req.check('address','Enter Address').notEmpty();
              req.check('grade','Enter Grade/Form').notEmpty();
              req.check('grade','Grade must be numeric').notEmpty().isNumeric();
              req.check('uid','Enter Student ID').notEmpty();
              req.check('class1','Enter Student Class').notEmpty();
              req.check('gender','Enter Gender').notEmpty();
              req.check('mobile', 'Enter Phone Number').notEmpty()


              var errors = req.validationErrors();
  
              if (errors) {
                
                req.session.errors = errors;
                req.session.success = false;
                for(let x=0;x<req.session.errors.length;x++){
                  throw new SyntaxError(req.session.errors[x].msg +" "+"on line"+" "+ num)
                }
              
          }
else

/*
         
            const token = jwt.sign({uid, name,surname,grade, suffix,class1,address,adminBal,count,actualCount,  fullname,mobile,gender,dob,role,term,year,expdate,expStr,photo, companyId, email,prefix, password, }, JWT_KEY, { expiresIn: '100000m' });
            const CLIENT_URL = 'http://' + req.headers.host;
      
            const output = `
            <h2>Please click on below link to activate your account</h2>
            <a href="${CLIENT_URL}/records/activate3/${token}">click here</a>
            <h1> User credentials</h1>
            <p>userID:${uid}</p>
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
                to: record.email, // list of receivers
                subject: "Account Verification ✔", // Subject line
                html: output, // html body
            };
      
          await transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error)
            
             req.session.message = {
               type:'errors',
               message:'confirmation emails not sent'
             }
             
             res.render('imports/students', {
              message:req.session.message ,pro:pro
         }) 
         
          
                }
                else {
                    console.log('Mail sent : %s', info.response);
                    
                    idNumber++
              
                    User.findByIdAndUpdate(id,{$set:{idNumber:idNumber}},function(err,locs){
                    req.session.message = {
                      type:'success',
                      message:'confirmation emails sent to students'
                    }     
                    
                    res.render('imports/students', {
                      message:req.session.message ,pro:pro
                 
                })
              })
                }
            })
       
*/
{
  User.findOne({'uid':uid})
  .then(user =>{
      if(user){ 
    // req.session.errors = errors
      //req.success.user = false;



     req.session.message = {
       type:'errors',
       message:'user id already in use'
     }     
     
        res.render('imports/students', {
             message:req.session.message ,pro:pro
        }) 
    
}
else



          
var user = new User();
user.uid = uid;
user.name = name;
user.fullname = fullname;
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
user.idNumber = idNumber;
user.schoolName = 'null';
user.receiptNumber = 0;
user.year = year;
user.prefix = prefix
user.balance = adminBal;
user.balanceCarriedOver = 0;
user.status = 'owing';
user.status4 = 'null';
user.number = 0;
user.paymentId = 'null';
user.suffix = suffix;
user.photo = "propic.jpg";
user.level = 'null';
user.levelX = 'normal';
user.pollUrl ='null';
user.annual = 0;
user.fees = 0;
user.state = 'new'
user.companyId = companyId
user.idNumber = 0;
user.idNumX = 0
user.recNumber=0
user.type = 'null';
user.address = address;
user.email = email
user.category = 'null';
user.subject = 0;
user.subjects = 'null'
user.subjectCode = 'null'
user.dept = 'null';
user.paynow = 0
user.password = user.encryptPassword(password)
user.expdate=expdate;
user.expStr = expStr;    
user.status3 = "null"
user.pollUrl2 = "null"
user.count=count
user.pollCount = 0
user.actualCount = actualCount
user.startYear = year
user.currentYearCount = 0
user.stdYearCount = 0
user.admissionYear = year 

user.save()
  .then(user =>{
   
   
     
    req.session.message = {
      type:'success',
      message:'Accounts Registered'
    }  
    res.render('imports/students',{message:req.session.message});

  })
  
  })




}     
                 
                     
                   
                    // .catch(err => console.log(err))
                  }
                  catch(e){
                    res.send(e.message)
                   }
                    })
                  
                  
         
                  }
                  
                  
                    
                    
        
                   
        
                    
             
                }
      
        
  
  
  })
  
  
  
  
    //user account activation route  (students)
    router.get('/activate3/:token',(req,res)=>{
      const token = req.params.token;
      var m = moment()
    
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
                  const {uid, suffix, name,surname,grade,class1,address,adminBal, fullname,mobile,gender,dob,role,term,year,expdate,expStr,photo, companyId, email,prefix, password, idNumber, schoolName, count, actualCount} = decodedToken;
                  console.log(grade,'gradeX')
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
                        user.fullname = fullname;
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
                        user.idNumber = idNumber;
                        user.schoolName = 'null';
                        user.receiptNumber = 0;
                        user.year = year;
                        user.prefix = prefix
                        user.balance = adminBal;
                        user.balanceCarriedOver = 0;
                        user.status = 'owing';
                        user.status4 = 'null';
                        user.number = 0;
                        user.paymentId = 'null';
                        user.suffix = suffix;
                        user.photo = "propic.jpg";
                        user.level = 'null';
                        user.levelX = 'normal';
                        user.pollUrl ='null';
                        user.annual = 0;
                        user.fees = 0;
                        user.state = 'new'
                        user.companyId = companyId
                        user.idNumber = 0;
                        user.idNumX = 0
                        user.recNumber=0
                        user.type = 'null';
                        user.address = address;
                        user.email = email
                        user.category = 'null';
                        user.subject = 0;
                        user.subjects = 'null'
                        user.subjectCode = 'null'
                        user.dept = 'null';
                        user.paynow = 0
                        user.password = user.encryptPassword(password)
                        user.expdate=expdate;
                        user.expStr = expStr;    
                        user.status3 = "null"
                        user.pollUrl2 = "null"
                        user.count=count
                        user.pollCount = 0
                        user.actualCount = actualCount
                        user.startYear = year
                        user.currentYearCount = 0
                        user.stdYearCount = 0
                        user.admissionYear = year 
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
    var companyId = req.user.companyId
  
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
      
        Calendar.findOne({'companyId':companyId,'start':start, 'date':date})
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
      clas.companyId = companyId
      
     
      
    
    
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
   var companyId = req.user.companyId
    User.find({companyId:companyId,role:"student"},(err, docs) => {
        if (!err) {
            res.render("students/list", {
                list: docs, pro:pro
                
            });
        }
        else {
            console.log('Error in retrieving Student list :' + err);
        }
    });
  });-





 //adding student grades/levels
 router.get('/addlevel',isLoggedIn, function(req,res){
  var pro = req.user
  res.render('students/levels',{pro:pro})
})



router.post('/addlevel',isLoggedIn,  function(req,res){
  var grade = req.body.grade;
  var companyId = req.user.companyId
var pro = req.user
    
    req.check('grade','Enter Form Level').notEmpty();
  
    
    var errors = req.validationErrors();
         
    if (errors) {
    
      req.session.errors = errors;
      req.session.success = false;
      res.render('students/levels',{ errors:req.session.errors,pro:pro})
    
  }
  else{
    
      Level.findOne({'grade':grade, 'companyId':companyId})
      .then(clax =>{
          if(clax){ 

         req.session.message = {
          type:'errors',
           message:'Grade/Level  already exists'
         }     
            res.render('students/levels', {
               message:req.session.message ,pro:pro
            })
          }else
  
    var level = new Level();
  
  
    level.grade = grade;
    level.levelX = 'normal'
    level.companyId = companyId
  
  
    level.save()
      .then(clas =>{
       
Level.find({companyId:companyId},function(err,focs){
for(var i=0; i<focs.length;i++){

  for(var x = 0;x<focs.length;x++){

if(focs[i].grade>focs[x].grade){
  let id =focs[x]._id
  Level.findByIdAndUpdate(focs[i]._id,{$set:{levelX:'last'}},function(err,pocs){

    Level.findByIdAndUpdate(id,{$set:{levelX:'normal'}},function(err,locs){

     

    })
   

  })



}
    

  }
}


})

        req.session.message = {
          type:'success',
          message:'Grade/Level added'
        }  
        res.render('students/levels',{message:req.session.message,pro:pro});
    
  
    })
  
      .catch(err => console.log(err))
    
  
    })
  }
  
  
  
  
  
  
  })














   //adding student classes
   router.get('/addClass',isLoggedIn, function(req,res){
    var pro = req.user
    var arr=[]
    var companyId = req.user.companyId
    Level.find({companyId:companyId},function(err,docs){
      arr = docs
      if(docs.length == 0){
        res.redirect('/records/addLevel')
      }else
      res.render('students/classX',{pro:pro,arr1:arr})
    })
    
  })
  
  
  
  router.post('/addClass',isLoggedIn,  function(req,res){
    var class1 = req.body.class1;
  var pro = req.user
  var arr = []
  var companyId = req.user.companyId
      req.check('class1','Enter Class Name').notEmpty();
      req.check('grade','Enter Form Level').notEmpty();
    
      
      var errors = req.validationErrors();
           
      if (errors) {
        Level.find({companyId:companyId},function(err,docs){
          arr = docs
        req.session.errors = errors;
        req.session.success = false;
        res.render('students/classX',{ errors:req.session.errors,pro:pro, arr1:arr})
        })
      
    }
    else{
      
        Class1.findOne({'companyId':companyId,'class1':class1})
        .then(clax =>{
            if(clax){ 
              Level.find({companyId:companyId},function(err,docs){
                arr = docs
           req.session.message = {
            type:'errors',
             message:'Class already exists'
           }     
              res.render('students/classX', {
                 message:req.session.message ,pro:pro, arr1:arr
              })
            })
            }else
    
      var clas = new Class1();
    
      clas.class1 = req.body.class1;
      clas.numberOfStudents = 0;
      clas.level = 0;
      clas.paid = 0;
      clas.unpaid = 0;
      clas.male = 0;
      clas.female = 0;
      clas.grade = req.body.grade;
      clas.companyId = companyId
    
    
      clas.save()
        .then(clas =>{
          Level.find({companyId:companyId},function(err,docs){
            arr = docs
          req.session.message = {
            type:'success',
            message:'Class added'
          }  
          res.render('students/classX',{message:req.session.message,pro:pro, arr1:arr});
        })
    
      })
    
        .catch(err => console.log(err))
      
      
      })
    }
    
    
    
    
    
    
    })
  
  
  
  
  
  //class list
router.get('/classList',isLoggedIn, (req, res) => {
 var pro = req.user
 var companyId = req.user.companyId
  Class1.find({companyId:companyId},(err, docs) => {
      if (!err) {
          res.render("students/list2", {
             list:docs, pro:pro
            
          });
      }
  });
});

  


//add teachers
router.get('/addTeacher',isLoggedIn,  function(req,res){
   var pro = req.user
   var actualCount = req.user.actualCount
   var count = req.user.count
   var title
    var readonly
    var idNum = req.user.idNumber
    idNum++
    var prefix = req.user.prefix
    var uid = prefix+idNum
    var companyId = req.user.companyId


    if(actualCount < count){
      title = "Add Teachers"
      readonly = ""
      Dept.find({companyId:companyId},function(err,docs){
        var arr1 = docs;
    
      if(docs.length == 0){
       res.redirect('/records/dept')
     }
    else
     
       res.render('teachers/admit', { arr1:arr1,pro:pro,uid:uid,readonly:readonly});
       })
    
    }else

    res.redirect('/records/addTeacherX')
  
})

router.get('/addTeacherX',isLoggedIn,function(req,res){
  var pro = req.user

var title = 'You have reched maximum users'
var readonly = 'readonly'



res.render('teachers/admit',{pro:pro,readonly:readonly, title:title})
})

router.post('/addTeacher',isLoggedIn, function(req,res){
  var m = moment()
                  var year = m.format('YYYY')
                  var pro = req.user
                var uid = req.body.uid;
                var name = req.body.name;
                var teacher = 'teacher'
                var dept = req.body.dept
                var surname = req.body.surname;
                var role = 'teacher';
                var mobile = req.body.mobile;
                var expdate = req.user.expdate
                var expStr = req.user.expStr
                var gender = req.body.gender;
                var dob = req.body.dob;
                var class1 = 'null';
                var fullname = name +" "+ surname 
                var grade = 0
                var id = req.user._id;
                var email = req.body.email
                var password = req.body.password;
                var term = req.user.term;
                var address = req.body.address
                var prefix = req.user.prefix
                var idNum=req.user.idNumber
                idNum++
                var uid1 = prefix+idNum
                var file = req.body.file;
                var companyId = req.user.companyId
                var count = req.user.actualCount           
                var idNumber = req.user.idNumber
                
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
                      Dept.find({companyId:companyId},function(err,docs){
                        var arr1 = docs;
                    
                      req.session.errors = errors;
                      req.session.success = false;
                      res.render('teachers/admit',{ errors:req.session.errors,uid:uid1,arr1:arr1,pro:pro,pre:prefix})
                      })
                    
                  }
                  else
                
                 {
                    User.findOne({'companyId':companyId,'fullname':fullname, 'role':teacher})
                    .then(user =>{
                        if(user){ 
                      // req.session.errors = errors
                        //req.success.user = false;
                        Dept.find({companyId:companyId},function(err,docs){
                          var arr1 = docs;
                       req.session.message = {
                         type:'errors',
                         message:'user id already in use'
                       }     
                       
                          res.render('teachers/admit', {
                              message:req.session.message, uid:uid1, pro:pro  }) 
                          })
                        
                  }
                  
                                else  {   
               

                  
                  var user = new User();
                  user.uid = uid;
                  user.name = name;
                  user.fullname = fullname;
                  user.surname = surname;
                  user.role = role;
                  user.gender = gender;
                  user.dob = dob;
                  user.studentId = 'null'
                  user.grade = 0;
                  user.class1 = 'null';
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
                  user.balance = 0;
                  user.idNumber = 0
                  user.idNumX = 0
                  user.number = 0
                  user.schoolName = 'null'
                  user.balanceCarriedOver = 0;
                  user.status = 'owing';
                  user.paymentId = 'null';
                  user.prefix = prefix;
                  user.photo = "propic.jpg";
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
                  user.dept = dept;
                  user.paynow = 0
                  user.companyId = companyId
                  user.expdate=expdate;
                  user.expStr = expStr; 
                  user.status3 = "null"
                  user.pollUrl2 = "null"
                  user.levelX = 'null';
                  user.status4 = 'null';
                  user.recNumber = 0
                  user.suffix = 'null'
                  user.count=0
                  user.pollCount = 0
                  user.actualCount = 0  
                  user.startYear = year
                  user.currentYearCount = 0
                  user.stdYearCount = 0
                  user.admissionYear = year
                  
                  user.password = user.encryptPassword(password)

                  
                   
              
                   
          
                  user.save()
                    .then(user =>{
                      const CLIENT_URL = 'http://' + req.headers.host;
      
                      const output = `
                      <h2>Please click on below link to activate your account</h2>
                      <a href="${CLIENT_URL}/">click here to login</a>
                      <h1> User credentials</h1>
                      <p>userID:${uid}</p>
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
                         message:'confirmation emails not sent'
                       }
                       
                       res.render('imports/teacher', {message:req.session.message,pro:pro}) 
                   
                    
                          }
                          else {
                              console.log('Mail sent : %s', info.response);
                              idNumber++
                           
                              User.findByIdAndUpdate(id,{$set:{idNumber:idNumber}},function(err,locs){
          
                              req.session.message = {
                                type:'success',
                                message:'confirmation emails sent'
                              }     
                              
                              res.render('imports/teacher', {message:req.session.message,pro:pro}) 
                            })
                          }
                      
                 
                      User.findByIdAndUpdate(id,{$set:{uidNum:idNum}},function(err,locs){
                      
                      
                      res.redirect('/records/addTeacher')
                      })
                   
                  })

                })
                }

                    })
                  }
              
                 
                
                    
                    
                
                 
                  

                  
})


 //importing teachers details from excel
  
 router.get('/importTeacher',isLoggedIn,records, function(req,res){
   var pro = req.user
   var actualCount = req.user.actualCount
   var count = req.user.count
   var pro = req.user
   var title, readonly ;
   var prefix = req.user.prefix
   var idNum=req.user.idNumber
   idNum++
   var companyId = req.user.companyId
   var uid = prefix+idNum
   if(actualCount < count){
    title = "Import Teachers"
    readonly = ""
    Dept.find({companyId:companyId},function(err,docs){
      var arr1 = docs;
  
    if(docs.length == 0){
     res.redirect('/records/dept')
   }
  res.render('imports/teacher',{pro:pro,title:title,readonly:readonly}) 

    })
  }else

 res.redirect('/records/importTeacherX')
  })
  
  
  

router.get('/importTeacherX',isLoggedIn,function(req,res){
  var pro = req.user
  res.render('imports/teacherX',{pro:pro})
})



   
  router.post('/importTeacher',isLoggedIn,records, upload.single('file'),function(req,res){
    var term = req.user.term;
    var m = moment()
    var year = m.format('YYYY')
    var id =   req.user._id
    var idNumber = req.user.idNumber
    var pro = req.user
    var count = req.user.actualCount
    var expdate = req.user.expdate
var expStr = req.user.expStr
var prefix = req.user.prefix
  
    
  /*  if(!req.file){
        req.session.message = {
          type:'errors',
          message:'Select File!'
        }     
          res.render('imports/students', {message:req.session.message,pro:pro}) */
          if (!req.file || req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
            req.session.message = {
                type:'errors',
                message:'Upload Excel File'
              }     
                res.render('imports/teacherX', {message:req.session.message,pro:pro
                     
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
        
       
      
            let uid = record.uid;
            let name = record.name;
            let surname = record.surname;
            let fullname = name +" "+surname
            let role = 'teacher';
            let address = record.address
            let mobile = record.mobile;
            let gender = record.gender;
            let dob = record.dob;
          let email = record.email
          let photo = 'propic.jpg'
           let dept = record.dept
           let num = record.num
            let password = record.password;
            let term = req.user.term
      
            let companyId = req.user.companyId
        req.body.uid=record.uid
        req.body.name=record.name
        req.body.surname=record.surname
        req.body.address=record.address
        req.body.mobile=record.mobile
        req.body.gender=record.gender
        req.body.dob=record.dob
        req.body.email=record.email
        req.body.dept=record.dept
        req.body.password=record.password
      

        req.check('name','Enter Name').notEmpty();
req.check('surname','Enter Surname').notEmpty();
req.check('dob','Enter Date Of Birth').notEmpty();
req.check('email','Enter email').notEmpty().isEmail();
req.check('uid','Enter Teacher ID').notEmpty();
req.check('address','Enter Address').notEmpty();
req.check('gender','Enter Gender').notEmpty();
req.check('mobile', 'Enter Phone Number').notEmpty();
req.check('password', 'Password do not match').notEmpty();
    

var errors = req.validationErrors();
  
if (errors) {
  
  req.session.errors = errors;
  req.session.success = false;
  for(let x=0;x<req.session.errors.length;x++){
    throw new SyntaxError(req.session.errors[x].msg +" "+"on line"+" "+ num)
  }

}


        
             /* 
         
            const token = jwt.sign({uid,name,surname,address,mobile,gender,fullname,prefix, dob, photo,dept, term, year,companyId, email,role, password,expdate,expStr }, JWT_KEY, { expiresIn: '100000m' });
            const CLIENT_URL = 'http://' + req.headers.host;
      
            const output = `
            <h2>Please click on below link to activate your account</h2>
            <a href="${CLIENT_URL}/records/activate/${token}">click here</a>
            <h1> User credentials</h1>
            <p>userID:${uid}</p>
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
                to: record.email, // list of receivers
                subject: "Account Verification ✔", // Subject line
                html: output, // html body
            };
      
         await   transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error)
                 
             req.session.message = {
               type:'errors',
               message:'confirmation emails not sent'
             }
             
             res.render('imports/teacher', {message:req.session.message,pro:pro}) 
         
          
                }
                else {
                    console.log('Mail sent : %s', info.response);
                    idNumber++
                 
                    User.findByIdAndUpdate(id,{$set:{idNumber:idNumber}},function(err,locs){

                    req.session.message = {
                      type:'success',
                      message:'confirmation emails sent'
                    }     
                    
                    res.render('imports/teacher', {message:req.session.message,pro:pro}) 
                  })
                }
            })
              */



            {
              User.findOne({'uid':uid})
              .then(user =>{
                  if(user){ 
                // req.session.errors = errors
                  //req.success.user = false;
            
            
            
                 req.session.message = {
                   type:'errors',
                   message:'user id already in use'
                 }     
                 
                    res.render('imports/students', {
                         message:req.session.message ,pro:pro
                    }) 
                
            }
            else





            var user = new User();
            user.uid = uid;
            user.name = name;
            user.fullname = fullname;
            user.surname = surname;
            user.role = role;
            user.gender = gender;
            user.dob = dob;
            user.studentId = 'null'
            user.grade = 0;
            user.class1 = 'null';
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
            user.balance = 0;
            user.idNumber = 0
            user.idNumX = 0
            user.number = 0
            user.schoolName = 'null'
            user.balanceCarriedOver = 0;
            user.status = 'owing';
            user.paymentId = 'null';
            user.prefix = prefix;
            user.photo = "propic.jpg";
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
            user.dept = dept;
            user.paynow = 0
            user.companyId = companyId
            user.expdate=expdate;
            user.expStr = expStr; 
            user.status3 = "null"
            user.pollUrl2 = "null"
            user.levelX = 'null';
            user.status4 = 'null';
            user.recNumber = 0
            user.suffix = 'null'
            user.count=0
            user.pollCount = 0
            user.actualCount = 0  
            user.startYear = year
            user.currentYearCount = 0
            user.stdYearCount = 0
            user.admissionYear = year
            user.password = user.encryptPassword(password)   
           
            user.save()
              .then(user =>{
               
              
                  
                req.session.message = {
                  type:'success',
                  message:'Account Registered'
                }  
                res.render('imports/teacherX',{message:req.session.message});
              })

            })
          }
                   
                    // .catch(err => console.log(err))
                  }
                  catch(e){
                    res.send(e.message)
                   }
                    })
                  
                  
         
                  }
                  
                  
                    
                    
        
                   
        
                    
             
                }
      
        
  
  })
  

  


    //teacher List
router.get('/teacherList',isLoggedIn,(req, res) => {
  var pro = req.user
  var companyId = req.user.companyId
  User.find({companyId:companyId,role:"teacher"},(err, docs) => {
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



 //user account activation route  (teachers)
 router.get('/activate/:token',(req,res)=>{
  const token = req.params.token;
  
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
              const {uid, name,surname,fullname,address, mobile,photo,gender,dob,role,term,year,expdate,expStr,dept, companyId, email,prefix,suffix, password,} = decodedToken;
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
                    user.fullname = fullname;
                    user.surname = surname;
                    user.role = role;
                    user.gender = gender;
                    user.dob = dob;
                    user.studentId = 'null'
                    user.grade = 0;
                    user.class1 = 'null';
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
                    user.balance = 0;
                    user.idNumber = 0
                    user.idNumX = 0
                    user.number = 0
                    user.schoolName = 'null'
                    user.balanceCarriedOver = 0;
                    user.status = 'owing';
                    user.paymentId = 'null';
                    user.prefix = prefix;
                    user.photo = "propic.jpg";
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
                    user.dept = dept;
                    user.paynow = 0
                    user.companyId = companyId
                    user.expdate=expdate;
                    user.expStr = expStr; 
                    user.status3 = "null"
                    user.pollUrl2 = "null"
                    user.levelX = 'null';
                    user.status4 = 'null';
                    user.recNumber = 0
                    user.suffix = 'null'
                    user.count=0
                    user.pollCount = 0
                    user.actualCount = 0  
                    user.startYear = year
                    user.currentYearCount = 0
                    user.stdYearCount = 0
                    user.admissionYear = year
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



//change id number 
//adding lessons to timetable
router.get('/idEdit',isLoggedIn,records,function(req,res){
  var pro = req.user
  res.render('records/idNum',{pro:pro})
  
  })
  
  router.post('/idEdit',isLoggedIn, records,function(req,res){
       var pro = req.user
  var idNumber = req.body.idNumber;
  var id = req.user._id
 var companyId = req.user.companyId
  
    req.check('idNumber','Enter ID Number').notEmpty();
   
   
    var errors = req.validationErrors();
    if (errors) {
   
      req.session.errors = errors;
      req.session.success = false;
      res.render('records/idNum',{errors:req.session.errors,pro:pro})
   
    
   }
   else
  User.findByIdAndUpdate(id,{$set:{idNumber:idNumber}},function(err,docs){

    res.redirect('/records/addStudent')
  })

  })



  router.get('/idEditX',isLoggedIn,records,function(req,res){
    var pro = req.user
    res.render('records/idNumX',{pro:pro})
    
    })
    
    router.post('/idEditX',isLoggedIn, records,function(req,res){
         var pro = req.user
    var idNumber = req.body.idNumber;
    var id = req.user._id
   
    
      req.check('idNumber','Enter ID Number').notEmpty();
     
     
      var errors = req.validationErrors();
      if (errors) {
     
        req.session.errors = errors;
        req.session.success = false;
        res.render('records/idNumX',{errors:req.session.errors,pro:pro})
     
      
     }
     else
    User.findByIdAndUpdate(id,{$set:{idNumber:idNumber}},function(err,docs){
  
      res.redirect('/records/addTeacher')
    })
  
    })
      
//activate/deactivate users


  router.get('/usr/activate/:id',isLoggedIn,function(req,res){
    var count = req.user.count
    var actualCount = req.user.actualCount
    var id = req.params.id

    if(count <= actualCount){
      res.redirect('/records/studentList')
    }
    else


User.findByIdAndUpdate(id,{$set:{status3:"activated",status4:"deactivate"}},function(err,docs){

})
res.redirect('/records/studentList')


  })


  router.get('/usr/deactivate/:id',isLoggedIn,function(req,res){
    var count = req.user.count
    var actualCount = req.user.actualCount

id = req.params.id

User.findByIdAndUpdate(id,{$set:{status3:"deactivated",status4:"activate"}},function(err,docs){

})
res.redirect('/records/studentList')


  })

  //adding departments

router.get('/dept',isLoggedIn, function(req,res){
  var pro = req.user
  res.render('subject/dept',{pro:pro})
})

router.post('/dept',isLoggedIn,  function(req,res){
     var pro = req.user
  var name = req.body.name;
  var companyId = req.user.companyId
 
      req.check('name','Enter Name Of Department').notEmpty();

    
      
      var errors = req.validationErrors();
           
      if (errors) {
      
        req.session.errors = errors;
        req.session.success = false;
        res.render('subject/dept',{ errors:req.session.errors,pro:pro})
      
    }
    else{
      
        Dept.findOne({'companyId':companyId,'name':name})
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
      dep.companyId = companyId
     
   
    
    
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
  var companyId = req.user.companyId
  Dept.find({companyId:companyId},(err, docs) => {
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
  var companyId = req.user.companyId
  Dept.find({companyId:companyId},function(err,docs){
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
  var companyId = req.user.companyId
 
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
      
        Subject.findOne({'companyId':companyId,'name':name, 'grade':grade})
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
      sub.companyId = companyId
   
    
    
      sub.save()
        .then(sub =>{
          Dept.find({companyId:companyId},function(err,docs){
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
  var companyId = req.user.companyId
  Subject.find({companyId:companyId},(err, docs) => {
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
    student.companyId = companyId;
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
      res.redirect('/records/dash')
    
    
    })
    })
  
    



//allocate subjects to teachers

  
    router.get('/teacherSubject',isLoggedIn, function(req,res){
      var pro = req.user
      var companyId = req.user.companyId
      Class1.find({companyId:companyId},function(err,docs){
        Subject.find({companyId:companyId},function(err,locs){
        var arr1 = docs;
        var arr = locs
      res.render('teachers/subjects',{arr1:arr1, arr:arr,pro:pro})
        })
      })
    })
    
    
    
    router.post('/teacherSubject', isLoggedIn, function(req,res){
      var pro = req.user
      var companyId = req.user.companyId
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
     
    
        Class1.find({companyId:companyId},function(err,docs){
        Subject.find({companyId:companyId},function(err,locs){
        arr1 = docs;
        arr = locs
          req.session.errors = errors;
          req.session.success = false;
          res.render('teachers/subjects',{ errors:req.session.errors,arr:arr,arr1:arr1,pro:pro})
        })
      })
      
      }
    else
    TeacherSub.findOne({'companyId':companyId,'teacherName':teacherName,  'subjectName':subjectName})
    .then(clax =>{
        if(clax){ 
       
          
          Class1.find({companyId:companyId},function(err,docs){
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
    teacher.companyId = companyId
    teacher.save()
    .then(teach =>{
                         
    id = teach._id;
    
    Subject.find({companyId:companyId,name:subjectName,},function(err,docs){
    subjectCode=docs[0].code;
    grade = docs[0].grade;
    dept = docs[0].dept;
    console.log(subjectCode)
    TeacherSub.findByIdAndUpdate(id,{$set:{subjectCode:subjectCode, grade:grade, dept:dept}},function(err,nocs){
    
    
    
    
    
    })
    
    Class1.find({companyId:companyId},function(err,docs){
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
     res.redirect('/records/autoTS')
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
     res.redirect('/records/autoSub')
   }else
  
      res.send(docs[0])
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
      res.redirect('/records/dash')
    
    
    })
    })
    
  
  
    router.get('/teacherSubList',isLoggedIn, (req, res) => {
       var pro = req.user
       var companyId = req.user.companyId
      TeacherSub.find({companyId:companyId},(err, docs) => {
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
  var companyId = req.user.companyId
  
    req.check('uid','Enter Teacher ID').notEmpty();
    req.check('fullname','Enter Fullname').notEmpty();
   
    var errors = req.validationErrors();
    if (errors) {
   
      req.session.errors = errors;
      req.session.success = false;
      res.render('lesson/batch',{errors:req.session.errors,pro:pro})
   
    
   }
   else
  User.findOne({'companyId':companyId,'fullname':fullname, 'uid':uid})
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
   var companyId = req.user.companyId
   var arr1 =[]
   Class1.find({companyId:companyId},function(err,focs){
   Room.find({companyId:companyId},(err, docs) => {
     arr1 = docs
     arr = focs
     if(docs == 0){
       res.redirect('/records/addClassRoom')
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
  var companyId = req.user.companyId
  
  
  
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
    Room.find({companyId:companyId},(err, wocs) => {
      Class1.find({companyId:companyId},function(err,focs){
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
  TeacherSub.findOne({'companyId':companyId,'subjectCode':subjectCode})
  .then(teach=>{
    if(teach){
      Lesson.findOne({'companyId':companyId,'subjectCode':subjectCode,'start':start, 'class1':class1})
      .then(lsn=>{
        if(lsn){
          Room.find({companyId:companyId,},(err, wocs) => {
            Class1.find({companyId:companyId},function(err,focs){
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
          lesson.companyId = companyId
       
          
      
        lesson.save()
        .then(less =>{
          Room.find({companyId:companyId},(err, wocs) => {
            Class1.find({companyId:companyId},function(err,focs){
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
      Room.find({companyId:companyId},(err, wocs) => {
        Class1.find({companyId:companyId},function(err,focs){
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
   var companyId = req.user.companyId
  
    var regex= new RegExp(req.query["term"],'i');
   var teacherId = req.user.teacherId
    var uidFilter =TeacherSub.find({companyId:companyId,teacherId:teacherId, subjectCode:regex},{'subjectCode':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
  
    
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
  
   var companyId = req.user.companyId
  
    TeacherSub.find({companyId:companyId,subjectCode:code},function(err,docs){
   if(docs == undefined){
     res.redirect('/records/lesson')
   }else
  
      res.send(docs[0])
    })
  
  
  })
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
    //role admin
   //this routes autocompletes the fullname of the teacher to be allocated a lesson
   router.get('/autocompleteLB/',isLoggedIn, function(req, res, next) {
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
    router.post('/autoLB',isLoggedIn,function(req,res){
      var fullname = req.body.code
      var companyId = req.user.companyId
    
  
      User.find({companyId:companyId,fullname:fullname},function(err,docs){
     if(docs == undefined){
       res.redirect('/records/lesson')
     }else
    
        res.send(docs[0])
      })
    
    
    })
    
  
    //role admin - lesson batch
   //this routes autocompletes the fullname of the teacher to be allocated a lesson
   router.get('/autocompleteLBL/',isLoggedIn, function(req, res, next) {
  
  var companyId = req.user.companyId
    var regex= new RegExp(req.query["term"],'i');
   
    var uidFilter =User.find({companyId:companyId,uid:regex, role:"teacher"},{'uid':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
  
    
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
    var companyId = req.user.companyId
  
  
  
    User.find({companyId:companyId,uid:uid},function(err,docs){
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
        var companyId = req.user.companyId
        Lesson.find({companyId:companyId,term:term},(err, docs) => {
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
    
    
      router.get('/addClassRoom',isLoggedIn, (req,res)=>{
        var pro = req.user
        res.render('lesson/room',{pro:pro})
      })
    
    
      router.post('/addClassRoom', isLoggedIn, (req,res)=>{
        var pro = req.user
        var companyId = req.user.companyId
        var room = req.body.room;
    
        req.check('room','Enter Classroom').notEmpty();
       
      
        
        var errors = req.validationErrors();
             
        if (errors) {
        
          req.session.errors = errors;
          req.session.success = false;
          res.render('lesson/room',{ errors:req.session.errors,pro:pro})
        
      }
      else{
        
          Room.findOne({'companyId':companyId,'name':room})
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
        rom.companyId = companyId;
       
      
      
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
      var companyId = req.user.companyId
      Room.find({companyId:companyId},(err, docs) => {
          if (!err) {
              res.render("lesson/roomList", {
                 list:docs,pro:pro
                
              });
          }
      });
    });
    
  


               //importing students details from excel
  
               router.get('/migrate',isLoggedIn,records, function(req,res){
                var actualCount = req.user.actualCount
                var count = req.user.count
                var pro = req.user
                var m = moment()
                var year = m.format('YYYY')
                var title
                var readonly 
                var companyId = req.user.companyId
                if(actualCount < count ){
                  Class1.find({companyId:companyId},function(err,docs){
                    title = "Import Students"
                    readonly = ""
                    classes = docs.length;
                    if(classes == 0){
                      res.redirect('/records/addClass')
                    }else
                    res.render('imports/students2',{pro:pro})
                      })
                    
                    
                }else
            
               
                  title = "You've Reached Maximum Users Limit"
                  readonly = "readonly"
                
                  res.render('imports/students2',{pro:pro,title:title,readonly:readonly})
                    
                  
               
               
                
              })
              
              
              
              
              
              
            
              
              router.post('/migrate',isLoggedIn,records, upload.single('file'),  (req,res)=>{
                var count = req.user.actualCount
                var m = moment()
             
                var companyId = req.user.companyId    
                var adminBal = req.user.balance
                var pro = req.user
                var id =   req.user._id
                var idNumber = req.user.idNumber
              
                if(!req.file){
                    req.session.message = {
                      type:'errors',
                      message:'Select File!'
                    }     
                      res.render('imports/students2', {message:req.session.message,pro:pro}) 
                    }else if (req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
                        req.session.message = {
                            type:'errors',
                            message:'Upload Excel File'
                          }     
                            res.render('imports/students2', {message:req.session.message,pro:pro
                                 
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
                 
                    
                   
                  
                      
                     
                    
                        let levelX
                        let adminBal = req.user.balance
                        let uid = record.uid;
                        let name = record.name;
                        let surname = record.surname;
                        let fullname = name +" "+ surname
                        let role = 'student';
                        let address = record.address
                        let mobile = record.mobile;
                        let gender = record.gender;
                        let dob = record.dob;
                        let email = record.email
                        let class1 = record.class1;
                        let grade = record.grade
                        let password = record.password;
                        let term = req.user.term
                        var year = m.format('YYYY')
                        let suffix = 'null'
                        let prefix = req.user.prefix
                        let num = record.num
                        let expdate = req.user.expdate
                        let expStr = req.user.expStr
                        let companyId = req.user.companyId
                        let photo = 'propic.jpg'
            
                        Level.find({companyId:companyId,grade:record.grade},function(err,wocs){
                          levelX = wocs[0].levelX
                          
                              })
            
            req.body.uid = record.uid     
            req.body.name = record.name  
            req.body.surname = record.surname  
            req.body.email = record.email  
            req.body.dob = record.dob  
            req.body.address = record.address 
            req.body.grade = record.grade  
            req.body.class1 = record.class1 
            req.body.gender = record.gender
            req.body.mobile = record.mobile  
            req.body.password = record.password             
            
                        
                    
                        try{
                          req.check('uid','Enter uid').notEmpty();
                          req.check('name','Enter Name').notEmpty();
                          req.check('surname','Enter Surname').notEmpty();
                          req.check('email','Enter email').notEmpty();
                          req.check('email','Enter valid email').notEmpty().isEmail();
                          req.check('dob','Enter Date Of Birth').notEmpty();
                          req.check('address','Enter Address').notEmpty();
                          req.check('grade','Enter Grade/Form').notEmpty();
                          req.check('grade','Grade must be numeric').notEmpty().isNumeric();
                          req.check('uid','Enter Student ID').notEmpty();
                          req.check('class1','Enter Student Class').notEmpty();
                          req.check('gender','Enter Gender').notEmpty();
                          req.check('mobile', 'Enter Phone Number').notEmpty()
            
            
                          var errors = req.validationErrors();
              
                          if (errors) {
                            
                            req.session.errors = errors;
                            req.session.success = false;
                            for(let x=0;x<req.session.errors.length;x++){
                              throw new SyntaxError(req.session.errors[x].msg +" "+"on line"+" "+ num)
                            }
                          
                      }
            
            
            
                     
                        const token = jwt.sign({uid, name,surname,grade, suffix,class1,address,adminBal, levelX, fullname,mobile,gender,dob,role,term,year,expdate,expStr,photo, companyId, email,prefix, password, }, JWT_KEY, { expiresIn: '100000m' });
                        const CLIENT_URL = 'http://' + req.headers.host;
                  
                        const output = `
                        <h2>Please click on below link to activate your account</h2>
                        <a href="${CLIENT_URL}/activateXX/${token}">click here</a>
                        <h1> User credentials</h1>
                        <p>userID:${uid}</p>
                        <p>password:${password}</p>
                        <p><b>NOTE: </b> The above activation link expires in 1 week.</p>
                        `;
                  
                        const transporter = nodemailer.createTransport({
                          service: 'gmail',
                          auth: {
                              user: "cashreq00@gmail.com",
                              pass: "powerland94",
                          },
                        });
                        
                  
                        // send mail with defined transport object
                        const mailOptions = {
                            from: '"Admin" <cashreq00@gmail.com>', // sender address
                            to: record.email, // list of receivers
                            subject: "Account Verification ✔", // Subject line
                            html: output, // html body
                        };
                  
                      await transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                              console.log(error)
                        
                         req.session.message = {
                           type:'errors',
                           message:'confirmation email not sent'
                         }
                         
                         res.render('imports/students2', {
                          message:req.session.message ,pro:pro
                     }) 
                     
                      
                            }
                            else {
                                console.log('Mail sent : %s', info.response);
                                
                                idNumber++
                                count++
                                User.findByIdAndUpdate(id,{$set:{idNumber:idNumber,actualCount:count}},function(err,locs){
                                req.session.message = {
                                  type:'success',
                                  message:'confirmation email sent'
                                }     
                                
                                res.render('imports/students2', {
                                  message:req.session.message ,pro:pro
                             
                            })
                          })
                            }
                        })
                   
            
                         
                                 
                             
                                 
                               
                                // .catch(err => console.log(err))
                              }
                              catch(e){
                                res.send(e.message)
                               }
                                })
                              
                              
                     
                              }
                              
                              
                                
                                
                    
                               
                    
                                
                         
                            }
                  
                    
              
              
              })
              
              
              
              
                //user account activation route  (students)
                router.get('/activateXX/:token',(req,res)=>{
                  const token = req.params.token;
                  var m = moment()
                
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
                              const {uid, suffix, name,surname,grade,class1,address,adminBal,levelX, fullname,mobile,gender,dob,role,term,year,expdate,expStr,photo, companyId, email,prefix, password, idNumber, schoolName} = decodedToken;
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
                                    user.fullname = fullname;
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
                                    user.idNumber = idNumber;
                                    user.schoolName = schoolName;
                                    user.receiptNumber = 0;
                                    user.year = year;
                                    user.prefix = prefix
                                    user.balance = adminBal;
                                    user.balanceCarriedOver = 0;
                                    user.status = 'owing';
                                    user.paymentId = 'null';
                                    user.suffix = suffix;
                                    user.photo = photo;
                                    user.level = 'null';
                                    user.levelX = levelX;
                                    user.pollUrl ='null';
                                    user.annual = 0;
                                    user.fees = 0;
                                    user.state = 'old'
                                    user.companyId = companyId
                                    user.idNumber = 0;
                                    user.recNumber=0
                                    user.type = 'null';
                                    user.address = address;
                                    user.email = email
                                    user.category = 'null';
                                    user.subject = 0;
                                    user.subjects = 'null'
                                    user.subjectCode = 'null'
                                    user.dept = 'null';
                                    user.paynow = 0
                                    user.password = user.encryptPassword(password)
                                    user.expdate=expdate;
                                    user.expStr = expStr;    
                                    user.status3 = "null"
                                    user.pollUrl2 = "null"
                                    user.count=0
                                    user.pollCount = 0
                                    user.actualCount = 0  
                                    user.startYear = year
                                    user.currentYearCount = 0
                                    user.stdYearCount = 0
                                    user.admissionYear = year 
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
              
              
              
            
        //testing
        
router.get('/importsT',isLoggedIn,function(req,res){
  var pro = req.user
  res.render('imports/studentsT',{pro:pro})
})






router.post('/importsT',isLoggedIn,records, upload.single('file'),  (req,res)=>{
  var count = req.user.actualCount
  var m = moment()

  
  var adminBal = req.user.balance
  var pro = req.user
  var id =   req.user._id
  var idNumber = req.user.idNumber
  var count = req.user.count
  var actualCount = req.user.actualCount

  if(!req.file){
      req.session.message = {
        type:'errors',
        message:'Select File!'
      }     
        res.render('imports/students', {message:req.session.message,pro:pro}) 
      }else if (req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
          req.session.message = {
              type:'errors',
              message:'Upload Excel File'
            }     
              res.render('imports/studentsT', {message:req.session.message,pro:pro
                   
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
           
       var newData = data.map( function (record){
   
      
     
    
        
       
      
          let levelX
          let adminBal = req.user.balance
          let uid = record.uid;
          let name = record.name;
          let surname = record.surname;
          let fullname = name +" "+ surname
          let role = 'student';
          let address = record.address
          let mobile = record.mobile;
          let gender = record.gender;
          let dob = record.dob;
          let email = record.email
          let class1 = record.class1;
          let grade = record.grade
          let password = record.password;
          let term = req.user.term
          var year = m.format('YYYY')
          let suffix = 'null'
          let prefix = req.user.prefix
          let num = record.num
          let expdate = req.user.expdate
          let expStr = req.user.expStr
          let companyId = req.user.companyId
          let photo = 'propic.jpg'

        

req.body.uid = record.uid     
req.body.name = record.name  
req.body.surname = record.surname  
req.body.email = record.email  
req.body.dob = record.dob  
req.body.address = record.address 
req.body.grade = record.grade  
req.body.class1 = record.class1 
req.body.gender = record.gender
req.body.mobile = record.mobile  
req.body.password = record.password             

          
      
          try{
            req.check('uid','Enter uid').notEmpty();
            req.check('name','Enter Name').notEmpty();
            req.check('surname','Enter Surname').notEmpty();
            req.check('email','Enter email').notEmpty();
            req.check('email','Enter valid email').notEmpty().isEmail();
            req.check('dob','Enter Date Of Birth').notEmpty();
            req.check('address','Enter Address').notEmpty();
            req.check('grade','Enter Grade/Form').notEmpty();
            req.check('grade','Grade must be numeric').notEmpty().isNumeric();
            req.check('uid','Enter Student ID').notEmpty();
            req.check('class1','Enter Student Class').notEmpty();
            req.check('gender','Enter Gender').notEmpty();
            req.check('mobile', 'Enter Phone Number').notEmpty()


            var errors = req.validationErrors();

            if (errors) {
              
              req.session.errors = errors;
              req.session.success = false;
              for(let x=0;x<req.session.errors.length;x++){
                throw new SyntaxError(req.session.errors[x].msg +" "+"on line"+" "+ num)
              }
            
        }



       
          const token = jwt.sign({uid, name,surname,grade, suffix,class1,address,adminBal,count,actualCount,  fullname,mobile,gender,dob,role,term,year,expdate,expStr,photo, companyId, email,prefix, password, }, JWT_KEY, { expiresIn: '100000m' });
          const CLIENT_URL = 'http://' + req.headers.host;
    
          const output = `
          <h2>Please click on below link to activate your account</h2>
          <a href="${CLIENT_URL}/records/activate3/${token}">click here</a>
          <h1> User credentials</h1>
          <p>userID:${uid}</p>
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
              to: record.email, // list of receivers
              subject: "Account Verification ✔", // Subject line
              html: output, // html body
          };
    
       transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log(error)
          
           req.session.message = {
             type:'errors',
             message:'confirmation emails not sent'
           }
           
         /*  res.render('imports/studentsT', {
            message:req.session.message ,pro:pro
       }) */
      
        throw new SyntaxError(req.session.message.message)
      
       
       
              }
              else {

                try {
                  
              
                  console.log('Mail sent : %s', info.response);
                  
                  idNumber++
            
                  User.findByIdAndUpdate(id,{$set:{idNumber:idNumber}},function(err,locs){
                  req.session.message = {
                    type:'success',
                    message:'confirmation emails sent to students'
                  }     

                  
                /*  res.render('imports/studentsT', {
                    message:req.session.message ,pro:pro
               
              })*/
             
            })
          }finally{
            throw "email sent";
          }
              }
          })
     

           
                 
               
                   
                 
                  // .catch(err => console.log(err))
                }
                catch(e){
                  res.send(e.message)
                 }


                
                
                  })
                
                
       
                }
                
                
                  
                  
      
                 
      
                  
           
              }
    
      


})


















                  




















            
            




    
  //role admin
  //new term fees update
  router.get('/termInfo',isLoggedIn, function(req,res){
    var m = moment()
    var pro = req.user
    var year = m.format('YYYY')
    var term = req.user.term
    var companyId = req.user.companyId
   
  
  FeesUpdate.find({companyId:companyId,term:term, year:year},(err, docs) => {
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
        var companyId = req.user.companyId
 
          Room.find({companyId:companyId}, function(err,docs){
          
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
      var companyId = req.user.companyId
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
       
        Exam.findOne({'companyId':companyId,'examType':examType, 'subject':subject, 'grade':grade, 'time':time, 'date':date, 'room':room})
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
            exam.companyId = companyId
            
          
            exam.save()
              .then(exm =>{
               
                Room.find({companyId:companyId}, function(err,docs){
          
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
    
      var companyId = req.user.companyId
      var regex= new RegExp(req.query["term"],'i');
      var uidFilter =Subject.find({companyId:companyId,code:regex},{'code':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    
      
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
      var companyId = req.user.companyId
    
    
      Subject.find({companyId:companyId,code:code},function(err,docs){
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
      var companyId = req.user.companyId
      Exam.find({companyId:companyId},(err, docs) => {
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
      var companyId = req.user.companyId
    
      
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
       
        Grade.findOne({'companyId':companyId,'symbol':symbol})
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
            grade.companyId = companyId
            
          
            grade.save()
              .then(grade =>{
               
      
                res.redirect('/records/gradeList')
      
                })
      
          }
          })
      
        }
        
    
       
      })

      router.get('/gradeList',isLoggedIn,records, (req, res) => {
        var pro = req.user
        var companyId = req.user.companyId
        Grade.find({companyId:companyId},(err, docs) => {
            if (!err) {
                res.render("exam/glist", {
                   list:docs, pro:pro
                  
                });
            }
        });
      });
    

      
      
//updating user
router.get('/:id',isLoggedIn, (req, res) => {
  var pro = req.user   
 var arr1 = []
   Class1.find({},function(err,docs){
     arr1 = docs;
  User.findById(req.params.id, (err, doc) => {
      if (!err) {
      
          res.render("records/update", {
             
              user: doc, pro:pro,arr1:arr1
            
              
          });
        
      }
    })
  });
  });
  
  router.post('/:id',isLoggedIn,   (req, res) => {
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
    Class1.find({},function(err,docs){
      arr1 = docs;
   User.findById(req.params.id, (err, doc) => {
       if (!err) {
       
           res.render("records/update", {
              
               user: doc, pro:pro,arr1:arr1,errors:req.session.errors,pro:pro
             
               
           });
         
       }
     })
   });
       
       
     
    
    }
  
  else
  {
  
        User.findOneAndUpdate({_id:id},req.body,
          { new: true }, (err, doc) => {
             if (!err) {
             
                res.redirect('/records/studentList'); }
             else {
               console.log('error'+err)
       
             }
           
         })
  
  
    
  }
  
  });
  
  

  




  


    
      //role - admin
      //grade List
   
    
    
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
 
  
  
  













//testing







  

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



    function exp (req,res,next){
      var set = new Date()
     
      var currdate = set.getTime()
      console.log(currdate)
      console.log(req.user.expdate)
     
       if(req.user.expdate > currdate){
         console.log('good')
        return next()
       
       }else
      res.render('errors/exp')
       
     }
     


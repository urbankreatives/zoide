


  
router.post('/addStudentX',isLoggedIn,upload.single('file'),function(req, res, next) {
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
      var photo =req.body.file
  
    
     
      req.check('name','Enter Name').notEmpty();
      req.check('surname','Enter Surname').notEmpty();
      req.check('email','Enter email').notEmpty();
      req.check('email','Enter valid email').notEmpty().isEmail();
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
                        user.paynow = 0
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
                                    user.paynow = 0
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
                        res.render('teachers/admit',{user:req.body, errors:req.session.errors,uid:uid,pro:pro})
                      
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
                                    user.paynow = 0
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
                                    
                                    user.paynow = 0
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
                    
                  
                    
                  
const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const {v4: uuid4} = require('uuid');
require('dotenv').config();



let storage = multer.diskStorage({
    destination : (req, file, cb) => cb(null,'uploads/'),
    filename: (req , file, cb) => {
         
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
})

let upload = multer({
    storage,
    limit : {fileSize: 100000 * 100},
}).single('myfile');



router.post('/', (req,res)=>{

   // store the request
  upload(req,res, async (err) => {

     // vailidate the request
     if(!req.file){
      res.json({error: 'All fields are Required.'});
    }


  if(err){
    return res.status(500).send({error: err.message});

}
      const fileName = req.file.filename;

//store data in database

  const file = new File({
      filename: fileName,
      uuid :uuid4(),
      path: req.file.path,
      size: req.file.size
  });
 


  const response = await file.save();
  return res.json({file: `${process.env.APP_BASE_URL}/files/${response.uuid}`});


  })

// store in database

// send response

})


// Send Email
router.post('/send', async (req ,res) => {
  const {uuid, emailTo,emailFrom } = req.body;
  console.log('uuid',req.body);
if(!uuid ||  !emailTo|| !emailFrom){
  return res.status(422).send({error : "Some Fields Are Required" });
}

const file = await File.findOne({ uuid: uuid})
if(file.sender){
  return res.status(422).send({error : "Email Are Already Sent"});
}

file.sender = emailFrom;
file.receiver = emailTo;

const response = await file.save();


// send mail

const sendMail = require('../services/mailService');
sendMail({
   from: emailFrom ,
   to:  emailTo,
   subject: 'Inshare File Sharing',
   text: `${emailFrom} email share with you` ,
   html:  require('../services/emailTemplate')({
   emailFrom : emailFrom,
   downloadLink :  `${process.env.APP_BASE_URL}/files/${file.uuid}`,
   size : parseInt(file.size/1000) + 'KB',
   expires : '24 Hours',

  }),

});

return res.send({success : true});

})



module.exports = router; 
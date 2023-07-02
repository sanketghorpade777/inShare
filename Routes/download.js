const router = require('express').Router();
const File = require('../models/file');


router.get('/:uuid' , async (req,res) => {
      const file = await File.findOne({uuid : req.params.uuid});
      console.log(file);
      if(!file){
         return res.render('download' , {error : 'Link Has Been Expired'});
      }

      const filePath = `${__dirname}/../${file.path}`;
      console.log('filepath',filePath);
      res.download(filePath);

    });

module.exports = router;
// DB Connection 
require('dotenv').config();

const mongoose = require('mongoose');

async function connectDB(){
let url =  "mongodb+srv://inshare:HrFxYsR4fgxRJ4jp@cluster0.xjo9uct.mongodb.net/inShare?retryWrites=true&w=majority";
    
mongoose.connect(url,{useNewUrlParser:true , useUnifiedTopology:true });

try{
      await mongoose.connect(url);
      console.log("Database Connected Successfully")
}catch(error){
     throw error;

}


}

module.exports = connectDB;
const express = require('express');
const app = express();
let path = require('path');
var bodyParser = require('body-parser')


const PORT = process.env.PORT || 3000

app.use(express.static('public'));
app.use(express.json());
const connectDB = require('./config/db');
connectDB();

//Template Engine
app.set('views' , path.join(__dirname, './views'));
app.set('view engine' , 'ejs');

app.use('/api/files', require('./Routes/files'));
app.use('/api/files/send', require('./Routes/files'));
app.use('/files', require('./Routes/show'));
app.use('/files/download', require('./Routes/download'));


app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

app.listen(PORT, () => {
   console.log(`Listening on port ${PORT}`);
})




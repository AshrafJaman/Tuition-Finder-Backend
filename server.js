const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const getData = require('./Routes/get');
const postData = require('./Routes/post');
const update = require('./Routes/update');
const del = require('./Routes/delete');
const blog = require('./Routes/blog');
require('dotenv').config();

const uri = process.env.URI;

//middleware
app.use(cors());
app.use(bodyParser.json());

app.use('/', getData);
app.use('/post', postData);
app.use('/update', update);
app.use('/delete', del);
app.use('/blog', blog);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

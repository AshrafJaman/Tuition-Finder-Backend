const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb');
require('dotenv').config();

const uri = process.env.URI;

router.delete('/jobs/:id', (req, res) => {
  let client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      const collection = client.db('TUITION').collection('JOBS');
      collection.deleteOne({ _id: ObjectID(req.params.id) }).then(function (result) {
        res.send('success');
        client.close();
      });
    }
  });
});
module.exports = router;

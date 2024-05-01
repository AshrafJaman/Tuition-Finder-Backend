const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const uri = process.env.URI;
router.get("/", (req, res) => {
  let client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db("TUITION").collection("TEACHER");
    if (err) {
      console.log(err);
      client.close();
    } else {
      collection.find().toArray((err, documents) => {
        res.send(documents);
        client.close();
      });
    }
  });
});

router.get("/contact", (req, res) => {
  let client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db("TUITION").collection("CONTACT");
    if (err) {
      console.log(err);
      client.close();
    } else {
      collection.find().toArray((err, documents) => {
        res.send(documents);
        client.close();
      });
    }
  });
});

router.get("/jobs", (req, res) => {
  let client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db("TUITION").collection("JOBS");
    if (err) {
      console.log(err);
      client.close();
    } else {
      collection.find().toArray((err, documents) => {
        res.send(documents);
        client.close();
      });
    }
  });
});
module.exports = router;

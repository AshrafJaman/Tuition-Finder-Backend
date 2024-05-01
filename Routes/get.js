const express = require('express');
const { ObjectID } = require('mongodb');

const router = express.Router();

const { connectToDB } = require('../connect');

router.get('/', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'TEACHER');
    const documents = await collection.find().toArray();
    res.send(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/contact', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'CONTACT');
    const documents = await collection.find().toArray();
    res.send(documents);
  } catch (error) {
    console.error('Error fetching contact documents:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/jobs', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'JOBS');
    const documents = await collection.find().toArray();
    res.send(documents);
  } catch (error) {
    console.error('Error fetching job documents:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/tuition-requests/:id', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'JOBS');

    const tuition = await collection.find({ _id: ObjectID(req.params.id) }).toArray();

    res.status(200).json({ applicants });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

router.get('/userbyuid/:id', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'USERS');

    const user = await collection.findOne({ uid: req.params.id });

    res.status(200).json({
      user: user,
    });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'USERS');

    const user = await collection.findOne({ _id: ObjectID(req.params.id) });

    res.status(200).json({
      user: user,
    });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');

const { connectToDB } = require('../connect');

router.post('/reg', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'TEACHER');
    const data = req.body;
    await collection.insertOne(data);
    console.log('added');
    res.status(200).send('success');
  } catch (error) {
    console.error('Error adding teacher:', error);
    res.status(404).send(error);
  }
});

router.post('/contact', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'CONTACT');
    const data = req.body;
    await collection.insertOne(data);
    console.log('added');
    res.status(200).send('success');
  } catch (error) {
    console.error('Error adding contact:', error);
    res.status(404).send(error);
  }
});

router.post('/job', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'JOBS');
    const data = req.body;
    await collection.insertOne(data);
    res.status(200).json({
      message: 'Added successfully and under review by admin',
    });
  } catch (error) {
    console.error('Error adding job:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/teacher/contact', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'CONTACT');
    const data = req.body;
    await collection.insertOne(data);
    res.status(200).send('success');
  } catch (error) {
    console.error('Error adding teacher contact:', error);
    res.status(404).send(error);
  }
});

router.patch('/update/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const { isApproved } = req.body;

    const collection = await connectToDB('TUITION', 'JOBS');

    await collection.updateOne(
      { _id: ObjectID(postId) },
      {
        $set: { isApproved },
      },
      { upsert: true }
    );

    res.status(200).json({ message: 'Post approval status updated successfully' });
  } catch (error) {
    console.error('Error updating post approval status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/job/my-jobs', async (req, res) => {
  try {
    const { email, uid } = req.body;
    const collection = await connectToDB('TUITION', 'JOBS');
    const jobs = await collection.find({ authEmail: email, uid }).toArray();
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/tuition-requests', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'TUITION-REQUESTS');

    // check if already applied
    const alreadyApplied = await collection.findOne({
      'user.email': req.body.user.email,
      'tuition._id': req.body.tuition._id,
    });

    if (alreadyApplied) {
      return res.status(400).json({ status: false, message: 'You already have applied.' });
    }

    const job = await collection.insertOne(req.body);

    if (job.insertedCount > 0) {
      return res.status(201).json({ status: true, message: 'Applied Successfully' });
    }

    return res.status(400).json({ status: false, message: 'Something went wrong.' });
  } catch (error) {
    res.status(500).json({ status: false, error: 'Internal Server Error' });
  }
});

router.post('/user', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'USERS');

    const user = await collection.insertOne(req.body);

    if (user.insertedCount > 0) {
      return res.status(201).json({ status: true, message: 'User added Successfully' });
    }

    return res.status(400).json({ status: false, message: 'Something went wrong.' });
  } catch (error) {
    res.status(500).json({ status: false, error: 'Internal Server Error' });
  }
});
module.exports = router;

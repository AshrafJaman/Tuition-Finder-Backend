const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');

const { connectToDB } = require('../connect');

router.delete('/jobs/:id', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'JOBS');
    const result = await collection.deleteOne({ _id: ObjectID(req.params.id) });
    res.send('success');
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/tutors/:id', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'TEACHER');
    const result = await collection.deleteOne({ _id: ObjectID(req.params.id) });

    res.status(200).json({
      status: true,
      message: 'Deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Internal Server Error',
    });
  }
});

module.exports = router;

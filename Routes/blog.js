const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');
const { connectToDB } = require('../connect');

router.get('/', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'BLOGS');

    const documents = await collection.find().toArray();
    res.send(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/post', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'BLOGS');
    const data = req.body;
    data.date = new Date().toDateString();
    data.approved = false;
    await collection.insertOne(data);
    res.status(200).send('success');
  } catch (error) {
    console.error('Error adding document:', error);
    res.status(500).send('Internal Server Error');
  }
});
router.patch('/update/:id', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'BLOGS');
    const result = await collection.updateOne(
      { _id: ObjectID(req.params.id) },
      {
        $set: {
          approved: true,
        },
        $currentDate: { lastModified: true },
      }
    );
    res.send('success');
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/my-blogs/:email', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'BLOGS');
    const userEmail = req.params.email;
    const blogs = await collection.find({ authorEmail: userEmail }).toArray();
    // res.json(blogs);
    res.send(blogs);
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/update-content/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { _id, ...rest } = req.body;

    const collection = await connectToDB('TUITION', 'BLOGS');

    const result = await collection.updateOne({ _id: ObjectID(id) }, { $set: { ...rest } });

    if (result.modifiedCount === 0) {
      res.status(404).json({ error: 'Content not found' });
    } else {
      res.json({ message: 'Content updated successfully' });
    }
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Connect to the database
    const collection = await connectToDB('TUITION', 'BLOGS');

    // Delete the blog by ID
    const result = await collection.deleteOne({ _id: ObjectID(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

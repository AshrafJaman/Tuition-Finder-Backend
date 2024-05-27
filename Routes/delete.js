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


router.delete('/ratings', async (req, res) => {
  const { teacherId, newRating, by: applicantEmail } = req.body;

  if (!teacherId || !applicantEmail) return res.status(404).json({
    status: false,
    message: 'Bad Request'
  });

  try {
    const collection = await connectToDB('TUITION', 'TEACHER');

    const teacher = await collection.findOne({ _id: ObjectID(teacherId) });


    if (!teacher) {
      return res.status(400).json({ status: false, message: 'Teacher not found' });
    }

    const teacherApplicants = teacher?.applicants || [];


    const newApplicantsArray = teacherApplicants.map((applicant) => {
      if (applicant.email === applicantEmail) {
        return {
          ...applicant,
          rating: 0,
        }
      }

      return applicant;
    })

    console.log(newApplicantsArray)

    await collection.updateOne(
      { _id: ObjectID(teacherId) },
      {
        $set: {
          applicants: newApplicantsArray,
        },
      },
    );


    res.status(200).json({
      status: true,
      data: { ...teacher, applicants: newApplicantsArray },
    });

  } catch (error) {
    return res.status(500).json({ status: false, message: 'Internal Server Error' });
  }

  return res.status(200);
})

module.exports = router;

const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');
const { connectToDB } = require('../connect');

router.patch('/profile/:id', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'TEACHER');
    await collection.updateOne(
      { _id: ObjectID(req.params.id) },
      {
        $set: {
          about: req.body.about,
          mobile: req.body.mobile,
          name: req.body.name,
        },
        $currentDate: { lastModified: true },
      }
    );
    res.send('success');
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.patch('/demo/:id', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'TEACHER');
    await collection.updateOne(
      { _id: ObjectID(req.params.id) },
      {
        $set: {
          demo: req.body.demo,
        },
        $currentDate: { lastModified: true },
      }
    );
    res.send('success');
  } catch (error) {
    console.error('Error updating demo:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.patch('/jobs/interested/:id', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'JOBS');
    await collection.updateOne(
      { _id: ObjectID(req.params.id) },
      {
        $set: {
          interested: req.body.interested,
        },
        $currentDate: { lastModified: true },
      }
    );
    res.send('success');
  } catch (error) {
    console.error('Error updating job interest:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.patch('/feedback/:id', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'TEACHER');
    await collection.updateOne(
      { _id: ObjectID(req.params.id) },
      {
        $set: {
          'tuition.star': req.body.rate,
          'tuition.comments': req.body.comments,
        },
        $currentDate: { lastModified: true },
      }
    );
    res.send('success');
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.patch('/tutor/contact/:id', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'TEACHER');
    await collection.updateOne(
      { _id: ObjectID(req.params.id) },
      {
        $set: {
          contacts: req.body,
        },
        $currentDate: { lastModified: true },
      }
    );
    res.send('success');
  } catch (error) {
    console.error('Error updating tutor contact:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.patch('/myProfile/:id', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'TEACHER');
    await collection.updateOne(
      { 'personal.email': req.params.id },
      {
        $set: {
          'personal.fullName': req.body.fullName,
          'personal.mobile': req.body.mobile,
          'tuition.video': req.body.video,
          'tuition.available': req.body.available,
          'personal.about': req.body.about,
        },
        $currentDate: { lastModified: true },
      }
    );
    res.send('success');
  } catch (error) {
    console.error('Error updating my profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.patch('/verify/:id', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'TEACHER');
    await collection.updateOne(
      { 'personal.email': req.params.id },
      {
        $set: {
          'tuition.member': req.body.member,
        },
        $currentDate: { lastModified: true },
      }
    );
    res.send('success');
  } catch (error) {
    console.error('Error verifying profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.patch('/my-jobs/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const collection = await connectToDB('TUITION', 'JOBS');

    const { _id, ...rest } = req.body;

    const job = await collection.findOne({ _id: ObjectID(jobId) });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    await collection.updateOne({ _id: ObjectID(jobId) }, { $set: { ...rest } });

    const updatedJob = await collection.findOne({ _id: ObjectID(jobId) });

    res.status(200).json({ message: 'Job updated successfully', job: updatedJob });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.patch('/tuition-requests', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'JOBS');

    const jobId = req.body.tuition._id;

    const tuition = await collection.findOne({ _id: ObjectID(jobId) });

    const appliedList = tuition.applicants || [];

    // check if already applied
    const alreadyApplied = appliedList.find((item) => item.email === req.body.user.email);

    if (alreadyApplied) {
      return res.status(400).json({ status: false, message: 'You already have applied.' });
    }

    const updatedTuition = await collection.updateOne(
      { _id: ObjectID(jobId) },
      { $push: { applicants: req.body.user } }
    );

    if (updatedTuition.modifiedCount > 0) {
      return res.status(201).json({ status: true, message: 'Applied Successfully' });
    }

    return res.status(400).json({ status: false, message: 'Something went wrong.' });
  } catch (error) {
    res.status(500).json({ status: false, error: 'Internal Server Error' });
  }
});

router.patch('/job/tuition-requests/:id', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'JOBS');

    const jobId = req.params.id;

    const tuition = await collection.findOne({ _id: ObjectID(jobId) });

    if (!tuition) {
      return res.status(400).json({ status: false, message: 'Tuition not found' });
    }

    const updatedTuition = await collection.updateOne(
      { _id: ObjectID(jobId) },
      {
        $set: {
          assigned: req.body.tuition.assigned,
          assignedTo: req.body.assignedTo,
          status: 'taken',
        },
      }
    );

    if (updatedTuition.modifiedCount > 0) {
      return res.status(201).json({ status: true, message: 'Applied Successfully' });
    }

    return res.status(400).json({ status: false, message: 'Something went wrong.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, error: 'Internal Server Error' });
  }
});

router.patch('/job/tutor-request/:id', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'TEACHER');

    const teacherId = req.params.id;

    const teacher = await collection.findOne({ _id: ObjectID(teacherId) });

    if (!teacher) {
      return res.status(400).json({ status: false, message: 'Teacher not found' });
    }

    const appliedList = teacher.applicants || [];

    // check if already applied
    const alreadyApplied = appliedList.find((item) => item.email === req.body.email);

    if (alreadyApplied) {
      return res.status(400).json({ status: false, message: 'You already have applied.' });
    }

    const updatedTeacher = await collection.updateOne(
      { _id: ObjectID(teacherId) },
      { $push: { applicants: req.body } }
    );

    if (updatedTeacher.modifiedCount > 0) {
      return res.status(201).json({ status: true, message: 'Applied Successfully' });
    }

    return res.status(400).json({ status: false, message: 'Something went wrong.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, error: 'Internal Server Error' });
  }
});

router.patch('/tutorApproval/:id', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'TEACHER');

    const teacherId = req.params.id;
    const { isApproved } = req.body;

    await collection.updateOne(
      { _id: ObjectID(teacherId) },
      {
        $set: { isApproved },
      },
      { upsert: true }
    );

    res.status(200).json({ message: 'Approval status updated' });
  } catch (error) {
    console.error('Error updating post approval status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.patch('/tutors/student/assign/:id', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'TEACHER');

    const teacherId = req.params.id;

    const teacher = await collection.findOne({ _id: ObjectID(teacherId) });

    if (!teacher) {
      return res.status(400).json({ status: false, message: 'Teacher not found' });
    }

    const teacherApplicants = teacher.applicants;

    const applicantEmail = req.body.assignedTo.email;

    for (let i = 0; i < teacherApplicants.length; i++) {
      if (teacherApplicants[i].email === applicantEmail) {
        teacherApplicants[i].assigned = teacherApplicants[i].assigned ? false : true;
      }
    }

    await collection.updateOne(
      { _id: ObjectID(teacherId) },
      { $set: { applicants: teacherApplicants } }
    );

    res.status(200).json({
      status: true,
      data: { ...teacher, applicants: teacherApplicants },
    });
  } catch (error) {
    if (!teacher) {
      return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
  }
});

router.patch('/tutor-information/:id', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'TEACHER');

    const teacherId = req.params.id;

    const teacher = await collection.findOne({ _id: ObjectID(teacherId) });

    if (!teacher) {
      return res.status(400).json({ status: false, message: 'Teacher not found' });
    }

    await collection.updateOne(
      { _id: ObjectID(req.params.id) },
      {
        $set: {
          ...req.body,
        },
        $currentDate: { lastModified: true },
      }
    );

    const updatedTeacher = await collection.findOne({ _id: ObjectID(teacherId) });

    res.status(200).json({ status: true, message: 'Updated successfully', data: updatedTeacher });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Something went wrong' });
  }
});

router.patch('/user-info/:id', async (req, res) => {
  try {
    const collection = await connectToDB('TUITION', 'USERS');

    await collection.updateOne(
      { _id: ObjectID(req.params.id) },
      {
        $set: {
          ...req.body,
        },
      }
    );

    res.status(200).json({ status: true, message: 'Updated Successfully' });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Something went wrong' });
  }
});

module.exports = router;

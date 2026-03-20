const express = require('express');
const router = express.Router();
const path = require('path');
const globalController = require('../controller/global.controller');

router.post('/send-message', (req, res) => {
  const body = req.body;

  const data = {
    firstname: body.firstname,
    lastname: body.lastname,
    email: body.email,
    message: body.message,
    subject: body.subject
  }

  try {
    globalController.saveMessage(data);
  } catch(err) {
    console.log(err);
    res.status(500).json({
      message: 'Internal server error, please check logs'
    });

    return;
  }

  res.status(201).json({
    message: 'Done'
  });
});

module.exports = router;

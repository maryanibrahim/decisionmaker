/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const db = require('../db/queries/users.js');
const router  = express.Router();
const Poll = require('../db/queries/pollModel');

function generateRandomString() {
  // found the solution on stackOverFlow
  return Array.from(Array(6), () => Math.floor(Math.random() * 36).toString(36)).join('');
}

router.get('/', (req, res) => {
  res.render('users');
});


router.post("/", (req, res) => {
  const newUser = {
    email:req.body.email,
    name:req.body.name,
    question_title:req.body.question_title
  }
  console.log("email:" + newUser.email);
  if (newUser.email === "" || newUser.name === "" || newUser.question_title === "") {
    return res.status(400).send("Please fill in all the fileds");
  } else {
    // Generate ID's for both admin page and normal page
    let newAdminID = 'admin_' + generateRandomString();
    let newSubmissionID = generateRandomString();

    // Create an entry in the Database using promises
    // need ask maryan to add name parameter

    Poll.create(newUser.email, newUser.name, newAdminID, newSubmissionID)
    .then((createdPoll) => {
      res.redirect(`/polls/${createdPoll.admin_id}`);
    })
    .catch((error) => {
      console.error('Error creating poll:', error);
      res.status(500).send("An error occurred while creatigit ng the poll.");
    })
  }
});

module.exports = router;



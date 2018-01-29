const express = require('express');
const multer = require('multer');
const UserModel = require('../models/user-model');
const RecipeModel = require('../models/recipe-model');
const ReviewModel = require('../models/review-model');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/api/users', (req, res, next) => {

  UserModel
  .find()
  //retrieve all the info of the owners (needs "ref" in the model)
  // .populate('user', { encryptedPassword : 0})
  //don't retrieve "encryptedPassword" though
  .exec((err, allTheUsers) => {
    if (err) {
      res.status(500).json({ message: "Could not find all the recipes"});
      return;
    }
    res.status(200).json(allTheUsers);
  });//end of .exec
})//close router.get('/api/users')








module.exports = router;

const express = require('express');
const multer = require('multer');

const UserModel = require('../models/user-model');
const RecipeModel = require('../models/recipe-model');
const ReviewModel = require('../models/review-model');
const router = express.Router();

const myUploader = multer({
  dest: __dirname + '/../public/uploads/'
});




// router.get('/api/profile/:id', (req, res, next) => {
//   RecipeModel
//   .find({user: req.params.id}, (err, theRecipe) => {
//     if(err) {return next(err); }
//   })
//   .populate('user', {encryptedPassword : 0})
//   .exec((err, theRecipe) => {
//     if(err) {
//       res.status(500).json({ message: 'Could not find the recipe'});
//       return;
//     }
//     console.log(theRecipe);
//     res.status(200).json(theRecipe)
//   })
// })

router.get('/api/profile/:id', (req, res, next) => {
  UserModel
  .findById(req.params.id, (err, theUser) => {
    if(err) {return next(err);}
    RecipeModel
    .find({user: req.params.id}, (err, theRecipe) =>{
      if(err) {return next(err); }
    })
    .populate('user', {encryptedPassword : 0})
    .exec((err, theRecipe) => {
      if(err) {
        res.status(500).json({ message: 'Could not find the recipe'});
        return;
      }
      const data ={
        user: theUser,
        recipe: theRecipe
      }
      console.log(data);
      res.status(200).json(data)
    })
  })//closer UserModel.findById
}) //close router.get




// router.get('/api/recipes/:id', (req, res, next) => {
//   console.log('recipe', req.params.id);
//   RecipeModel
//   .findById(req.params.id, (err, theRecipe) => {
//     if(err) { return next(err);}
//   })
//   .populate('user', {encryptedPassword : 0 })
//   .exec((err, theRecipe) => {
//     if(err) {
//       res.status(500).json({ message: 'Could not find the recipe'});
//       return;
//     }
//     ReviewModel
//     .find({recipeId: req.params.id}, (err, theReview) => {
//       if (err) {return next(err); }
//     })//end of .find
//     .populate('user', {encryptedPassword: 0 })
//     .exec((err, theReview) => {
//       if(err) {return next(err);}
//       const data = {
//         recipe: theRecipe,
//         review: theReview
//       }
//       res.status(200).json(data);
//     })
//     //I believe this is where the ReviewModel.find would begin
//   })//recipe model .exec
// })
//




module.exports = router;

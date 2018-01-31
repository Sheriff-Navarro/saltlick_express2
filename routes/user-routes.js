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


// router.post('/api/users/:id/follow', (req, res, next) =>{
//   const toBeFollowedId = req.params.id;
//   console.log("followingId ", req.params.id);
//
//   UserModel.findById(req.user._id, (err, toFollowUser) => {
//     if (err) {
//       res.json(err);
//       return;
//     }
//
//   UserModel.findById(toBeFollowedId, (err, toBeFollowedUser)=>{
//     if (err) {
//       res.json(err);
//       return;
//     }
//     if(toBeFollowedUser) {
//       toFollowUser.following.push(toBeFollowedUser)
//       toBeFollowedUser.followers.push(toFollowUser)
//       toFollowUser.save((err)=>{
//         if (err) {
//             res.json(err);
//             return;
//           }
//         });
//       toBeFollowedUser.save((err)=>{
//         if (err) {
//             res.json(err);
//             return;
//           }
//           const data = {
//             follower: toFollowUser,
//             following: toBeFollowedUser
//           }
//         res.json(data);
//         });
//       }//close if statement
//     });//second usermodel.find
//   });//first usermodel.findBy
// });//router.post close



router.post('/api/recipes/:id/follow',(req, res, next)=>{
  const recipeId = req.params.id;
  console.log("recipeId ", req.params.id);

  UserModel
  .findById(req.user._id, (err, theUser) => {
    if (err) {
      res.json(err);
      return;
    }

  RecipeModel.findById(recipeId, (err, theRecipe)=>{
    if (err) {
      res.json(err);
      return;
    }
    if (theRecipe) {

      theUser.savedRecipes.push(theRecipe);
      theUser.save((err)=>{
        if (err) {
            res.json(err);
            return;
          }
        res.json(theRecipe);
        });
      }
    });
  });
});








module.exports = router;

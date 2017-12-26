const express = require('express');
const multer = require('multer');

const RecipeModel = require('../models/recipe-model');

const router = express.Router();

const myUploader = multer({
  dest: __dirname + '/../public/uploads/'
});

router.post(
  '/api/recipes',
  myUploader.single('recipePicture'),
  (req, res, next) => {
    if(!req.user) {
      res.status(401).json({ message: 'Log in to make a recipe'})
      return;
    }
    const theRecipe = new RecipeModel({
      name: req.body.recipeName,
      serves: req.body.recipeServes,
      cookTime: req.body.recipeCookTime,
      user: req.user._id,
      ingredients: JSON.parse(req.body.recipeIngredients) || [],
      directions: JSON.parse(req.body.recipeDirections) || []
    });

    if (req.file) {
       theRecipe.picture = '/uploads/' + req.file.filename;
     }

     theRecipe.save((err) => {
       //unknown error from the db
       if(err && theRecipe.errors ===undefined){
         res.status(500).json({ message: 'Database could not save the recipe'});
         return;
       }

       //Validation error
       if (err && theRecipe.errors) {
         res.status(400).json({
           nameError: theRecipe.errors.name,
           servesError: theRecipe.errors.serves,
           cookTimeError: theRecipe.errors.cookTime,
         });
         return;
       }
       //Put the full user infor here for Angular
       req.user.encryptedPassword = undefined;
       theRecipe.user = req.user;
       //SUCCESS!
       res.status(200).json(theRecipe);
     })//close the recipe.save
  }); // close router.post('/api/recipes')

router.get('/api/recipes', (req, res, next) => {
  // if (!req.user) {
  //   res.status(401).json({ message: 'Log in to see recipes'})
  //   return;
  // }
  //Commented out because I want unauthorized users to be able to see recipes
  RecipeModel
  .find()
  //retrieve all the info of the owners (needs "ref" in the model)
  .populate('user', { encryptedPassword : 0})
  //don't retrieve "encryptedPassword" though
  .exec((err, allTheRecipes) => {
    if (err) {
      res.status(500).json({ message: "Could not find all the recipes"});
      return;
    }
    res.status(200).json(allTheRecipes);
  });//end of .exec
})//close router.get('/api/recipes')


module.exports = router;

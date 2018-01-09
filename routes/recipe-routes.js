const express = require('express');
const multer = require('multer');

const RecipeModel = require('../models/recipe-model');
const ReviewModel = require('../models/review-model');
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
      kindOfDish: req.body.recipeType,
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


router.get('/api/recipes/:id', (req, res, next) => {
  console.log('recipe', req.params.id);
  RecipeModel
  .findById(req.params.id, (err, theRecipe) => {
    if(err) { return next(err);}
  })
  .populate('user', {encryptedPassword : 0 })
  .exec((err, theRecipe) => {
    if(err) {
      res.status(500).json({ message: 'Could not find the recipe'});
      return;
    }
    ReviewModel
    .find({recipeId: req.params.id}, (err, theReview) => {
      if (err) {return next(err); }
    })//end of .find
    .populate('user', {encryptedPassword: 0 })
    .exec((err, theReview) => {
      if(err) {return next(err);}
      const data = {
        recipe: theRecipe,
        review: theReview
      }
      res.status(200).json(data);
    })
    //I believe this is where the ReviewModel.find would begin
  })//recipe model .exec
})

router.post('/api/recipes/:id/newreview', (req, res, next) => {
  // const recipeParamId = req.params.id;
  const theReview = new ReviewModel({
    user: req.user._id,
    recipeId: req.params.id,
    rating: req.body.reviewRating,
    review: req.body.reviewReview
  });
  theReview.save((err) => {
    if(err && theReview.errors === undefined) {
      res.status(500).json({ message: 'Database could not save the recipe'});
      return;
    }
    //Validation error
    if(err && theReview.errors) {
      res.status(400).json({
        reviewError: theReview.errors.review,
        ratingError: theReview.errors.rating,
        userError: theReview.errors.user
      });
      return;
    }
    //Put the full user info here for Angular
    req.user.encryptedPassword = undefined;
    theReview.user = req.user;
    //SUCCESS
    res.status(200).json(theReview);
  })//close the recipe.save
});//close router.post('/api/recipes/:id/newreview')

module.exports = router;

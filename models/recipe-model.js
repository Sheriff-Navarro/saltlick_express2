const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user-model');

const myRecipeSchema = new Schema({
  name: {
    type: String,
    required: [true, 'The name of the dish is required!']
  },
  ingredients: {
    type: Array,
    default: []
  },
  directions: {
    type: Array,
    default: []
  },
  picture: {
    type: String,
    default: ''
  },
  cookTime: {
    type: Number,
    default: 15
  },
  serves: {
    type: Number,
    default: 2
  },
  kindOfDish: {
        type: String,
        // enum: ['Appetizer', 'Entré', 'Dessert', 'Snack', 'Drink'],
        default: 'Entré'
    },
   user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  paidRecipe: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: true
}

);

const RecipeModel = mongoose.model('Recipe', myRecipeSchema);

module.exports = RecipeModel;

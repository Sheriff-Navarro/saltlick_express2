const mongoose = require('mongoose');
const Recipe = require('./recipe-model');
const User = require('./user-model');
const Schema   = mongoose.Schema;

const ReviewSchema = new Schema ({
  recipeId: {type: Schema.Types.ObjectId, ref: 'Recipe', required: true},
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  // creatorFirst: {
  //   type: String
  // },
  // creatorLast: {
  //   type: String
  // },
  // creatorThumbnail: {
  //   type: String
  // },
  rating: {
    type: Number,
    required: [true, 'A rating is required!'],
    min: 1,
    max: 5
  },
  review: {
    type: String
  }
},
{
  timestamps: true
})

const ReviewModel = mongoose.model('Review', ReviewSchema);

module.exports = ReviewModel;
//
// creatorFirst: req.user.fistName,
// creatorLast: req.user.lastName,
// creatorThumbnail: req.user.thumbnail,

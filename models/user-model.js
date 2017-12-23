const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const myUserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    encryptedPassword: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      required: false
    },
  savedRecipes: [],
  paidRecipes: []
  },
  {
    timestamps: true
  }
);

const UserModel = mongoose.model('User', myUserSchema);



module.exports = UserModel;

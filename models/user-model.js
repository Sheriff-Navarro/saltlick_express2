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
    picture: {
      type: String,
      default: '../../assets/images/user.svg'
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

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const tokenSchema = new mongoose.Schema({
  token: {
    //this token is the field name in the file token.js
    type: String,
    required: true,
  },
  userId: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    //For Token WE ONLY NEED CREATED AT AND NOT UPDATED AT, HENCE NO TIMESTAMP
    type: Date, //MEANS IN DATE FORMAT
    default: Date.now(), //THIS TAKES THE SYSTEM DATE AND TIME OF OUR SYSTEM
    expires: 864000, //In Seconds
    //expires means time limit, here expires:864000 means in seconds and that is equal to 24 hrs
  },
  //TimeStamp is not necessary as TIMESTAMP Brings Created At and Updated At AND DONT NEED UPDATED AT FOR TOKEN
});

module.exports = mongoose.model("Token", tokenSchema);

const mongoose = require("mongoose");
const uuidv1 = require("uuidv1");
const crypto = require("crypto");
const { timeStamp } = require("console");

const userSchema = new mongoose.Schema(
  {
    //AS SIGNUP IN FRONT END

    // name: {
    //   type: String,
    //   required: true,
    //   trim: true,
    //trim cuts all the spaced IN FRONT AND BACK ONLY, NOT MIDDLE ONES.
    // },

    first_name: {
      type: String,
      required: true,
      trim: true,
      //trim cuts all the spaced IN FRONT AND BACK ONLY, NOT MIDDLE ONES.
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
      //trim cuts all the spaced IN FRONT AND BACK ONLY, NOT MIDDLE ONES.
    },
    date_of_birth: {
      type: Date,
      required: true,
      //trim not needed here as date it is sent in non typing format.
    },
    gender: {
      type: String,
      required: true,
      //trim not needed here as date it is sent in non typing format.
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      //Can DO String aswell but it will require more codes as we have to code for lower-case and upper-case
      //In Number, we can define,
      //0=user and 1=admin
      //OR 0=user, 1=admin, 2=superadmin, etc
      required: true,
      default: 0,
      //By DEFAULT, ROLE IS SET TO 0
    },
    hashed_password: {
      type: String,
      required: true,
    },
    //
    isVerified: {
      type: Boolean,
      //Boolean as Either Verified or Not Verified
      default: false,
      //By default, it is not verified and hence goes to verification process
    },
    salt: String, //To Generate Unique
    //Salt is a unique number generator. Unique numbers are placed within it.
  },
  { timeStamp: true }
);

//User is the name we have set for this schema

//Virtual Field
//THE PASSWORD FROM USER IS PUT HERE AND THE HASH PASSWORD IS GENERATED FROM HERE. KIND OF LIKE A MIDDLE TERRITORY
//Get = returns password
//Set = Sets Passwords, works like hash password saving is done here

// userSchema
//   .virtual("password")
//   //This password is initially what we get prom user
//   //Now
//   .set((password) => {
//     //THIS MEANS IN SAME OR OF SAME MODEL OR PAGE OR WORKING CODE PAGE WITHING SINGLE BOUNDRY
//     this._password = password; //Here, _password in a js defined temporary variable.
//     //It Temporarily Stores the password
//     this.salt = uuidv1(); //UNIQUE ID GENERATION
//     this.hashed_password = this.encryptPassword(password);
//     //encryptPassword Is OUR VARIABLE WHICH WILL BE DEFINED LATER
//   })
//   .get(() => this._password);

//The Above Code does not work in uuidv1 i.e arrow function does not work, Hence:-
userSchema
  .virtual("password")
  //This password is initially what we get prom user
  //Now
  .set(function (password) {
    //THIS MEANS IN SAME OR OF SAME MODEL OR PAGE OR WORKING CODE PAGE WITHING SINGLE BOUNDRY
    this._password = password; //Here, _password in a js defined temporary variable.
    //It Temporarily Stores the password
    this.salt = uuidv1(); //UNIQUE ID GENERATION
    this.hashed_password = this.encryptPassword(password);
    //encryptPassword Is OUR VARIABLE WHICH WILL BE DEFINED LATER
  })
  .get(function () {
    return this._password;
  });

//METHOD
userSchema.methods = {
  // encryptPassword: (password) => {
  encryptPassword: function (password) {
    //Changed Due To UUIDV1 FOES NOT ACCEPT ARROW FUNCTION, NEWR VERSIONS OF UUID WILL ACCEPT THESE
    if (!password) {
      return "";
      //THIS MEANS RETURN BLANK
    } else {
      //CAN DO else{
      //IF CONDITION MATCHES, RETURNS, CODE TERMINATED.
      //IF CONDITION DOES NOT MATCH, NEXT LINE OF CODE
      //HENCE, THE ELSE CODE HERE CAN BE REMOVED ASWELL
      try {
        return (
          crypto
            .createHmac("sha256", this.salt)
            //HERE, SHA256 IS ALGORITHM THAT IS CALLED HERE which is the encryption format USED HERE.
            .update(password)
            .digest("hex")
        );
        //HERE EVERYTHING IS IN SINGLE LINE, AS . means in same line
        //createHmac Creates Encrypted Password using sha256 on password with unique of this.salt
        //update Updates the new password
        //digest convertes the password into hex i.e hexadecimal
      } catch (error) {
        return error;
      }
    }
  },

  authenticate: function (plaintext) {
    //IN PLAINTEXT, THE USER INPUT PASSOWRD SITS IN PLAIN TEXT FORMAT, ONLY THEN IT GOES FOR ENCRYPTION.
    return this.encryptPassword(plaintext) === this.hashed_password;
    //This code is checking if the password exactly matches the hashed password. === means checking even the data type along with value
    //THIS IS DONE AFTER THE PLAIN TEXT IS FIRST SET CONVERTED TO ENCRYPTED PASSWORD VIA encryptPassword FUNCTION AND IT COMPARES ONLY THEN
  },
  //AUTHENTICATE = TO CHEN WHEN LOGGIN IN
  //WE CANNOT CAMPARE USER PASSWORD WITH PASSWORD IN DATABASE AS PASSWORD IN DATABASE IS IN ENCRYTED FORM
  //THIS WILL CREATE A DILEMMA SO
  //HENCE AUTHENTICATE CONVERTS THE USER TYPED PASSWORD INTO ENCRYPTED FORM AND THEN COMPARE THAT ENCRYPTED PASSWORD WITH THE ONE IN DATABASE
  //HENCE, THIS WILL AUTHENTICATE THE USER AND GIVE ACCESS ONLY AFTER AUTHENTICATION IS SUCCESSFUL

  //IN ARROW FUNCTION:-
  // authenticate: (plaintext)=>{
  //     return this.encryptedPassword(plaintext) ===this.hashed_password
  // }
};

module.exports = mongoose.model("User", userSchema);
//MOVES CODE LINES USING ALT KEY ON WINDOWS AND OPTION KEY ON MAC

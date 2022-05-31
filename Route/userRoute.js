//ALL SENSITIVE INFORMATION ARE SENT VIA POST METHOD
const express = require("express");
// const router = require("router");
const {
  addUser, //Called Function From UserController named addUser
  userSignin, //Called Function From UserController named userSignin
  userSignout, //Called Function From UserController named userSignout
  verifyUser, //Called Function From UserController named verifyUser
  resendVerification, //Called Function From UserController named resendVerification
  forgetPassword, //Called Function From UserController named forgetPassword
  resetPassword, //Called Function From UserController named resetPassword
  userList, //Called Function From UserController named userList
  findUser, //Called Function From UserController named findUser
} = require("../Controller/userController"); //To Import addUser Function From User Controller
const { userValidation } = require("../Validation/userValidation"); //To Import userValidation Function From User Validation
const router = express.Router(); //Imported For Enabling Route Capabilities
// router.post("/addUser", addUser); //Route Path Defined; Left addUser = our custom path name, right addUser = Function
//Same Code With UserValidation
//router.post("/addUser", userValidation, addUser); //Route Path Defined; Left addUser = our custom path name, right addUser = Function
//Same Code after adding userValidation and SendEmail
router.post("/addUser", userValidation, addUser); //Route Path Defined; Left addUser = our custom path name, right addUser = Function

//To Sign In
router.post("/signin", userSignin);

//To Sign Out
router.get("/signout", userSignout);
//Get Method as we dont need to send anything like in post, so GET IS MORE SUITABLE

//To Check Confirmation i.e For Verification
router.get("/confirmation/:token", verifyUser);

//To Check Confirmation Again i.e For Re Send Verification
router.post("/resendVerification", resendVerification);
//AS WE NEED EMAIL FROM USER. TOKEN TO SEND FOR WHICH USER?

//For FORGET PASSWORD
router.post("/forgetPass", forgetPassword);

//RESET PASSWORD
router.post("/resetpassword/:token", resetPassword);
// /:token as we need to reset password of one that has that exact token no one else

//To See All USER
router.get("/userlist", userList);

//TO FIND A PARTICULAR USER
router.get("/finduser/:userid", findUser);
module.exports = router;

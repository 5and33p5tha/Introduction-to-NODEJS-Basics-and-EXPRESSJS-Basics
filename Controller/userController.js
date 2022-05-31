const User = require("../Model/user");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const expressJWT = require("express-jwt");
// const user = require("../Model/user");
const sendEmail = require("../Utils/setEmail");
const crypto = require("crypto");
const Token = require("../Model/tokens");
const { token } = require("morgan");
const res = require("express/lib/response");

// to add new user
exports.addUser = async (req, res) => {
  let user = new User({
    //let user is the object we created where we put the following values.
    //req.body means it checks from the input value of user
    // name: req.body.name, //Input name (req.body.name)sits in name column name in user.js i.e Model
    first_name: req.body.first_name, //Input name (req.body.first_name)sits in name column name in user.js i.e Model
    last_name: req.body.last_name, //Input name (req.body.last_name)sits in name column name in user.js i.e Model
    date_of_birth: req.body.date_of_birth, //Input name (req.body.date_of_birth)sits in name column name in user.js i.e Model
    gender: req.body.gender, //Input name (req.body.gender)sits in name column name in user.js i.e Model
    email: req.body.email,
    password: req.body.password,
  });
  User.findOne({ email: user.email }, async (error, data) => {
    //Find One Checks IF THE EMAIL in table in model with user input email, i.e To Check if the email IS REGISTERED ALREADY OR NOT
    if (data == null) {
      //That Email Is Not Found In Database
      //i.e If Email Does Not Exist, Save It

      user = await user.save(); //this will save user in user, i.e user from let

      //TO CREATE A TOKEN FOR USER
      //this token will be saved in database and not in cookie. THIS WILL BE USED IN VERIFICATION PROCESS
      let token = new Token({
        //This Token is the model
        token: crypto.randomBytes(16).toString("hex"), //THIS TOKEN IS A  FIELD OF MODEL TOKEN
        //randomBytes(16) is a crypto function. here it generates random and 16 here means 16 characters long
        //toString('Hex') = converting in hexadecimal.
        //It is faster for computer to understand in hexadecimal format. IT IS EVEN FASTER TO UNDERSTAND IN BINARY FORMAT BUT IT WILL BE TOO LONG
        //In Login BELOW:- JWT.SIGN CREATES NEW RANDOM TOKEN. THIS IS DONE IN TWO STEPS IN ABOVE I.E NEW TOKEN AS STEP 1 AND CRYPTO IN STEP 2
        userId: user._id, // THIS USER ID WILL BE THE SAME ONE WHICH WILL BE IN USER.SAVE
      });
      token = await token.save();
      if (!token) {
        //i.e If Token Save in Unsuccessful
        res.status(400).json({ error: "Something Went Wrong" });
      }

      //To Send Verification Email
      const url =
        process.env.FRONTEND_URL + "/email/confirmation/" + token.token;
      //Frontend_Url of env of .env file
      //The Above WILL BE SHOWN ON USER URL BAR AND WILL SHOW HIS TOKEN.
      //(CLICK ON USERS VERIFY BUTTON ON MAILTRAP TO BE MORE SPECIFIC. THIS IS WHAT WILL BE SHOWN ON URL AFTER CLICKING)
      ///email/confirmation: TO BE DEFINED AND WILL BE DEFINED IN FRONT END (NOT BACK END)

      //THIS MEANS, FROM FRONTEND, CLICK (WHERE WE DEFINED) TO GO TO THE ABOVE GIVEN URL AND IN THERE
      //WE WILL WRITE CONFIRMATION CODE AND CLICK IT TO GET EMAIL CONFIRMATION.

      sendEmail({
        //THE FOLLOWING FROM, TO, ETC ARE MAIL OPTIONS
        //Called Function sendEmail FROM setEmails
        //this is just to send the email and token. NOT THE TOKEN MATCH STEP
        from: "noreply@ourpage.com", //Normally, it is standard to have noreply at i.e if user sends email, it wont get replied back.
        //From is OUR EMAIL i.e From Where WE HAVE SENT EMAIL
        to: user.email, //user.email as for each user, IT MUST HAVE THEIR OWN EMAIL AND NO ONE ELSE'S.
        //To is users email
        subject: "VERIFICATION EMAIL",
        //THE FOLLOWING ROUTE IS FOR BACK END AND NOT THE USER. BACKEND ROUTES LIKE addUser, addCat, addProd, etc
        //The Following Code Requires Modification So It Commented And Written Later
        // text: `Click on the following link to verify your account. \n\nhttp://${req.header.host}/user/confirmation/${token.token}`, //THIS WILL JUST SEND THE USERS TOKEN.
        //http://${req.header.host}/user/confirmation/${token.token} = THE LINK TO GET VERIFIED AFTER CLICKING
        //${token.token}; THE FIRST TOKEN IS MODEL AND LAST TOKEN IS FIELD
        ///user/confirmation/ IS ROUTE IN THE BACK END (NOT FRONT END) WHICH WE WILL DEFINE IN FRONTEND
        //HEADERS.HOST = url PORTION of backend i.e LOCALHOST:8000, ETC.
        // text: ` Hello, \n Please click on the following link to verify your email.\n http:\/\/${req.headers.host}\/user\/confirmation\/${token.token}`,
        //NOW CHANGED FOR BETTER ROUTE
        text: ` Hello, \n Please click on the following link to verify your email.\n http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`,
        //We have changed user to api here,
        //this difference allows us to set route as /confirmation as /api IS ALREADY SET IN INDEX.JS FOR USER ROUTES.
        //IF NOT, WE WILL HAVE TO WRITE IT AS api/user/confirmation (/api as set in index.js and /user/confirmation as it is defined above)
        //SIMPLY PUT, IF /API IS SET, NO NEED TO DO /API/API/CONFIRMATION
        html: `<button><a href='${url}'>Verify Here</a></button>`,
      });

      if (!user) {
        //User save is unsuccessful
        return res.status(400).json({ error: "something went wrong" });
        //This Message Occurs If There is Problem While Saving
      } else {
        // IF Save Is Successful
        res.send(user);

        //THIS (user) IS CALLED IN FRONTEND in Then
      }
    } else {
      return res.status(400).json({ error: "Email already exists." });
      //This Message is Displayed if the email already exists
    }
  });
};

//TO SEND VERIFICATION LINK AGAIN FOR EXPIRED  LINKS.
//I.E RESEND VERIFICATION LINK
exports.resendVerification = async (req, res) => {
  //To Check IF User Is Already Verified
  let user = await User.findOne({ email: req.body.email });
  //user is custom defined term here and User is the model where email from the body will be searched.
  if (!user) {
    return res
      .status(400)
      .json({ error: "The email is not registered. Please register" });
  }
  //If Error occurs, it will terminate in above part and never reach following
  //Hence, The Following is Like Else But NOT Cmpletely ELSE
  if (user.isVerified) {
    return res
      .status(400)
      .json({ error: "User already verified. Login to continue" });
  }

  //TO CREATE A NEW TOKEN FOR USER
  //THIS PROCESS IS SAME AS ABOVE
  //this token will be saved in database and not in cookie. THIS WILL BE USED IN VERIFICATION PROCESS
  let token = new Token({
    //This Token is the model
    token: crypto.randomBytes(16).toString("hex"), //THIS TOKEN IS A  FIELD OF MODEL TOKEN
    //randomBytes(16) is a crypto function. here it generates random and 16 here means 16 characters long
    //toString('Hex') = converting in hexadecimal.
    //It is faster for computer to understand in hexadecimal format. IT IS EVEN FASTER TO UNDERSTAND IN BINARY FORMAT BUT IT WILL BE TOO LONG
    //In Login BELOW:- JWT.SIGN CREATES NEW RANDOM TOKEN. THIS IS DONE IN TWO STEPS IN ABOVE I.E NEW TOKEN AS STEP 1 AND CRYPTO IN STEP 2
    userId: user._id, // THIS USER ID WILL BE THE SAME ONE WHICH WILL BE IN USER.SAVE
  });
  token = await token.save();
  if (!token) {
    //i.e If Token Save in Unsuccessful
    res.status(400).json({ error: "Something Went Wrong" });
  }

  //To Send Verification Email
  const url = process.env.FRONTEND_URL + "/email/confirmation/" + token.token;
  //The Above WILL BE SHOWN ON USER URL BAR AND WILL SHOW HIS TOKEN.
  //(CLICK ON USERS VERIFY BUTTON ON MAILTRAP TO BE MORE SPECIFIC. THIS IS WHAT WILL BE SHOWN ON URL AFTER CLICKING)
  ///email/confirmation: TO BE DEFINED AND WILL BE DEFINED IN FRONT END (NOT BACK END)

  //THIS MEANS, FROM FRONTEND, CLICK (WHERE WE DEFINED) TO GO TO THE ABOVE GIVEN URL AND IN THERE
  //WE WILL WRITE CONFIRMATION CODE AND CLICK IT TO GET EMAIL CONFIRMATION.

  sendEmail({
    //THE FOLLOWING FROM, TO, ETC ARE MAIL OPTIONS
    //Called Function sendEmail FROM setEmails
    //this is just to send the email and token. NOT THE TOKEN MATCH STEP
    from: "noreply@ourpage.com", //Normally, it is standard to have noreply at i.e if user sends email, it wont get replied back.
    //From is OUR EMAIL i.e From Where WE HAVE SENT EMAIL
    to: user.email, //user.email as for each user, IT MUST HAVE THEIR OWN EMAIL AND NO ONE ELSE'S.
    //To is users email
    subject: "RE-VERIFICATION EMAIL",
    //THE FOLLOWING ROUTE IS FOR BACK END AND NOT THE USER. BACKEND ROUTES LIKE addUser, addCat, addProd, etc
    //The Following Code Requires Modification So It Commented And Written Later
    // text: `Click on the following link to verify your account. \n\nhttp://${req.header.host}/user/confirmation/${token.token}`, //THIS WILL JUST SEND THE USERS TOKEN.
    //http://${req.header.host}/user/confirmation/${token.token} = THE LINK TO GET VERIFIED AFTER CLICKING
    //${token.token}; THE FIRST TOKEN IS MODEL AND LAST TOKEN IS FIELD
    ///user/confirmation/ IS ROUTE IN THE BACK END (NOT FRONT END) WHICH WE WILL DEFINE IN FRONTEND
    //HEADERS.HOST = url PORTION of backend i.e LOCALHOST:8000, ETC.
    // text: ` Hello, \n Please click on the following link to verify your email.\n http:\/\/${req.headers.host}\/user\/confirmation\/${token.token}`,
    //NOW CHANGED FOR BETTER ROUTE
    text: ` Hello, \n Please click on the following link to verify your email.\n http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`,
    //We have changed user to api here,
    //this difference allows us to set route as /confirmation as /api IS ALREADY SET IN INDEX.JS FOR USER ROUTES.
    //IF NOT, WE WILL HAVE TO WRITE IT AS api/user/confirmation (/api as set in index.js and /user/confirmation as it is defined above)
    //SIMPLY PUT, IF /API IS SET, NO NEED TO DO /API/API/CONFIRMATION
    html: `<button><a href='${url}'>Verify Here</a></button>`,
  });

  res.json({
    message: "Verification Mail Has Been SENT AGAIN. pLEASE CHECK YOUR MAIL",
  });
};

//TO VERIFY THE USER
exports.verifyUser = (req, res) => {
  //To Check Token
  //To Check token, we initaially have to find it. so,
  Token.findOne({ token: req.params.token }, (error, token) => {
    //Token = model
    //HERE, req.params.token is the token from the URL, It will SEARCH THAT field i.e token of Model TOKEN TO SEE IF THAT token IS THERE
    if (error || !token) {
      //error occurs i.e connection error and //no token found even after connected successfully
      return res
        .status(400)
        .json({ error: "invalid token or token may have expired" });
    }

    //HERE WE HAVE USED CALLBACK FUNCTION. THE CALLBACK FUNCTION USED IS:-
    //(error, token) => {
    // if (error || !token) {
    //   //error occurs i.e connection error and //no token found even after connected successfully
    //   return res
    //     .status(400)
    //     .json({ error: "invalid token or token may have expired" });
    // }
    //BRACKET NOT CLOSED HERE AS SAME TOKEN AND SAME ID SHOULD MATCH FOR CHECKING the token in field token of Model Token

    //IF BRACKET IS CLOSED HERE, THE TOKEN LIFE ENDS BEFORE CHECKING OR VERIFICATION

    User.findOne({ _id: token.userId }, (error, user) => {
      //User = User Model
      //Note, id is always written as _id as it is shown like that in database(mongodb)
      //HERE, req.params.token is the token from the URL, It will SEARCH THAT field i.e _id of Model USER TO SEE IF THAT ID IS THERE
      if (error || !user) {
        //user = user from user.findOne
        //error occurs i.e connection error and //no user found even after connected successfully
        return res.status(400).json({ error: "Unable To FInd The User" });
      }
      //BRACKET NOT CLOSED HERE AS SAME _id SHOULD MATCH checking _id in forld _id for Model User

      //IF BRACKET IS CLOSED HERE, THE TOKEN LIFE ENDS BEFORE CHECKING OR VERIFICATION

      if (user.isVerified) {
        //user = user from user.findOne
        //To Check if user is ALREADY VERIFIED
        return res
          .status(400)
          .json({ error: "User Already Verified, Please Log In To Continue" });
      }

      //NOW TO VERIFY USER AFTER CHECKING TOKEN
      user.isVerified = true;
      //Will Make VERIFICATION = TRUE IN MONGODB ASWELL
      user.save((err) => {
        //err IS OUR CUSTOMED DEFINED CALL BACK FUNCTION
        if (err) {
          return res.status(400).json({ error: err });
          //This json({error:err}) means PUT ERR INTO ERROR IN JSON FORMAT
        }
        //NOW THE FOLLOWING WILL REPRESENT ELSE CONDITIONS
        //ELSE IS NOT USED AS IF ERRORS OCURS, THE PROGRAM TERMINATES, SO THIS IS MORE LIKE A PROGRAM AFTER SUCCESSFUL OVERCOMMING OF ABOVE IF CONDITION
        res.json({ message: "Congratulations, Your Account Is Verified" });
        //HERE, NO STATUS(400)OR STATUS(200) AS THIS MESSAGE IS TO BE SHOWN TO USER AND NOT IN CONSOLE
        //STATUS SHOWS IT IN FIXED PORT CONSOLES LIKE 400 FOR ERRORS AND 200 FOR SUCCESS MESSAGES.
      });
    });
  });
};

//For Signin
exports.userSignin = async (req, res) => {
  //De-structuring email and password so we can check them separately
  const { email, password } = req.body; //req.body means the datas come from user as request and from body part and not the url

  //NOW To Chech if email is registered or not
  //IN KISHOR SIR'S FILE, HE HAS USED user INSTEAD of loginuser
  const loginuser = await User.findOne({ email });
  //HERE, THE USER IN AWAIT USER.FIND ONE IS MODEL
  //Will Look For The Input Email in database
  if (!loginuser) {
    return res.status(400).json({ error: "email not found" });
  }
  //NOW To Chech if PASSWORD MATCHES or not
  if (!loginuser.authenticate(password)) {
    //loginuser IS  our defined variable from const users,
    //authenticate is our defined function from USER.JS I.E IN MODEL
    //(!users.authenticate(password) = IF AUTHENTICATION FAILS FOR USER OR IN THIS CASE LOGINUSER
    return res.status(400).json({ error: "password does not match" });
  }
  //NOW to check if user is verified or not.
  //NOTE:- JUST CREATING AN ID DOES NOT MEANS VERIFIED. VERIFICATION CAN BE  VIA SMS OR GMAIL ETC.
  //THIS IS TO CHECK IS THE USER OR IN THIS CASE LOGINUSER IS VERIFIED OR NOT
  if (!loginuser.isVerified) {
    //loginuser IS  our defined variable from const users,
    //isVerified is our defined function from USER.JS I.E IN MODEL
    //(!users.isVerified) = IF Verification has not been done by the user or IN THIS CASE LOGINUSER
    return res
      .status(400)
      .json({ error: "The Email is not verified, Please verify to continue" });
  }

  //TO GENERATE WEB TOKEN USING USER_ID AND JWT FUNCTION
  const token = jwt.sign(
    //THIS WEB TOKEN IS DIFFERENT FROM THE ABOVE TOKENS.
    //JWT.SIGN CREATES NEW RANDOM TOKEN. THIS IS DONE IN TWO STEPS IN ABOVE I.E NEW TOKEN AS STEP 1 AND CRYPTO IN STEP 2
    //THIS TOKEN IS SPECIFICALLY USED IN LOGIN AND STAYING LOGGED IN AND WILL BE CLEARED AFTER SIGNOUT
    //jwt.sign is a jwt function for token generation
    //HERE, jwt is the jwt we have called on top to be used here
    { _id: loginuser._id, loginuser: loginuser.role },
    process.env.JWT_SECRET
  );
  //jwt.signin means in signin
  //_id will have user._id
  //loginuser will have loginuser.role i.e the role will be set here based on the authentication
  //process.env.JWT_SECRET is the code in .env file which we have called
  res.cookie("myCookie", token, { expire: Date.now() + 999999 });
  //myCookie is the custom have we have given to cookie
  // token = generated token for this loginuser
  // expire : means expire after this much time in seconds

  // THE FOLLOWING CODE WILL Return information to front end
  const { _id, name, role } = loginuser; //This is de-structuring done so that _id, name and isAdmin can be used instead of all.
  //Else, It will take all Like:-
  // id, name, email, role, hashed_password, etc.
  return res.json({ token, loginuser: { name, email, role, _id } });

  //To DO Without De-Structuring:-
  //return res.json({token, name:user.name, email:user.email, id:user._id

  //To Display All:-
  // const {_id, name, role} = user
  //return res.json({token, user
  //})
};

//TO Sign Out i.e UserSign Out
exports.userSignout = (req, res) => {
  res.clearCookie("myCookie"); //WILL CLEAR COOKIE
  res.json({ message: "Signed out successfully." }); //MESSAGE AFTER SUCCESSFUL SIGNOUT
};

//FORGET PASSWORD
exports.forgetPassword = async (req, res) => {
  //find user, i.e Check If User Exists in USERS TABLE ie. User is registered or Not.
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ error: "User not found. Please register." });
  }

  // generate token if user is found
  //Token For Password Reset
  let token = new Token({
    //token is a data row or our custome defined token
    //eg:- token:-an8asi9ad90ana0x90ausa0, the token is the one defined above
    userId: user._id, //THE userID is a Field of Model TOKEN
    token: crypto.randomBytes(16).toString("hex"),
    //Using Crypto To Encrypt and Hex to Convert in Hexa Decimal.
    //THE token is a Field of Model TOKEN
  });

  // Save Token In Database
  token = await token.save();
  //this token is the same one as let in above
  //token in left will have the value from above saved in it. THIS IS NEW TOKEN DATA IN DATABASE
  if (!token) {
    //i.e. If Token Save Was Uncessfull or Not Token Found For The User
    return res.status(400).json({ error: "something went wrong" });
  }

  // Send Email For FORGOT PASSWORD
  //From FrontEND We Will Call The Following.
  // const url = `http:\/\/${req.headers.host}\/api\/resetpassword\/${token.token}`
  //i.e After Clicking on Const URL, We Have To Call ANOTHER FUNCTION CALLED RESET PASSWORD
  sendEmail({
    from: "no-reply@ourstore.com",
    to: user.email, //users email
    subject: "Password Reset Link",
    text: ` Please click on the link below to reset your password. <br> \n http:\/\/${req.headers.host}\/api\/resetpassword\/${token.token}`,
    html: `<button>Reset Password</button>`,
  });
  res.json({ message: "Password Reset Link Has Been Sent Successfully" });
};

//TO RESET PASSWORD
exports.resetPassword = async (req, res) => {
  // find valid token
  let token = await Token.findOne({
    token: req.params.token,
    //To Check If token from email matches token in database
  });
  if (!token) {
    return res
      .status(400)
      .json({ error: "Invalid token, or token may have expired." });
  }
  // Find User If Token Is Valid
  let user = await User.findOne({ email: req.body.email, _id: token.userId });
  //IN MONGODB, ID IS ALWAYS WRITTEN AS _ID
  //HERE WE ARE SEARCHING USER VIA TWO CONDITIONS,
  // 1. CHECK IF EMAIL MATCHES THE any of user field registered in USER MODEL
  if (!user) {
    //i.e If No user Found
    return res.status(400).json({ error: "Email not registered." });
  }

  //CODE TO  RESET PASSWORD
  user.password = req.body.password;
  //SET NEW PASSWORD.
  //TAKE PASSWORD FROM BODY AND SET IN PASSWORD OF USER FIELD IN MODEL

  user = await user.save();

  if (!user) {
    return res.status(400).json({ error: "failed to update password" });
  }
  res.json({ message: "password has been rest successfully." });
};

// To View All Users
exports.userList = async (req, res) => {
  const user = await User.find().select("-hashed_password"); //i.e : (MINUS) - HASHED_PASSWORD MEANS EXCEPT THAT FIELD i.e Dont Show That Field
  //user is our custom defined variable and User is the Name of The Model
  //FIND ALL IN USER MODEL WHO HAVE HASHED PASSWORD
  if (!user) {
    //i.e If No User of Such Found
    return res.status(400).json({ error: "something went wrong" });
  }
  res.send(user);
  //send user as a result.
};

// To FIND INDVIDUAL/PARTICULAR USER
exports.findUser = async (req, res) => {
  //findUser i.e via User List and Checking:- FOR ADMIN
  const user = await User.findById(req.params.userid).select(
    //params means from URL
    //SINCE WE ARE CLICKING FROM LIST, SO THAT USER_ID CLICK WILL BE IN URL. HENCE WE USE DO USER_ID INSTEAD OF EMAIL
    //FOR SEARCHING INSTEAD OF CLICKING LIKE ABOVE, IT IS EASIER TO SEARCH VIA EMAIL
    "-hashed_password"
  ); //i.e : (MINUS) - HASHED_PASSWORD MEANS EXCEPT THAT FIELD i.e Dont Show That Field

  if (!user) {
    return res.status(400).json({ error: "user not found" });
  }
  res.send(user);
};

//AUTHORIZATION
//THOSE WHO HAVE AUTHORIZATION CAN DO .... ELSE CANNOT MAKE ANY CHANGES
exports.requireSignin = expressJWT({
  //expressJWT
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], //Algorithm For Json Web Token Encryption
  userProperty: "auth", //SET USER PROPERTY AS AUTH, NO ACTUAL USE BUT ONLY DESCRIPTION
});

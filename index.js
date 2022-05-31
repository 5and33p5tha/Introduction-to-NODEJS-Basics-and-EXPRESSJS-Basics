// In express, what we create is api. Here, index.js is our api file
//IT IS BETTER TO PUT ALL REQUIRED FILE I.E CONST IN SINGLE GROUPS. THE FOLLOWING IS KEPT LIKEWISE FOR UNDERSTANDING PURPOSE ONLY
//SIMILARLY, PUT ALL MIDDLEWARES IN SINGLE GROUPS

//Note:- TO CALL JS FILES THAT DOES NOT HAVE A DEFAULT EXPORT, WE CREATE OUR OWN I.E SET ITS PERSONAL NAME
//EG:-
//For OrderRoute
// const OrderRoute = require('./Route/orderRoute');
//HERE, AS OrderRoute is Custom Defined Set For Route
//Now To Use OrderRoute
// app.use("/api", OrderRoute)

const express = require("express");
// To Create Express Api. In Express, Require = Import

require("dotenv").config();

const db = require("./Database/connection");
// Can Also Do:-
// app.get('/',(A,B)=>{
//      A = request, B = response
//     res.send("Welcome To ExpressJS")
// })

//To Use Product Validation
const expressValidator = require("express-validator");

//For showInfo and showMessage "Cannot GET/"
//Can be done after bodyparser aswell

const body_Parser = require("body-parser");

//To use any function, we first import and then use it via app.use

//For Category Route
const CategoryRoute = require("./Route/categoryRoute");

//For Product Route
const ProductRoute = require("./Route/productRoute");

//For UserRoute
const UserRoute = require("./Route/userRoute.js");

//For OrderRoute
const OrderRoute = require("./Route/orderRoute");
//HERE, AS OrderRoute is Custom Defined Set For Route
//Now To Use OrderRoute

const morgan = require("morgan");

const cookieParser = require("cookie-parser");

const cors = require("cors");

//To Use Node Mailer
// const nodemailer = require("nodemailer");

const app = express();

const port = process.env.PORT || 8765;
// It WIll Open THE CODE IN  .env file and run the PORT code, Is Case Sensitive.
// If The Given Port Does Not Run, It Will Choose Port 8765, || is or symbol
// port is our created port and PORT is The .env CODE

// app.get('/',(request,response)=>{
//     response.send("welcome to express js. we are starting express today. Thank you")
// })

//To Solve cannot GET/
// app.get("/", (req, res) => {
//   req = request, res = response
//   res.send("Welcome To ExpressJS");
// });

//Middleware starts (IN ORDER i.e should be before route)

// middleware = to connect front and back end. Are UTILITIES BUT NOT A EXACT PART OF ANYTHING.

//Always Use app.use(bodyparser) before app.use ("/xyz")
app.use(body_Parser.json());
//USE BODYPARSER ABOVE THE USE. WE HAVE A TOP TO BOTTOM APPROACH SO INITIALLY BODYPARSER CONVERTS THE DATA INTO JSON FORMAT
app.use("/public/uploads", express.static("public/uploads"));
//Here, /public/uploads is the URL and express.static ('public/uploads is the folder name to be used')
//USE BODYPARSER ABOVE THE USE. WE HAVE A TOP TO BOTTOM APPROACH SO INITIALLY BODYPARSER CONVERTS THE DATA INTO JSON FORMAT
//HENE STEP-1 = BODY PARSER AND SETP-2 = USE

app.use(morgan("dev"));
//morgan shows which route is in use in server. Including errors and success message ports

app.use(expressValidator());
app.use(cookieParser());
app.use(cors());

// app.use(nodemailer());
//NODEMAILER IS USED IN SEND MAIL

//middleware ends

app.use("/xyz", CategoryRoute);
//better to use /api as it is standard
//Here, xyz is our custom defined route

//Now For Product Route
app.use("/abc", ProductRoute); //can also give same link as above i.e /xyz

// Can Also Do:-
// app.use("/xyz", ProductRoute);

//UserRoute is our defined custom name. And /userRoute.js is our file i.e js file
app.use("/api", UserRoute);
//THIS MEANS USE /API FOR ALL THAT COMES FROM USERROUTE

app.use("/api", OrderRoute);
//THIS MEANS USE /API FOR ALL THAT COMES FROM ORDERRROUTE

app.listen(port, () => {
  // Listen will run port which has PORT = 5000 after running the server. It Basically chooses the port. includes.e, it runs what is in the port creasted above

  console.log(`The SERVER has started successfully at ${port}`);
});

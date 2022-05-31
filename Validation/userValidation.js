//IN LOCAL STORAGE, EVERYTHING IS SAVED IN STRING FORMAT, HENCE WE CONVERT IN JSON FORMAT
exports.userValidation = (req, res, next) => {
  // req.check("name", "Name is required").notEmpty(); //name here should match name as in model
  req.check("first_name", "FIRST NAME is required").notEmpty(); //first_name here should match first_name as in model
  req.check("last_name", "LAST NAME is required").notEmpty(); //last_name here should match last_name as in model
  req.check("date_of_birth", "DOB is required").notEmpty(); //date_of_birth here should match date_of_birth as in model
  req.check("gender", "GENDER is required").notEmpty(); //gender here should match gender as in model
  req
    .check("email", "Email is required")
    .notEmpty()
    .isEmail() //.isEMAIL CHECKS IF THE FORMAT MATCHES EMAIL.
    .withMessage("Email format invalid"); //Error Message For Email
  req
    .check("password", "Password is required")
    .notEmpty()
    .isLength({ min: 8, max: 30 }) //This Means Password Should be aminimum of 8 characters and maximum of 30 characters
    .withMessage("Password must be between 8 and 30 characters"); //Error Message For Password
  //Can Also Do Different MESSAGE FOR MINIMUM AND MAXIMUM
  //FOR MINIMUM
  //.isLength({ min: 8}) //This Means Password Should be aminimum of 8 characters and maximum of 30 characters
  //.withMessage("Password must be MINIMUM 8 characters"); //Error Message For Password
  //FOR MAXIMUM
  //.isLength({ max: 30}) //This Means Password Should be aminimum of 8 characters and maximum of 30 characters
  //.withMessage("Password must be MAXIMUM 30 characters"); //Error Message For Password

  const errors = req.validationErrors();
  //validationError() IS PRE-DEFINED FUNCTION OF JS. IT TAKES ERRORS IN THIS CASE FROM REQUEST AND SAVE IT IN ARRAY FORM.
  //It Does So Automatically i.e saves in array format automatically.
  //error is our custom defined variable where validation errors sits
  if (errors) {
    //showRrror is our custom defined variable where we have mapped errors of above
    const showError = errors.map((err) => err.msg)[0]; //[0]=Show Error one at a time.
    //showError will show error one at a time from array index 0. It will only show next error if the previous one is solved.
    return res.status(400).json({ error: showError });
  }
  next();
  //next is a call back function here. This indicates THAT AFTER THIS PROGRAM IS SUCCESSFULL, GO WHERE WE HAVE DEFINED NEXT.
};

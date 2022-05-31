//product validation

//category validation

//ALL VALIDATION CAN BE DONE IN SAME PAGE ALL THAT MATTERS IS THAT THE IMPORT MATCHES.

exports.productValidation = (req, res, next) => {
  //Instead of (req, res, next), we can also write (x, y, z) but we have to follow up the remaining functions in same manner
  //next is a function like callback function which passes the value on after the validation is complete.
  //i.e after productValidation, it passes in to addProduct() in ProductRoute.js
  //INSTEAD OF NEXT, WE CAN GIVE OUR CUSTOM NAME
  req.check("product_name", "Product name is required").notEmpty();
  //CHECK checks the product name.
  //notEmpty makes it a must and should not be empty
  //check and notEmpty are built in functions
  //If product name is empty, the message 'Product name is required' is passed

  //The Following code is commented temporarily via version update errors in express-validator
  //   req.check("product_image", "Product name is required").notEmpty();
  //The ABOVE code is commented temporarily via version update errors in express-validator

  req
    .check("product_price", "Product Price is required")
    .notEmpty()
    .isNumeric()
    .withMessage("Price Must Be A Number");
  req
    .check("product_description", "Product description is required")
    .notEmpty()
    .isLength({ min: 10, max: 30 })
    .withMessage(
      "Price Description Must Be Minimum 10 Characters and Maximum 30 Characters Long"
    );
  req
    .check("Count_In_Stock", "Count In Stock is required")
    .notEmpty()
    .isNumeric()
    .withMessage("Count In Stock Must Be A Number");
  req.check("category", "category is required").notEmpty(); //AS CATEGORY IS SEPARATE FOM PRODUCTS, WE CAN COMMENT THIS LINE ASWELL
  //THE ABOVE CODE FOR CHECKING CATEGORY CAN BE COMMENTED IN THIS CASE ONLY
  //PUT THE CATEGORY ID FROM CATEGORY IN PRODUCT

  const errors = req.validationErrors(); //validationErrors is the built in function
  //error is our defined function
  //validationErrors()are the method of the validation, BY DEFAULT, THIS TAKES ALL THE ERRORS
  if (errors) {
    const showError = errors.map((err) => err.msg)[0];
    //NOTE:- ALL ERRORS SITS IN ARRAY BY DEFAULT DUE TO VALIDATIONERRORS()
    //This shows initial error first AS WE HAVE MAPPED, and only after that is resolved, the rest errors are shows
    //THUS, ERRORS ARE SHOWN BASED ON ARRAY INDEX

    //IF WE WANT TO SHOW ALL ERRORS ALL AT-ONCE
    //DO
    // const showError = errors.map(err=>err.msg)

    //showError is our defined function where
    //validationErro
    return res.status(400).json({ error: showError });
    //IF CONDITION MATCH = DISPLAY ERROR
  }
  next();
  //next = if no error; WORKS LIKE ELSE IN THIS CASE BUT IS A CALLBACK FUNCTION
};

const Product = require("../Model/product");
//To use Products as declared OBJECT or BETTER MODEL IN TERMS OF DATABASE in Product.js

//TO ADD PRODUCTS
exports.addProduct = async (req, res) => {
  let product = new Product({
    //Product = Model As Declared
    //Only input those that will be declared initially when adding products.
    //HENCE COMMENTS OR REVIEWS OR RATINGS ARE LEFT OUT AS FRROM PRODUCT.JS
    category: req.body.category, //req means to input from and req.body means that which comes from user
    product_name: req.body.product_name, //req means to input from and req.body means that which comes from user
    product_price: req.body.product_price, //req means to input from and req.body means that which comes from user
    // product_image: req.body.product_image, //req means to input from and req.body means that which comes from user
    //Now for actual image
    product_image: req.file.path,
    product_description: req.body.product_description, //req means to input from and req.body means that which comes from user
    Count_In_Stock: req.body.Count_In_Stock, //req means to input from and req.body means that which comes from user
    //This can be done in any order
    //The Left Part (say category:) SHOULD MATCH WITH MODEL I.E. PRODUCT.JS
    //The Right Part (say after req.body. i.e category)SHOULD MATCH WITH POSTMAN, IT MAY ALSO COME FROM THE USER
  });
  product = await product.save();
  if (!product) {
    return res.status(400).json({ error: "Something went wrong" });
  } else {
    res.send(product);
  }
};

//TO SHOW PRODUCTS
exports.showProducts = async (reqs, resp) => {
  // let products = await Product.find();
  let products = await Product.find().populate("category");
  //Incase of multiple models, we can do .populate("model1").populate("model2") aswell BUT its BETTER TO DO:-   populate: { path: "product", populate: "category" },
  //WHERE IN   populate: { path: "product", populate: "category" }, PRODUCT IS MODEL1 WHICH IS UNDER I.E BELONGS TO  CATEGORY WHICH IS MODEL 2
  //IF POPULATE IS NOT DONE, THE SHOWPROD WILLL NOT SHOW THE CATEGORY WHICH IT CAME FROM
  // This products can have same name as in above products or completely new
  //Here, Product = Model as Defined
  //.populate('') will show where it derived from or which field, In this case it is category
  //category is not the model but the field name as in product.js
  //In:-
  // category: {
  //   type: ObjectId,
  //   required: true, //No Empty Allowed
  //   ref: "Category", //This Will Link it to The Model named Category as created in export.default Category in Category.js
  // },
  if (!products) {
    return resp.status(400).json({ error: "Something Went Wrong" });
  } else {
    resp.send(products);
    //This will show products.
    //IF NO PRODUCTS, IT WILL SHOW BLANK TABLE
  }
};

exports.findProduct = async (req, res) => {
  //Find By ID Does Not Make It Exclusive To Be In Object Format
  let prod = await Product.findById(req.params.Pid); //This Pid can also be id or extra id but should match the name in router in ProductRoute.js
  //  Product is the model
  // This prod can have same name as in above products or completely new
  // Can Also Do:
  // let prod = await Category.findOne({_id: req.params.Pid}); or just id instead of Pid
  // Or
  // let prod = await Category.findOne({_id:req.params.Pid}); Object Form As It Has To Be Object
  if (!prod) {
    return res.status(400).json({ error: "Something Went Wrong Went Wrong" });
  } else {
    res.send(prod);
  }
};

exports.updateProduct = async (req, response) => {
  //reqs=request and resp = response for this only
  let prods = await Product.findByIdAndUpdate(
    //Here, prods = our custom defined variable and Product = Name of Model
    // This prods can have same name as in above category Like prod or product
    //findIdAndUpdate will search for and id and Update that ID and related data
    req.params.id,
    {
      category: req.body.category, //req means to input from and req.body means that which comes from user AND PLACE HERE
      product_name: req.body.product_name, //req means to input from and req.body means that which comes from user AND PLACE HERE
      product_price: req.body.product_price, //req means to input from and req.body means that which comes from user AND PLACE HERE
      // product_image: req.body.product_image, //req means to input from and req.body means that which comes from user AND PLACE HERE
      //Now for actual image
      product_image: req.file.path,
      product_description: req.body.product_description, //req means to input from and req.body means that which comes from user  AND PLACE HERE
      Count_In_Stock: req.body.Count_In_Stock, //req means to input from and req.body means that which comes from user  AND PLACE HERE
    },
    { new: true } //WILL DISIPLAY UPDATED DATA AFTER SUCCESSFUL UPDATE
  );
  if (!prods) {
    return response.status(400).json({ error: "something went wrong" });
  } else {
    response.send(prods);
  }
};

exports.deleteProduct = (reqs, resp) => {
  //reqs=request and resp = response for this only
  let DelProdts = Product.findByIdAndDelete(
    //can also do findByIDAndRemove
    //Here, Categories = our custom defined variable and Categories = Name of Model
    // This cate can have same name as in above category Like Cat or Ctry or category
    //findIdAndRemove will search for and id and Remove that ID and related data
    reqs.params.Did
  )
    .then((DelProdts) => {
      //Then Will TAKE EFFECT IF CONNECTED TO DATABASE
      if (!DelProdts) {
        return resp.status(400).json({ error: "product not found" });
        //THIS ERROR WILL POP UP IF DATABASE CONNECTION IS SUCCESSFUL BUT NO ID IS FOUND OR GIVEN ID DOES NOT MATCH
      } else {
        return resp.status(200).json({ msg: "product removed successfully" });
        //THIS MESSAGE WILL POP UP IF DATA REMOVAL IS SUCCESSFUL
      }
    })

    .catch((error) => resp.status(400).json({ error: error })); //Then Will TAKE EFFECT IF UNABLE TO CONNECTED TO DATABASE
};

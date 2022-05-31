//To Make a function to use category.js of Model

//The Following is just a test for categoryController.js
// exports.showInfo = (req, res) => {
//  exports is like rextur in react
//   res.send("Message From Controller");
// };

// exports.showMessage = (req, res) => {
//  exports is like rexturn in react
// res.send("This Is Another Message From Controller");
// };

//To Read From Server = GET Method
//To Write In SERVER To PUT VALUE IN SERVER= POST Method

//Now to save the data in a table i.e add and store
const { response } = require("express");
const Category = require("../Model/category");
//To use Category as declared OBJECT or BETTER MODEL IN TERMS OF DATABASE in Category.js

//Here, res = response and req = request

//The File Works On Our Given Port i.e 8000 For Me,
//Error Meaasges are passed in 400
//Success Message are passed in 200

exports.addCategory = async (req, res) => {
  //This async is to hold this function for user input and then response
  //addCategory is custom defined function an
  //req = to take input from user and res = to perform action based on the user input
  //   let cat = new Category(req.body); //here, cat is our user defined category.
  //req.body takes the data from the form and req.params takes the data from the URL
  //   cat = await cat.save();
  //   if (!cat) {
  //That is no value in category
  //     return res.status(400).json({ error: "Something Went Wrong While Adding" }); //i.e error is sent into 400 in .json as In MongoDB, everything is in JSON DATA FORMAT
  //   } else {
  //     res.send(cat);
  //   }
  // };

  //Now Doing The Same To Make Category Unique
  let cat = new Category(req.body);
  Category.findOne(
    //Here, Category is from the model and category is from let
    //findOne is a function that searches for specific category only once. Find on the other hand searches for all that is entire result independent of relativity
    { category_name: cat.category_name },
    async (error, data) => {
      //This async holds untill the data is found or searched  or untill error
      if (data == null) {
        //data = null signifies the data does not have the value that we seek. data = null and !data are different
        //This is for if the DATA IS NOT ALREADY THERE, do the following
        cat = await cat.save();
        //.save saves the entry in category. Here, the async should wait for this function before jumping to conclusions
        if (!cat) {
          //That is no value saved in category. This is different from category = null
          return res
            .status(400)
            .json({ error: "Something Went Wrong While Adding" }); //i.e error is sent into 400 in .json as In MongoDB, everything is in JSON DATA FORMAT
          //This Error Occurs While Saving or Adding due to various reasons say network error
        } else {
          res.send(cat);
          //This res.send shows us the input table as a result in POSTMAN
        }
      } else {
        return res.status(400).json({ error: "Category Already Exists" });
        //This Error Occurs While Trying to Save Something That Already Exists i.e IF DATA IS ALREADY THERE
      }
    }
  );
};

//To Show All Category
exports.showCategories = async (request, response) => {
  let Ctry = await Category.find();
  // This CTRY can have same name as in above category Like Cat
  if (!Ctry) {
    return response
      .status(400)
      .json({ error: "Something Went Wrong While Showing" });
  } else {
    response.send(Ctry);
  }
};

//To Find A Single Category
exports.findCategory = async (req, res) => {
  //Find By ID Does Not Make It Exclusive To Be In Object Format
  let cate = await Category.findById(req.params.Cid); //This Cid can also be id or extraid but shoul match the name in router in CategoryRoute.js
  // This cate can have same name as in above category Like Cat or Ctry or category
  // Can Also Do:
  // let cate = await Category.findOne({_id: req.params.Cid});
  // Or
  // let cate = await Category.findOne({_id:req.params.Cid}); Object Form As It Has To Be Object
  if (!cate) {
    return res.status(400).json({ error: "Something Went Wrong Went Wrong" });
  } else {
    res.send(cate);
  }
};

// to update a category
exports.updateCategory = async (reqs, resp) => {
  //reqs=request and resp = response for this only
  let categories = await Category.findByIdAndUpdate(
    //Here, Categories = our custom defined variable and Categories = Name of Model
    // This cate can have same name as in above category Like Cat or Ctry or category
    //findIdAndUpdate will search for and id and Update that ID and related data
    reqs.params.id,
    {
      category_name: reqs.body.category_name,
    },
    { new: true } //THIS will DISPLAY THE UPDATED VALUES AFTER SUCCESSFUL UPDATE
  );
  if (!categories) {
    return resp.status(400).json({ error: "something went wrong" });
  } else {
    resp.send(categories);
  }
};

// to delete a category
exports.deleteCategory = (reqs, resp) => {
  //reqs=request and resp = response for this only
  let Delcategories = Category.findByIdAndRemove(
    //Here, Categories = our custom defined variable and Categories = Name of Model
    // This cate can have same name as in above category Like Cat or Ctry or category
    //findIdAndRemove will search for and id and Remove that ID and related data
    reqs.params.Rid
  )
    .then((Delcategories) => {
      //Then Will TAKE EFFECT IF CONNECTED TO DATABASE
      if (!Delcategories) {
        return resp.status(400).json({ error: "category not found" });
        //THIS ERROR WILL POP UP IF DATABASE CONNECTION IS SUCCESSFUL BUT NO ID IS FOUND OR GIVEN ID DOES NOT MATCH
      } else {
        return resp.status(200).json({ msg: "category removed successfully" });
        //THIS MESSAGE WILL POP UP IF DATA REMOVAL IS SUCCESSFUL
      }
    })

    .catch((error) => resp.status(400).json({ error: error })); //Then Will TAKE EFFECT IF UNABLE TO CONNECTED TO DATABASE
};

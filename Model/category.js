//This is a model table to be used for category

// category is in general, Parent Table Format
//Say Mobile is a Category and iPhone 14 , Samsung Galaxy Fold 3 are Products

const mongoose = require("mongoose"); //This is to connect to mongodb

const categorySchema = new mongoose.Schema(
  {
    //The Structure of Table is Called Schema.
    //Model = Table
    //Here, categorySchema is our Created Schema Name where the STRUCTURE OF MONGGOSE SHOULD BE LIKE:-
    category_name: {
      type: String,
      required: true, //No Empty Allowed
      trim: true, //Will Cut Any SPACE Input Whether In Front or Back BUT NOT IN MIDDLE
    },
  },
  { timestamps: true }
);

//Here, Timestamps will give
// createdAt and UpdatedAt
module.exports = mongoose.model("Category", categorySchema);
//Here, 'Category' is our defined Object which contains the schema is categorySchema
//This is our model name

// module.exports is like export default in react

//ALTHOUGH CUSTOMER SEES EVERYTHING IN ONE PAGE, WE AT THE BACKEND DO THIS IN TWO DIFFERENT TABLES
//They are: Order and Order Items
//Do Order Items First

//orderitems - product, quantity, product description, etc
// phone 1 id1, item1
// headphoen 2 id2, item2

//order - [orderitems] , user-info, shipping-address,
// [orderitems] has [item1, item2, ......]

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
//CREATED ObjectId to take type:ObjectId Below

const orderItemSchema = new mongoose.Schema(
  {
    //mongoose .schema means in mongodb format

    product: {
      type: ObjectId,
      //ObjectId = Product ID
      ref: "Product",
      //ref shows which table, here it is product table from Product.js
      required: true,
      //required true MEANS NOT EMPTY ALLOWED
    },

    quantity: {
      type: Number,
      required: true,
      //required true MEANS NOT EMPTY ALLOWED
    },
  },

  { timestamps: true }
);
//timestams automatically imports two fields
//created at and updated at
//created at and updated at in postman is via timestamps

module.exports = mongoose.model("OrderItem", orderItemSchema);

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

const OrderSchema = new mongoose.Schema(
  {
    OrderItems: [
      {
        //Big Brackets as OrderItems is an array; Small Brackets as It Is necessary
        type: ObjectId,
        ref: "OrderItem", //LINKS TO ORDERITEMS.JS WHERE WE HAVE SET EXPORT DEFAULT AS OrderItem
        required: true,
      },
    ], //Big Brackets as OrderItems is an array

    user: {
      type: ObjectId,
      ref: "User", //LINKS TO USER.JS WHERE WE HAVE SET EXPORT DEFAULT AS User
      required: true,
    },

    shippingAddress: {
      type: String,
      required: true,
    },

    shippingAddress2: {
      type: String,
    },

    phone: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "pending",
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);

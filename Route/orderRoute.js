const express = require("express");
//Now calling respective functions FROM ORDER CONTROLLER
const {
  placeOrder,
  orderList,
  orderDetail,
  userOrder,
  updateOrder,
  deleteOrder,
} = require("../Controller/orderController");
const router = express.Router();

//FOR POSTORDER
router.post("/postorder", placeOrder);

//FOR ORDER LIST
router.get("/orderlist", orderList);

//FOR ORDER DETAILS
router.get("/orderdetail/:orderid", orderDetail);
module.exports = router;

//For User ORDER
router.get("/userorder/:userid", userOrder);

//FOR UPDATE ORDER
router.put("/updateorder/:orderid", updateOrder); //PUT AS IT NEEDS STATUS INPUT ASWELL

//FOR DELETE ORDER
router.delete("/deleteorder/:orderid", deleteOrder); //PUT AS IT NEEDS STATUS INPUT ASWELL

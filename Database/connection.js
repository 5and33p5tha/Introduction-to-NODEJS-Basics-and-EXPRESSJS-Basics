//This IS A NECESSARY STANDARD CODE FOR MONGODB
//This is to connect database of mongodb into express app (Current App)

const mongoose = require("mongoose"); //This is to connect to mongodb

mongoose
  .connect(process.env.DATABASE, {
    // here, DATABASE is THE Database in .env file
    useNewUrlParser: true, // To connect via url
    useUnifiedTopology: true, // TO Maintain Structure. That Send/Receive Will Be In JSON Format
  })

  .then(() => console.log("Database Connected")) //If Database is connected successfully, this message will be displayed in console.log
  .catch((err) => console.log(err)); //If Database Connection in unsuccessful, error will be sent in console.log

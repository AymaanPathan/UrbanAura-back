const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Auth = require("./Auth/Auth");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
const port = 8080;

app.get("/", (req, res) => {
  console.log("Received request on root route");
  res.send("HELLO");
});
// MongoDb Connection
const connectDb = async () => {
  try {
    const response = await mongoose.connect(
      "mongodb+srv://aymaan:1234@cluster0.rv9jdh7.mongodb.net/ecommerce",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000,
      }
    );
    if (response) {
      console.log("Connected To DataBase⭐");
    }
  } catch (error) {
    console.log("Error in Mongo", error);
  }
};
connectDb();

// Routing
const Router = express.Router();
Router.post("/register", Auth.Register);
Router.post("/login", Auth.Login);

app.use(Router);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server Started 🟢 on ${port}`);
});

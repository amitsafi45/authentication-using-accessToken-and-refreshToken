import express from "express";
import "dotenv/config";
import db from "./src/models/index.js";//database connection
import account from "./src/route/router.js";//registration and login routes
import verifys from "./src/middleware/verify.js";//token checking in header 
//import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
//app.use(cookieParser())
app.use("/api",account);


 //for checking purpose
 app.get("/api/home", verifys, (req, res) => {
   res.send("success");
 })

app.listen(process.env.PORT,  () => {
   db.sequelize.sync({force:false});
  console.log("listening");
});

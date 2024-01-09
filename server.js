const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors"); // Import the cors middleware
require('dotenv').config();
const db = require("./config/db");

const indexRouter = require("./routes/index");
//const userRouter = require("./routes/user");
const projectRouter = require('./routes/projectRoutes')
const authRouter = require("./routes/userRoutes")
const accountRouter = require("./routes/accountRoutes")

const app = express();
app.set("trust proxy", 1);
// app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(
//   session({
//     secret: "not my cat's name",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       maxAge: 60 * 60 * 1000, // 1 hour
//       // secure: true, // Uncomment this line to enforce HTTPS protocol.
//       sameSite: true
//     }
//   })
// );
app.use(passport.initialize());
app.use(passport.session());

// Use cors middleware with default options to allow all origins
app.use(cors());

// Use the database connection
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to the database");

  // Routes
  app.use("/", indexRouter);
  app.use("/user", authRouter);
  app.use("/project", projectRouter)
  app.use("/account", accountRouter)

  // Start the server
    const port = process.env.PORT || 8087;
    const listener = app.listen(port, "0.0.0.0", function () {
        console.log("Listening on " + listener.address().address + ":" + listener.address().port);
    });

});
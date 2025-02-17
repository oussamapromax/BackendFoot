var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const userRouter = require('./routes/usersRouter');
const terrainRouter = require('./routes/terrainRouter'); // Ensure this import is correct
const reservationRouter = require('./routes/reservationRouter');
const avisRouter = require('./routes/avisRouter');
const notificationRouter = require('./routes/notificationRouter');
const paymentRouter = require('./routes/paymentRouter');

const { connectToMongoDb } = require("./config/db");

require("dotenv").config();


const http = require("http"); //1

var indexRouter = require("./routes/indexRouter");
var usersRouter = require("./routes/usersRouter");
var osRouter = require("./routes/osRouter");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/os", osRouter);
app.use("/terrains", terrainRouter);
app.use("/reservations", reservationRouter);
app.use("/avis", avisRouter);
app.use("/notifications", notificationRouter);
app.use("/payements", paymentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const server = http.createServer(app); //2
server.listen(process.env.port, () => {
  connectToMongoDb()
  console.log("app is running on port 5000");
});

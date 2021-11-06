const express = require('express');
const mongoose = require('mongoose');
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const expressValidator = require('express-validator');

require('dotenv').config();

// import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// app
const app = express();


// db
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("DB Connected")).catch((err) => console.error(err));


// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(expressValidator());

// routes middlewares
app.use("/api", authRoutes);
app.use("/api", userRoutes);


const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App running on ${port}`)
});
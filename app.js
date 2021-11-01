const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

// import routes
const userRoutes = require('./routes/user');

// app
const app = express();


// db
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("DB Connected")).catch((err) => console.error(err));


// routes middlewares
app.use("/api", userRoutes);



const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App running on ${port}`)
});
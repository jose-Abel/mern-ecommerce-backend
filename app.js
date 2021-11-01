const express = require('express');
const app = express();
const dotenv = require('dotenv').config();


app.get('/', (req, res)=> {
  res.send("Hello from node");
});



const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App running on ${port}`)
});
const express = require('express');

const app = express();

app.use(express.static(__dirname + "/build"));

app.get('/', (req, res) => {
  res.send('<h1>Hello</h2>');
});

app.listen(80, () => {
  console.log("app start on 80 post");
});
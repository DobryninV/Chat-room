const express = require('express');

const app = express();

const port = process.env.PORT || 80;

app.use(express.static(__dirname + "/build"));

app.get('/', (req, res) => {
  res.send('<h1>Hello</h2>');
});

app.listen(port, () => {
  console.log(`app start on ${port} port`);
});
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


// app.get(path, callback [, callback ...])
// Routes HTTP GET requests to the specified path with the specified callback functions.
app.get("/", (request, response) => { // '/' refers to http://localhost:8080/
  response.send('Hello!');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// development notes
// https://expressjs.com/en/4x/api.html#app.METHOD
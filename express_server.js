const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// tells the Express app to use EJS as its templating engine
app.set("view engine", "ejs"); // set ejs as the view engine

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


// app.get(path, callback [, callback ...])
// Routes HTTP GET requests to the specified path with the specified callback functions.
app.get("/", (request, response) => { // '/' refers to http://localhost:8080/
  response.send('Hello!');
});

app.get("/urls.json", (request, response) => {
  response.json(urlDatabase[shortURL]);
});

// When sending variables to an EJS template, we need to send them inside an object, even if we are only sending one variable. 
// This is so we can use the key of that variable (in the above case the key is urls) to access the data within our template.
app.get("/urls", (request, response) => {
  const templateVars = { urls: urlDatabase };
  response.render("urls_index", templateVars); 
});

app.get("/urls/:shortURL", (request, response) => { // The : in front of shortURL indicates that shortURL is a route parameter
  
  let shortURL = request.params.shortURL // https://docs.microsoft.com/en-us/dotnet/api/system.web.httprequest.params?redirectedfrom=MSDN&view=netframework-4.8#System_Web_HttpRequest_Params
  console.log(urlDatabase[shortURL])

  const templateVars = { 
    shortURL: shortURL, 
    longURL: urlDatabase[shortURL]
  }; // https://expressjs.com/en/guide/routing.html#route-parameters 
  response.render("urls_show", templateVars);
});

// ----------------------------------------------------------------------------------------------------
// example route handlers

app.get("/hello", (request, response) => {
  response.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/helloworld", (request, response) => {
  const templateVars = { greeting: 'Hello World!' };
  response.render("hello_world", templateVars);
});

// the templateVars object above contains the string 'Hello World' under the key greeting. 
// We then pass the templateVars object to the template called hello_world.

// In our hello_world.ejs file, we can display the 'Hello World!' string stored in the templateVars object by calling the key greeting:

// <!-- This would display the string "Hello World!" -->
// <h1><%= greeting %></h1>
// ----------------------------------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// development notes
// https://expressjs.com/en/4x/api.html#app.METHOD

// HTTP Method	/ CRUD Action
// --- GET	/ Read
// --- POST / Create
// --- PUT	/ Update
// --- DELETE / Delete
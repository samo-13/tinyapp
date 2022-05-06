const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// tells the Express app to use EJS as its templating engine
app.set("view engine", "ejs"); // set ejs as the view engine


// When our browser submits a POST request, the data in the request body is sent as a Buffer. While this data type is great for transmitting data, it's not readable for us humans. To make this data readable, we will need to install another piece of middleware, body-parser.
// The body-parser library will convert the request body from a Buffer into string that we can read. 
// It will then add the data to the req(request) object under the key body.
const bodyParser = require("body-parser"); 
app.use(bodyParser.urlencoded({extended: true}));

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

// keep above /urls/:id route definition
app.get("/urls/new", (request, response) => {
  response.render("urls_new");
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

// limitations of HTTP in the browser
// --- To create PUT and DELETE requests we would need to use a workaround known as HTTP Method Override, but for simplicity we will make do with just GET and POST. Instead of PUT and DELETE, we will use POST.

// urls_new
// The form tag has two important attributes: action and method. 
// The action attribute tells the form which URL to submit to while the method attribute tells the form which HTTP method to use when submitting the form.
// The input tag has an important attribute as well: name. 
// This attribute identifies the data we are sending; in this case, it adds the key longURL to the data we'll be sending in the body of our POST request.

// The order of route definitions matters! The GET /urls/new route needs to be defined before the GET /urls/:id route. Routes defined earlier will take precedence, so if we place this route after the /urls/:id definition, any calls to /urls/new will be handled by app.get("/urls/:id", ...) because Express will think that new is a route parameter. A good rule of thumb to follow is that routes should be ordered from most specific to least specific.
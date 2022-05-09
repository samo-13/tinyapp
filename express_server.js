const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require("bcryptjs");

// tells the Express app to use EJS as its templating engine
app.set("view engine", "ejs"); // set ejs as the view engine

// When our browser submits a POST request, the data in the request body is sent as a Buffer. While this data type is great for transmitting data, it"s not readable for us humans. To make this data readable, we will need to install another piece of middleware, body-parser.
// The body-parser library will convert the request body from a Buffer into string that we can read.
// It will then add the data to the req(request) object under the key body.
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// ----------------------------------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// ----------------------------------------------------------------------------------------------------

const cookieSession = require("cookie-session");
app.use(cookieSession({
  name: "user_id",
  keys: ["my", "secret", "keys"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// ----------------------------------------------------------------------------------------------------
// DATA --- keep above functions and routes
// ----------------------------------------------------------------------------------------------------

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "7yyet6"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};

// ----------------------------------------------------------------------------------------------------

const users = { // keep for testing!
  "7yyet6": {
    id: "7yyet6",
    email: "potato@gmail.com",
    hashedPassword: "$2a$10$9IHbBuRy2dWpV6SP3H5fHudhlC.fsWRCefw52FIAO.viemmLIt9UG"
  },
  "i78m8z":{
    id: "i78m8z",
    email: "banana@gmail.com",
    hashedPassword: "$2a$10$yfSIH3bG/yzGIkx66E9u9uEXn/uOPbR1RIxjUZMME8OAUB0gwS4yG"
  }
};

// ----------------------------------------------------------------------------------------------------
// REQUIRE FUNCTION FROM HELPERS.JS 
// ----------------------------------------------------------------------------------------------------

const { getUserByEmail } = require("./helpers");


let generateRandomString = function() { // random string generator
  const stringLength = 6;
  let string = "";

  while (string.length < stringLength) {
    string += Math.random().toString(36).substring(2);
    string = string.substring(0, stringLength);
  }
  console.log(string);
  return string;
};

// ----------------------------------------------------------------------------------------------------
// ADDITIONAL HELPER FUNCTIONS
// ----------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------

let emailLookup = function(email) {
  console.log("emailLookup function");
  for (let user in users) {
    if (users[user].email === email) {
      console.log("true");
      return true;
    }
  }
  console.log("outside false");
  return false;
};

// ----------------------------------------------------------------------------------------------------

let passwordChecker = function(password, email) {
  
  for (let user in users) {
    if ((users[user].email) && (bcrypt.compareSync(password, users[user].hashedPassword))) {
      console.log("true");
      return true;
    }
  }
  console.log("false");
  return false;
};

// ----------------------------------------------------------------------------------------------------

let urlsForUser = function(id) {
  let userUrls = {};

  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      let userUrlObject = urlDatabase[shortURL];
      userUrls[shortURL] = userUrlObject;
    }
  }
  console.log("TEST 2:", userUrls);
  return userUrls;
};

// ----------------------------------------------------------------------------------------------------

let urlChecker = function(shortUrlInput, user) {
  for (let shortURL in urlDatabase) {
    if ((shortURL === shortUrlInput) && (urlDatabase[shortURL].userID === user)) {
      console.log("true");
      return true;
    }
  }
  console.log("false");
  return false;
};

// ----------------------------------------------------------------------------------------------------

let checkShortURL = function(input) {
  let result = '';
  for (let shortURL in urlDatabase) {
    console.log('INPUT:', input);
    console.log('SHORTURL:', shortURL);

    if (shortURL === input) {
      result = 'true';
    } else {
      result = 'false';
    }
  } return result;
};

console.log(checkShortURL('b6UTxQ'));
console.log(checkShortURL('hgjkn'));

let getLongURL = function(input) {
  let longURL = "";
  for (let shortURL in urlDatabase) {
    console.log("getLongURL FUNCTION:");
    if (input === shortURL) {
      longURL = urlDatabase[shortURL].longURL;
      console.log("LONGURL:", longURL);
      return longURL;
    }
  }
};

console.log("****SHOULD BE TSN****");
getLongURL("b6UTxQ");

// ----------------------------------------------------------------------------------------------------
// GET
// ----------------------------------------------------------------------------------------------------

// Routes HTTP GET requests to the specified path with the specified callback functions.
app.get("/", (request, response) => { // "/" refers to http://localhost:8080/
  response.send("Hello!");
});

// ----------------------------------------------------------------------------------------------------

// app.get("/urls.json", (request, response) => {
//   response.json(urlDatabase[shortURL]);
// });

// ----------------------------------------------------------------------------------------------------

// When sending variables to an EJS template, we need to send them inside an object, even if we are only sending one variable.
// This is so we can use the key of that variable (in the above case the key is urls) to access the data within our template.
app.get("/urls", (request, response) => {
  
  let user = request.session["user_id"];
  let urls = urlsForUser(user);
  user = users[user];

  const templateVars = {
    urls,
    user,
  };

  response.render("urls_index", templateVars);
});

// ----------------------------------------------------------------------------------------------------

app.get("/login", (request, response) => {
  const user = request.session.user_id; // gets the cookie value or {} if none https://expressjs.com/en/api.html

  if (user !== undefined) {
    response.redirect("/urls");
    return;
  }

  const templateVars = {
    urls: urlDatabase,
    user,
  };

  response.render("urls_login", templateVars);
});

// ----------------------------------------------------------------------------------------------------

app.get("/register", (request, response) => {
  const user = request.session.user_id; // gets the cookie value or {} if none https://expressjs.com/en/api.html
  console.log(user);

  if (user !== undefined) {
    response.redirect("/urls");
    return;
  }

  const templateVars = {
    urls: urlDatabase,
    user,
  };

  response.render("urls_register", templateVars);
});

// ----------------------------------------------------------------------------------------------------

// keep above /urls/:id route definition
app.get("/urls/new", (request, response) => {
  let userID = request.session["user_id"];
  let user = users[userID];

  if (user === undefined) {
    response.redirect("/login");
  }

  const templateVars = {
    urls: urlDatabase,
    user,
  };

  response.render("urls_new", templateVars);
});

// ----------------------------------------------------------------------------------------------------

app.get("/urls/:shortURL", (request, response) => { // The : in front of shortURL indicates that shortURL is a route parameter
  let shortURL = request.params.shortURL; // https://docs.microsoft.com/en-us/dotnet/api/system.web.httprequest.params?redirectedfrom=MSDN&view=netframework-4.8#System_Web_HttpRequest_Params
  let userID = request.session["user_id"];
  let user = users[userID];

  const templateVars = {
    shortURL: shortURL,
    longURL: urlDatabase[shortURL].longURL,
    user,
  }; // https://expressjs.com/en/guide/routing.html#route-parameters

  response.render("urls_show", templateVars);
  return;
});

// ----------------------------------------------------------------------------------------------------

app.get("/u/:shortURL", (request, response) => {
  let shortURL = request.params.shortURL;

  if (checkShortURL(shortURL)) {
    let longURL = getLongURL(shortURL);
    response.redirect(longURL);
    return;
  }
  
  if (checkShortURL(shortURL) === false) {
    response.status(400);
    response.send(`Oops, no URL matches in our database!`);
    return;
  }

});

// ----------------------------------------------------------------------------------------------------

app.get("/urls/:shortURL/delete", (request, response) => {
  let userID = request.session["user_id"];
  let user = users[userID];
  const shortURL = request.params.shortURL;
  let checkURL = urlChecker(shortURL, userID);

  if (checkURL) {
    response.redirect("/urls");
  }

  response.redirect("/access-denied");
});

  // to test:
  // log in as user@example.com
  // go to --> http://localhost:8080/urls/i3BoG/delete
// ----------------------------------------------------------------------------------------------------

app.get("/urls/:shortURL/edit", (request, response) => {
  let userID = request.session["user_id"];
  let shortURL = request.params.shortURL;
  let checkURL = urlChecker(shortURL, userID);

  if (checkURL) {
    response.redirect("/urls");
  }

  response.redirect("/access-denied");
});

  // to test:
  // log in as user@example.com
  // go to --> http://localhost:8080/urls/i3BoG/edit

// ----------------------------------------------------------------------------------------------------

app.get("/access-denied", (request, response) => {
  let userID = request.session["user_id"];
  let user = users[userID];

  const templateVars = {
    user
  };
  
  response.render("urls_permission", templateVars);
});

// ----------------------------------------------------------------------------------------------------

app.get("/urls/:id", (request, response) => { // is this the same as line 292?
  response.redirect("/urls"); // likely need to adjust
});

// ----------------------------------------------------------------------------------------------------
// POST
// ----------------------------------------------------------------------------------------------------

app.post("/login", (request, response) => {

  let email = request.body.email;
  let password = request.body.password;
  let userID = getUserByEmail(email, users);

  if (email === "" || password === "") { // if email or password field are left empty return an error
    response.status(400);
    response.send(`Oops, form fields can"t be left blank!`);
  }

  if (passwordChecker(password, email)) { // if email exists & password matches
    request.session.user_id = userID;
  } else {
    response.status(403);
    response.send(`Oops, the email or passward was incorrect!`);
    return; // stop the user from being added again
  }
  
  request.session.user_id = userID;
  response.redirect("/urls");
});

// ----------------------------------------------------------------------------------------------------

app.post("/logout", (request, response) => {
  request.session = null; // clear cookie upon logout
  response.redirect("/login");
});

// ----------------------------------------------------------------------------------------------------

app.post("/urls", (request, response) => {
  let user = request.session.user_id;

  if (user === undefined) { // send error and message to non users trying to add a new URL
    response.status(400);
    response.send("Oops, you must be registered and logged in with TinyApp to add and edit urls");
  }

  let shortURL = generateRandomString();
  let longURL = request.body.longURL;

  urlDatabase[shortURL] = { longURL: longURL, userID: user }; // save the shortURL-longURL key-value pair to the urlDatabase when it receives a POST request to /urls
  response.redirect(`/urls/${shortURL}`); // generates a random 6 character string
});

// ----------------------------------------------------------------------------------------------------

app.post("/urls/:shortURL/delete", (request, response) => {

  let user = request.session["user_id"];
  const shortURL = request.params.shortURL;
  
  if (user === undefined) { // send error and message to non users trying to add a new URL
    response.status(400);
    response.send("Oops, you must be registered and logged in with TinyApp to add, edit, and delete urls");
    response.redirect("/urls");
    return;
  }

  delete urlDatabase[shortURL]; // delete the specific url from the urlDatabase object
  response.redirect("/urls"); // once the resource has been deleted, redirect back to /urls
});

// ----------------------------------------------------------------------------------------------------

app.post("/urls/:shortURL/edit", (request, response) => {

  let user = request.session["user_id"];
  const shortURL = request.params.shortURL;
  const editLongURL = request.body.editLongURL;

  if (user === undefined) { // send error and message to non users trying to add a new URL
    response.status(400);
    response.send("Oops, you must be registered and logged in with TinyApp to add and edit urls");
    response.redirect("/login");
  }
  
  response.redirect("/urls"); // once the resource has been edited, redirect back to /urls
  urlDatabase[shortURL] = { longURL: editLongURL, userID: user }; // replace old longURL with the new one submitted
  response.redirect("/urls"); // once the resource has been edited, redirect back to /urls
});

// ----------------------------------------------------------------------------------------------------

app.post("/register", (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  let userID = generateRandomString();

  if (email === "" || password === "") { // if email or password field are left empty return an error
    response.status(400);
    response.send(`Oops, form fields can"t be left blank!`);
  }

  if (emailLookup(email)) { // if email exists
    response.status(403);
    response.send(`Oops, that email already exists!`);
    return; // needed to stop the user from being added again
  }

  users[userID] = {
    id: userID,
    email,
    hashedPassword
  };

  request.session.user_id = userID;
  response.redirect("/urls");
});

// ----------------------------------------------------------------------------------------------------
// DEVELOPMENT NOTES
// ----------------------------------------------------------------------------------------------------

// https://expressjs.com/en/4x/api.html#app.METHOD
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete

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
// This attribute identifies the data we are sending; in this case, it adds the key longURL to the data we"ll be sending in the body of our POST request.
// The order of route definitions matters! The GET /urls/new route needs to be defined before the GET /urls/:id route. Routes defined earlier will take precedence, so if we place this route after the /urls/:id definition, any calls to /urls/new will be handled by app.get("/urls/:id", ...) because Express will think that new is a route parameter. A good rule of thumb to follow is that routes should be ordered from most specific to least specific.
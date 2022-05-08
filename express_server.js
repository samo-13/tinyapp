const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// tells the Express app to use EJS as its templating engine
app.set("view engine", "ejs"); // set ejs as the view engine

// When our browser submits a POST request, the data in the request body is sent as a Buffer. While this data type is great for transmitting data, it"s not readable for us humans. To make this data readable, we will need to install another piece of middleware, body-parser.
// The body-parser library will convert the request body from a Buffer into string that we can read.
// It will then add the data to the req(request) object under the key body.
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require("cookie-parser");
const request = require("request");
app.use(cookieParser());

// ----------------------------------------------------------------------------------------------------
// DATA
// ----------------------------------------------------------------------------------------------------

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

const urlDatabase = {
  b6UTxQ: {
        longURL: "https://www.tsn.ca",
        userID: "aJ48lW"
    },
    i3BoGr: {
        longURL: "https://www.google.ca",
        userID: "aJ48lW"
    },
    i3BoGr: {
      longURL: "https://www.banana.ca",
      userID: "bsghjr" // for testing different user id
  }
};

const users = {
  "bsghjr": {
    id: "bsghjr",
    email: "user@example.com",
    password: "pmd"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "df"
  },
  "aJ48lW": {
    id: "aJ48lW",
    email: "sarah@example.com",
    password: "dog"
  }
};

// ----------------------------------------------------------------------------------------------------
// FUNCTIONS
// ----------------------------------------------------------------------------------------------------

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

// generateRandomString();

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

console.log("user@example.com");
emailLookup("user@example.com");
console.log("user2@example.com");
emailLookup("user2@example.com");
console.log("sarah@example.com");
emailLookup("sarah@example.com");

let passwordChecker = function(password, user) {
  console.log("passwordChecker function");
  for (let user in users) {
    if (users[user].password === password) {
      console.log("true");
      return true;
    }
  }
  console.log("false");
  return false;
};

let passwordCheckerV2 = function(password, email) {
  console.log("passwordCheckerV2 function");
  
  for (let user in users) {
    if ((emailLookup(email)) && (users[user].password === password)) {
      console.log("true");
      return true;
    }
  }
  console.log("false");
  return false;
};

console.log("SHOULD BE TRUE");
passwordChecker("pmd", "userRandomID"); // returns true
console.log("SHOULD BE FALSE");
passwordChecker("pm", "userRandomID"); // returns false
console.log("SHOULD BE TRUE");
passwordCheckerV2("df", "user2@example.com"); // returns true
console.log("SHOULD BE FALSE");
passwordCheckerV2("pm", "userRandomID"); // returns false


let getUserIDFromEmail = function(email) {
  console.log("getUserIDFromEmail");

  for (let user in users) {
    if (email === users[user].email) { // was unable to get emailChecker function to work here
      console.log(users[user].id);
      return users[user].id;
    }
  } return false
};

console.log("SHOULD BE userRandomID");
getUserIDFromEmail("user@example.com"); // should return userRandomID
console.log("SHOULD BE user2RandomID");
getUserIDFromEmail("user2@example.com"); // should return user2RandomID
console.log("SHOULD BE user3RandomID");
getUserIDFromEmail("sarah@example.com"); // should return user3RandomID

// let getUserIDFromCookie = function() {
//
// };

// let getEmailFromUserID = function(user) {
// 
// };

let getShortURLS = function() {
  for (let shortURL in urlDatabase) {
    console.log(shortURL);
  }
};

let urlsForUser = function(id) {
  let userUrls = {};

  for (let shortURL in urlDatabase) {

    if (urlDatabase[shortURL].userID === id) {

      // console.log('TEST 1:', urlDatabase[shortURL])
      let userUrlObject = urlDatabase[shortURL]
      userUrls[shortURL] = userUrlObject
    }
  }
  console.log('TEST 2:', userUrls)
  return userUrls
};

urlsForUser('aJ48lW');

// ----------------------------------------------------------------------------------------------------
// GET
// ----------------------------------------------------------------------------------------------------

// app.get(path, callback [, callback ...])
// Routes HTTP GET requests to the specified path with the specified callback functions.
app.get("/", (request, response) => { // "/" refers to http://localhost:8080/
  response.send("Hello!");
});

app.get("/urls.json", (request, response) => {
  response.json(urlDatabase[shortURL]);
});

// When sending variables to an EJS template, we need to send them inside an object, even if we are only sending one variable.
// This is so we can use the key of that variable (in the above case the key is urls) to access the data within our template.
app.get("/urls", (request, response) => {
  
  let user = request.cookies["user_id"];
  let urls = urlsForUser(user)
  console.log('TESTING USER:', user);
  user = users[user];
  console.log('TESTING USER:', user);
  // let user = users[userID];
  console.log(user);
  // console.log(id);
  // getShortURLS()

  const templateVars = {
    urls,
    user,
    // id
    // user: getUserIDFromCookie(),
    // email: getEmailFromUserID(user)
  };

  response.render("urls_index", templateVars);
});

app.get("/login", (request, response) => {
  // let userID = request.cookies["user_id"]
  // let user = users[userID]
  // let email = users[userID].email
  // console.log("USER:", user);
  // // console.log("EMAIL:", email)

  const user = request.cookies.user_id // gets the cookie value or {} if none https://expressjs.com/en/api.html
  console.log(user)

  if (user !== undefined) {
    response.redirect("/urls")
    return
  }

  const templateVars = {
    urls: urlDatabase,
    user,
  };

  response.render("urls_login", templateVars);
});

app.get("/register", (request, response) => {
  // let userID = request.cookies["user_id"];
  // let user = users[userID];
  // // let email = users[userID].email
  // console.log("USER:", user);
  // // console.log("EMAIL:", email)
  const user = request.cookies.user_id // gets the cookie value or {} if none https://expressjs.com/en/api.html
  console.log(user)

  if (user !== undefined) {
    response.redirect("/urls")
    return
  }

  const templateVars = {
    urls: urlDatabase,
    user,
  };

  response.render("urls_register", templateVars);
});

// keep above /urls/:id route definition
app.get("/urls/new", (request, response) => {

  let userID = request.cookies["user_id"];
  let user = users[userID];

  if (user === undefined) {
    response.redirect("/login")
  }

  const templateVars = {
    urls: urlDatabase,
    user,
  };

  response.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (request, response) => { // The : in front of shortURL indicates that shortURL is a route parameter
  
  let shortURL = request.params.shortURL; // https://docs.microsoft.com/en-us/dotnet/api/system.web.httprequest.params?redirectedfrom=MSDN&view=netframework-4.8#System_Web_HttpRequest_Params
  console.log(urlDatabase[shortURL]);

  let userID = request.cookies["user_id"];
  let user = users[userID];
  console.log("USER:", user);

  const templateVars = {
    shortURL: shortURL,
    longURL: urlDatabase[shortURL].longURL,
    user,
  }; // https://expressjs.com/en/guide/routing.html#route-parameters

  response.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (request, response) => {
  const shortURL = request.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;

  console.log("longURL:", longURL);
  response.redirect(longURL);
});


app.get("/urls/:shortURL/delete", (request, response) => {
  response.redirect("/urls")
});

app.get("/urls/:id", (request, response) => {
  response.redirect("/urls") // likely need to adjust
});

// ----------------------------------------------------------------------------------------------------
// example route handlers

// app.get("/hello", (request, response) => {
//   response.send("<html><body>Hello <b>World</b></body></html>\n");
// });

app.get("/helloworld", (request, response) => {
  const templateVars = { greeting: "Hello World!" };
  response.render("hello_world", templateVars);
});

// the templateVars object above contains the string "Hello World" under the key greeting.
// We then pass the templateVars object to the template called hello_world.

// In our hello_world.ejs file, we can display the "Hello World!" string stored in the templateVars object by calling the key greeting:

// <!-- This would display the string "Hello World!" -->
// <h1><%= greeting %></h1>
// ----------------------------------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// ----------------------------------------------------------------------------------------------------
// POST
// ----------------------------------------------------------------------------------------------------

app.post("/login", (request, response) => {

  let email = request.body.email;
  console.log(email);
  let password = request.body.password;
  console.log(password);
  let userID = getUserIDFromEmail(email);
  console.log(userID);

  if (email === "" || password === "") { // if email or password field are left empty return an error
    response.status(400);
    response.send(`Oops, form fields can"t be left blank!`);
  }

  if (passwordCheckerV2(password, email)) { // if email exists & password matches
    response.cookie("user_id", userID); // http://expressjs.com/en/api.html#res.cookie
    cookieParser.JSONCookie(userID);
  } else {
    response.status(403);
    response.send(`Oops, the email or passward was incorrect!`);
    return; // stop the user from being added again
  }

  response.cookie("user_id", userID); // http://expressjs.com/en/api.html#res.cookie
  cookieParser.JSONCookie(userID);
  response.redirect("/urls");
});

app.post("/logout", (request, response) => {
  console.log(request.cookies["user_id"]);
  response.clearCookie("user_id", {domain: "localhost", path:"/"});  // https://expressjs.com/en/api.html res.clearCookie

  response.redirect("/login");
});

app.post("/urls", (request, response) => {
  let user = request.cookies.user_id

  if (user === undefined) { // send error and message to non users trying to add a new URL
    response.status(400);
    response.send('Oops, you must be registered and logged in with TinyApp to add and edit urls')
    return;
  }

  let shortURL = generateRandomString();
  let longURL = request.body.longURL;

  console.log(request.body.longURL); // log the POST request body to the console

urlDatabase[shortURL] = { longURL: longURL, userID: user }; // save the shortURL-longURL key-value pair to the urlDatabase when it receives a POST request to /urls
  console.log(urlDatabase);
  response.redirect(`/urls/${shortURL}`); // generates a random 6 character string
  return;
});

app.post("/urls/:shortURL/delete", (request, response) => {

  const user = request.cookies.user_id;
  
  if (user === undefined) { // send error and message to non users trying to add a new URL
    response.status(400);
    response.send('Oops, you must be registered and logged in with TinyApp to add, edit, and delete urls')
    response.redirect("/urls"); 
    return;
  }

  const shortURL = request.params.shortURL;
  delete urlDatabase[shortURL]; // delete the specific url from the urlDatabase object
  response.redirect("/urls"); // once the resource has been deleted, redirect back to /urls
  return;
});

app.post("/urls/:shortURL/edit", (request, response) => {

  const user = request.cookies.user_id;

  if (user === undefined) { // send error and message to non users trying to add a new URL
    response.status(400);
    response.send('Oops, you must be registered and logged in with TinyApp to add and edit urls')
    response.redirect("/urls"); 

  }

  const shortURL = request.params.shortURL;
  const editLongURL = request.body.editLongURL;
  
  // console.log(editLongURL)
  // console.log("urlDatabase[shortURL]", urlDatabase[shortURL])
  urlDatabase[shortURL] = { longURL: editLongURL, userID: user }; // replace old longURL with the new one submitted
  // console.log(urlDatabase)
  response.redirect("/urls"); // once the resource has been edited, redirect back to /urls
});


app.post("/register", (request, response) => {
  console.log(users);
  let email = request.body.email;
  console.log(email);
  let password = request.body.password;
  console.log(password);
  let userID = generateRandomString();
  console.log(userID);

  if (email === "" || password === "") { // if email or password field are left empty return an error
    response.status(400);
    response.send(`Oops, form fields can"t be left blank!`);
  }

  if (emailLookup(email)) { // if email exists
    response.status(403);
    response.send(`Oops, that email does not exist!`);
    return; // needed to stop the user from being added again
  }

  users[userID] = {
    id: userID,
    email,
    password
  };

  response.cookie("user_id", userID); // http://expressjs.com/en/api.html#res.cookie
  cookieParser.JSONCookie(userID);

  console.log(users);
  response.redirect("/urls");
});
// test using curl -X POST "http://localhost:8080/urls/9sm5xK/delete"

// development notes
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
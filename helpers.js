// ----------------------------------------------------------------------------------------------------
// require users and urlDatabase objects from express_server
// ----------------------------------------------------------------------------------------------------

// let { users } = require("./express_server")
// let { urlDatabase } = require("./express_server")

// ----------------------------------------------------------------------------------------------------
// helper functions for TinyApp
// ----------------------------------------------------------------------------------------------------

let getUserByEmail = function(email, users) {
  // console.log("getUserByEmail");

  for (let user in users) {
    if (email === users[user].email) { // was unable to get emailChecker function to work here
      console.log(users[user].id);
      user = users[user].id
      return user
    }
  } return false
};

// ----------------------------------------------------------------------------------------------------


// ----------------------------------------------------------------------------------------------------
// exports helper functions for express_server.js to require

module.exports = { // do not remove or alter
  getUserByEmail
} 

// ----------------------------------------------------------------------------------------------------

// helper functions for TinyApp

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

module.exports = {
  getUserByEmail
}
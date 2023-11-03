const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
const userWithSameName = users.filter(user => user.username === username)
  if(userWithSameName.length > 0) {
    return true
  } else {
    return false
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const validUsers = users.filter(user => user.username === username && user.password === password)
  if(validUsers.length > 0) {
    return true
  } else {
    return false
  }
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body
  if(!username || !password) {
    return res.status(404).send("Error Logging in")
  }
  if(authenticatedUser(username, password)) {
    const accessToken = jwt.sign({data: password}, "access", {expiresIn: 60*60})
    req.session.authorization = {accessToken, username}
    return res.status(200).send("User logged in successfully")
  } else {
    return res.status(403).send("User is not authenticated")
  }
  
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const {isbn} = req.params
  const {review, username} = req.body
  const isbnReviewList = books[isbn]?.reviews
  const checkUserIndex = Object.keys(isbnReviewList).findIndex(name => name === username)
  if(checkUserIndex >= 0) {
    //user already exists
    isbnReviewList[username] = review
    return res.status(201).send({message: "Review modified successfully"})
  } else {
    //add the review under username
    isbnReviewList[username] = review
    return res.status(201).send({message: "Review added successfully"})
  }
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const {isbn} = req.params
  const {username} = req.body
  const isbnReviewList = books[isbn]?.reviews
  delete isbnReviewList[username]
  return res.send({message: "User Reviews deleted successfully"})
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

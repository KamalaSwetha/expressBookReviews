const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const filterBooks = (bookKey, bookValue) => {
  const filteredBooks = Object.values(books).filter((book) => book[bookKey] === bookValue)
  return filteredBooks
}

public_users.post("/register", (req,res) => {
  const {username, password} = req.body
  if(!username || !password) {
    return res.status(404).send({message: "Unable to register user"})
  } else {
    if (!isValid(username)) {
      users.push({"username": username, "password": password})
      return res.status(200).send({message: "User registered sucessfully"})
    } else {
      return res.status(404).send({message: "User already exists"})
    }
  }
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   return res.send(JSON.stringify(books,null,4))
// });

// Get Req with Async
public_users.get("/", async (req, res) => {
  try {
    return res.send(JSON.stringify(books,null,4))
  }
  catch (error) {
    console.error(error)
    return res.send('error')
  }
});


// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   const {isbn} = req.params
//   if(isbn) {
//     return res.send(JSON.stringify(books[isbn], null, 4))
//   }
//  });

public_users.get('/isbn/:isbn', async (req, res) => {
  const {isbn} = req.params
  try {
    if(isbn) {
      return res.send(JSON.stringify(books[isbn], null, 4))
    }
  }
  catch (error) {
    console.error(error)
    return res.send('error')
  }
 });
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   const {author} = req.params
//   if(author) {
//     const filterAuthBooks = filterBooks("author", author)
//     if(filterAuthBooks.length > 0) {
//       return res.send(JSON.stringify(filterAuthBooks, null, 4))
//     } else {
//       return res.send({message: `Books are not available under author ${author}`})
//     }
//   }
// });

public_users.get('/author/:author',async (req, res) => {
  const {author} = req.params
  try {
    if(author) {
      const filterAuthBooks = filterBooks("author", author)
      if(filterAuthBooks.length > 0) {
        return res.send(JSON.stringify(filterAuthBooks, null, 4))
      } else {
        return res.send({message: `Books are not available under author ${author}`})
      }
    }
  }
  catch (error) {
    console.error(error)
    return res.send('error')
  }
});

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   const {title} = req.params
//   if(title) {
//     const filterTitleBooks = filterBooks("title", title)
//     if(filterTitleBooks.length > 0) {
//       return res.send(JSON.stringify(filterTitleBooks, null, 4))
//     } else {
//       return res.send({message: `Books are not available under title ${title}`})
//     }
//   }
// });

public_users.get('/title/:title',async (req, res) => {
  const {title} = req.params
  try {
    if(title) {
      const filterTitleBooks = filterBooks("title", title)
      if(filterTitleBooks.length > 0) {
        return res.send(JSON.stringify(filterTitleBooks, null, 4))
      } else {
        return res.send({message: `Books are not available under title ${title}`})
      }
    }
  }
  catch (error) {
    console.error(error)
    return res.send('error')
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const {isbn} = req.params
  if(isbn) {
    res.send(JSON.stringify(books[isbn]?.reviews), null,4)
  }
});

module.exports.general = public_users;

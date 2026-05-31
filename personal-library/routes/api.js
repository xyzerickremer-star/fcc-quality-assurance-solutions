'use strict';

const crypto = require('crypto');

const books = [];

function makeId() {
  return crypto.randomBytes(12).toString('hex');
}

function hasValue(value) {
  return value !== undefined && value !== null && value !== '';
}

function findBook(id) {
  return books.find(book => book._id === id);
}

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      res.json(books.map(book => ({
        _id: book._id,
        title: book.title,
        commentcount: book.comments.length
      })));
    })
    
    .post(function (req, res){
      const title = req.body.title;

      if (!hasValue(title)) {
        return res.send('missing required field title');
      }

      const book = {
        _id: makeId(),
        title,
        comments: []
      };
      books.push(book);

      res.json({ _id: book._id, title: book.title });
    })
    
    .delete(function(req, res){
      books.splice(0, books.length);
      res.send('complete delete successful');
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      const book = findBook(req.params.id);

      if (!book) {
        return res.send('no book exists');
      }

      res.json(book);
    })
    
    .post(function(req, res){
      const book = findBook(req.params.id);
      const comment = req.body.comment;

      if (!book) {
        return res.send('no book exists');
      }

      if (!hasValue(comment)) {
        return res.send('missing required field comment');
      }

      book.comments.push(comment);
      res.json(book);
    })
    
    .delete(function(req, res){
      const index = books.findIndex(book => book._id === req.params.id);

      if (index === -1) {
        return res.send('no book exists');
      }

      books.splice(index, 1);
      res.send('delete successful');
    });
  
};

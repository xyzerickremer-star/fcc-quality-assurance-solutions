const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let bookId;
  let deleteBookId;

  suiteSetup(function(done) {
    chai.request(server)
      .delete('/api/books')
      .end(function() {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Existing test book' })
          .end(function(err, res) {
            bookId = res.body._id;
            chai.request(server)
              .post('/api/books')
              .send({ title: 'Book to delete' })
              .end(function(err2, res2) {
                deleteBookId = res2.body._id;
                done();
              });
          });
      });
  });

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Created from test' })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id');
            assert.equal(res.body.title, 'Created from test');
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });
    });

    suite('GET /api/books => array of books', function(){
      test('Test GET /api/books', function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.isAtLeast(res.body.length, 1);
            assert.property(res.body[0], '_id');
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], 'commentcount');
            done();
          });
      });
    });

    suite('GET /api/books/[id] => book object with [id]', function(){
      test('Test GET /api/books/[id] with id not in db', function(done){
        chai.request(server)
          .get('/api/books/not-a-real-id')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .get(`/api/books/${bookId}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, bookId);
            assert.equal(res.body.title, 'Existing test book');
            assert.isArray(res.body.comments);
            done();
          });
      });
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post(`/api/books/${bookId}`)
          .send({ comment: 'A useful comment' })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, bookId);
            assert.include(res.body.comments, 'A useful comment');
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post(`/api/books/${bookId}`)
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field comment');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .post('/api/books/not-a-real-id')
          .send({ comment: 'No book' })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {
      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .delete(`/api/books/${deleteBookId}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with id not in db', function(done){
        chai.request(server)
          .delete('/api/books/not-a-real-id')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
    });

    suite('DELETE /api/books => delete all books', function() {
      test('Test DELETE /api/books', function(done) {
        chai.request(server)
          .delete('/api/books')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'complete delete successful');
            done();
          });
      });
    });
  });
});

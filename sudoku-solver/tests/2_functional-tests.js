const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

suite('Functional Tests', () => {
  test('Solve a puzzle with valid puzzle string', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle })
      .end((err, res) => {
        assert.deepEqual(res.body, { solution });
        done();
      });
  });

  test('Solve a puzzle with missing puzzle field', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Required field(s) missing' });
        done();
      });
  });

  test('Solve a puzzle with invalid characters', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: `${puzzle.substring(0, 80)}x` })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
        done();
      });
  });

  test('Solve a puzzle with incorrect length', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: puzzle.substring(0, 80) })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
        done();
      });
  });

  test('Solve a puzzle that cannot be solved', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: `11${puzzle.substring(2)}` })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
        done();
      });
  });

  test('Check a puzzle placement with all fields', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle, coordinate: 'A2', value: '3' })
      .end((err, res) => {
        assert.deepEqual(res.body, { valid: true });
        done();
      });
  });

  test('Check a puzzle placement with single conflict', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle, coordinate: 'A2', value: '4' })
      .end((err, res) => {
        assert.deepEqual(res.body, { valid: false, conflict: ['row'] });
        done();
      });
  });

  test('Check a puzzle placement with multiple conflicts', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle, coordinate: 'A2', value: '5' })
      .end((err, res) => {
        assert.deepEqual(res.body, { valid: false, conflict: ['row', 'region'] });
        done();
      });
  });

  test('Check a puzzle placement with all conflicts', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: solution, coordinate: 'A2', value: '1' })
      .end((err, res) => {
        assert.deepEqual(res.body, { valid: false, conflict: ['row', 'column', 'region'] });
        done();
      });
  });

  test('Check a puzzle placement with missing required field', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle, coordinate: 'A2' })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Required field(s) missing' });
        done();
      });
  });

  test('Check a puzzle placement with invalid characters', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: `${puzzle.substring(0, 80)}x`, coordinate: 'A2', value: '3' })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
        done();
      });
  });

  test('Check a puzzle placement with incorrect length', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: puzzle.substring(0, 80), coordinate: 'A2', value: '3' })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
        done();
      });
  });

  test('Check a puzzle placement with invalid coordinate', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle, coordinate: 'J2', value: '3' })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Invalid coordinate' });
        done();
      });
  });

  test('Check a puzzle placement with invalid value', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle, coordinate: 'A2', value: '10' })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Invalid value' });
        done();
      });
  });
});

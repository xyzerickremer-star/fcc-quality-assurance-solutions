const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver;

const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

suite('Unit Tests', () => {
  setup(() => {
    solver = new Solver();
  });

  test('Logic handles a valid puzzle string of 81 characters', () => {
    assert.deepEqual(solver.validate(puzzle), { valid: true });
  });

  test('Logic handles a puzzle string with invalid characters', () => {
    assert.deepEqual(solver.validate(`${puzzle.substring(0, 80)}x`), { valid: false, error: 'Invalid characters in puzzle' });
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    assert.deepEqual(solver.validate(puzzle.substring(0, 80)), { valid: false, error: 'Expected puzzle to be 81 characters long' });
  });

  test('Logic handles a valid row placement', () => {
    assert.isTrue(solver.checkRowPlacement(puzzle, 'A', '2', '3'));
  });

  test('Logic handles an invalid row placement', () => {
    assert.isFalse(solver.checkRowPlacement(puzzle, 'A', '2', '1'));
  });

  test('Logic handles a valid column placement', () => {
    assert.isTrue(solver.checkColPlacement(puzzle, 'A', '2', '3'));
  });

  test('Logic handles an invalid column placement', () => {
    assert.isFalse(solver.checkColPlacement(puzzle, 'A', '2', '6'));
  });

  test('Logic handles a valid region placement', () => {
    assert.isTrue(solver.checkRegionPlacement(puzzle, 'A', '2', '7'));
  });

  test('Logic handles an invalid region placement', () => {
    assert.isFalse(solver.checkRegionPlacement(puzzle, 'A', '2', '5'));
  });

  test('Valid puzzle strings pass the solver', () => {
    assert.strictEqual(solver.solve(puzzle), solution);
  });

  test('Invalid puzzle strings fail the solver', () => {
    assert.isFalse(solver.solve(`11${puzzle.substring(2)}`));
  });

  test('Solver returns the same string for an already-solved puzzle', () => {
    assert.strictEqual(solver.solve(solution), solution);
  });
});

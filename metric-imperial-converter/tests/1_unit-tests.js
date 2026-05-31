const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
  test('Whole number input', function() {
    assert.strictEqual(convertHandler.getNum('32L'), 32);
  });

  test('Decimal input', function() {
    assert.strictEqual(convertHandler.getNum('3.5mi'), 3.5);
  });

  test('Fractional input', function() {
    assert.strictEqual(convertHandler.getNum('3/4kg'), 0.75);
  });

  test('Fractional input with decimal', function() {
    assert.strictEqual(convertHandler.getNum('3.5/2lbs'), 1.75);
  });

  test('Invalid double-fraction input', function() {
    assert.isNull(convertHandler.getNum('3/2/3kg'));
  });

  test('No numerical input defaults to 1', function() {
    assert.strictEqual(convertHandler.getNum('kg'), 1);
  });

  test('Valid input unit', function() {
    assert.strictEqual(convertHandler.getUnit('10gal'), 'gal');
    assert.strictEqual(convertHandler.getUnit('10L'), 'L');
  });

  test('Invalid input unit', function() {
    assert.isNull(convertHandler.getUnit('10min'));
  });

  test('Return unit for each valid input unit', function() {
    assert.strictEqual(convertHandler.getReturnUnit('gal'), 'L');
    assert.strictEqual(convertHandler.getReturnUnit('L'), 'gal');
    assert.strictEqual(convertHandler.getReturnUnit('lbs'), 'kg');
    assert.strictEqual(convertHandler.getReturnUnit('kg'), 'lbs');
    assert.strictEqual(convertHandler.getReturnUnit('mi'), 'km');
    assert.strictEqual(convertHandler.getReturnUnit('km'), 'mi');
  });

  test('Spell out each valid input unit', function() {
    assert.strictEqual(convertHandler.spellOutUnit('gal'), 'gallons');
    assert.strictEqual(convertHandler.spellOutUnit('L'), 'liters');
    assert.strictEqual(convertHandler.spellOutUnit('lbs'), 'pounds');
    assert.strictEqual(convertHandler.spellOutUnit('kg'), 'kilograms');
    assert.strictEqual(convertHandler.spellOutUnit('mi'), 'miles');
    assert.strictEqual(convertHandler.spellOutUnit('km'), 'kilometers');
  });

  test('Convert gal to L', function() {
    assert.strictEqual(convertHandler.convert(1, 'gal'), 3.78541);
  });

  test('Convert L to gal', function() {
    assert.strictEqual(convertHandler.convert(1, 'L'), 0.26417);
  });

  test('Convert lbs to kg', function() {
    assert.strictEqual(convertHandler.convert(1, 'lbs'), 0.45359);
  });

  test('Convert kg to lbs', function() {
    assert.strictEqual(convertHandler.convert(1, 'kg'), 2.20462);
  });

  test('Convert mi to km', function() {
    assert.strictEqual(convertHandler.convert(1, 'mi'), 1.60934);
  });

  test('Convert km to mi', function() {
    assert.strictEqual(convertHandler.convert(1, 'km'), 0.62137);
  });
});
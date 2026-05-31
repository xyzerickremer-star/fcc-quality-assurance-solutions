'use strict';

const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  const convertHandler = new ConvertHandler();

  app.route('/api/convert')
    .get((req, res) => {
      const input = req.query.input || '';
      const initNum = convertHandler.getNum(input);
      const initUnit = convertHandler.getUnit(input);

      if (initNum === null && initUnit === null) {
        return res.json('invalid number and unit');
      }
      if (initNum === null) {
        return res.json('invalid number');
      }
      if (initUnit === null) {
        return res.json('invalid unit');
      }

      const returnUnit = convertHandler.getReturnUnit(initUnit);
      const returnNum = convertHandler.convert(initNum, initUnit);

      return res.json({
        initNum,
        initUnit,
        returnNum,
        returnUnit,
        string: convertHandler.getString(initNum, initUnit, returnNum, returnUnit)
      });
    });
};

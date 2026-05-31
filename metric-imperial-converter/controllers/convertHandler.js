function ConvertHandler() {
  const units = ['gal', 'lbs', 'mi', 'l', 'kg', 'km'];
  const unitDisplay = {
    gal: 'gal',
    lbs: 'lbs',
    mi: 'mi',
    l: 'L',
    kg: 'kg',
    km: 'km'
  };
  const returnUnits = {
    gal: 'L',
    l: 'gal',
    lbs: 'kg',
    kg: 'lbs',
    mi: 'km',
    km: 'mi'
  };
  const unitNames = {
    gal: 'gallons',
    l: 'liters',
    lbs: 'pounds',
    kg: 'kilograms',
    mi: 'miles',
    km: 'kilometers'
  };

  function parseNumber(numString) {
    if (numString === '') return 1;
    if ((numString.match(/\//g) || []).length > 1) return null;

    if (numString.includes('/')) {
      const parts = numString.split('/');
      if (parts.length !== 2 || parts[0] === '' || parts[1] === '') return null;
      const numerator = Number(parts[0]);
      const denominator = Number(parts[1]);
      if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) return null;
      return numerator / denominator;
    }

    const num = Number(numString);
    return Number.isFinite(num) ? num : null;
  }

  this.getNum = function(input) {
    const match = String(input).trim().match(/^([\d.\/]+)?/);
    const numberPart = match && match[1] ? match[1] : '';
    return parseNumber(numberPart);
  };
  
  this.getUnit = function(input) {
    const match = String(input).trim().match(/[a-zA-Z]+$/);
    if (!match) return null;

    const normalized = match[0].toLowerCase();
    if (!units.includes(normalized)) return null;
    return unitDisplay[normalized];
  };
  
  this.getReturnUnit = function(initUnit) {
    return returnUnits[String(initUnit).toLowerCase()] || null;
  };

  this.spellOutUnit = function(unit) {
    return unitNames[String(unit).toLowerCase()] || null;
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;
    const unit = String(initUnit).toLowerCase();

    switch (unit) {
      case 'gal': result = initNum * galToL; break;
      case 'l': result = initNum / galToL; break;
      case 'lbs': result = initNum * lbsToKg; break;
      case 'kg': result = initNum / lbsToKg; break;
      case 'mi': result = initNum * miToKm; break;
      case 'km': result = initNum / miToKm; break;
      default: return null;
    }

    return Number(result.toFixed(5));
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
  };
  
}

module.exports = ConvertHandler;

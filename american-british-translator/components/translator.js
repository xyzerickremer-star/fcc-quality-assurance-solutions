const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require('./american-to-british-titles.js');
const britishOnly = require('./british-only.js');

class Translator {
  constructor() {
    this.americanToBritish = {
      ...americanOnly,
      ...americanToBritishSpelling,
      ...americanToBritishTitles
    };

    this.britishToAmerican = {
      ...britishOnly,
      ...this.reverseDictionary(americanToBritishSpelling),
      ...this.reverseDictionary(americanToBritishTitles)
    };
  }

  reverseDictionary(dictionary) {
    return Object.keys(dictionary).reduce((reversed, key) => {
      reversed[dictionary[key].toLowerCase()] = key;
      return reversed;
    }, {});
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  shouldCapitalize(original) {
    return original.length > 0 && original[0] === original[0].toUpperCase() && /[A-Za-z]/.test(original[0]);
  }

  matchCase(original, replacement) {
    if (this.shouldCapitalize(original)) {
      return replacement.charAt(0).toUpperCase() + replacement.slice(1);
    }
    return replacement;
  }

  highlight(value) {
    return `<span class="highlight">${value}</span>`;
  }

  translate(text, locale, shouldHighlight = true) {
    if (locale === 'american-to-british') {
      return this.translateAmericanToBritish(text, shouldHighlight);
    }

    if (locale === 'british-to-american') {
      return this.translateBritishToAmerican(text, shouldHighlight);
    }

    return text;
  }

  translateAmericanToBritish(text, shouldHighlight = true) {
    let translated = this.translateTerms(text, this.americanToBritish, shouldHighlight);

    translated = translated.replace(/\b([0-9]{1,2}):([0-9]{2})\b/g, (match, hour, minute) => {
      const replacement = `${hour}.${minute}`;
      return shouldHighlight ? this.highlight(replacement) : replacement;
    });

    return translated;
  }

  translateBritishToAmerican(text, shouldHighlight = true) {
    let translated = this.translateTerms(text, this.britishToAmerican, shouldHighlight);

    translated = translated.replace(/\b([0-9]{1,2})\.([0-9]{2})\b/g, (match, hour, minute) => {
      const replacement = `${hour}:${minute}`;
      return shouldHighlight ? this.highlight(replacement) : replacement;
    });

    return translated;
  }

  translateTerms(text, dictionary, shouldHighlight = true) {
    const terms = Object.keys(dictionary).sort((a, b) => b.length - a.length);
    let translated = text;

    terms.forEach(term => {
      const replacement = dictionary[term];
      const escapedTerm = this.escapeRegExp(term);
      const regex = new RegExp(`(^|[^A-Za-z0-9_])(${escapedTerm})(?=$|[^A-Za-z0-9_])`, 'gi');

      translated = translated.replace(regex, (match, prefix, found) => {
        const casedReplacement = this.matchCase(found, replacement);
        return prefix + (shouldHighlight ? this.highlight(casedReplacement) : casedReplacement);
      });
    });

    return translated;
  }
}

module.exports = Translator;

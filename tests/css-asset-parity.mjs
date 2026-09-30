// Run in a browser so its CSS parser canonicalizes declarations. Keep rule order:
// minification may combine adjacent selectors but must not change the cascade.
export function canonicalCSS(source) {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(source);
  const normalize = text => text.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[^"']+/g, token => {
    if (token.startsWith('"') || token.startsWith("'")) {
      // Shopify also changes quotes inside custom properties; preserve string values.
      const value = token.slice(1, -1).replace(/\\(?:\r\n|[\n\r\f])|\\([0-9a-fA-F]{1,6})[ \t\r\n\f]?|\\([\s\S])/g, (_, hex, char) => {
        if (!hex) return char || '';
        const point = parseInt(hex, 16);
        return String.fromCodePoint(point === 0 || point > 0x10ffff || (point >= 0xd800 && point <= 0xdfff) ? 0xfffd : point);
      });
      return JSON.stringify(value);
    }
    return token.replace(/(-?\d*\.?\d+)ms\b/g, (_, n) => String(Number(n) / 1000) + 's')
      .replace(/(?<![\w\d])0?\.(\d+)/g, '0.$1').replace(/,\s*/g, ',');
  });
  const selectors = text => {
    const result = []; let start = 0, depth = 0, quote = '', escaped = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (escaped) { escaped = false; continue; }
      if (char === '\\') { escaped = true; continue; }
      if (quote) { if (char === quote) quote = ''; continue; }
      if (char === '"' || char === "'") quote = char;
      else if (char === '(' || char === '[') depth++;
      else if (char === ')' || char === ']') depth--;
      else if (char === ',' && depth === 0) { result.push(text.slice(start, i).trim()); start = i + 1; }
    }
    result.push(text.slice(start).trim()); return result;
  };
  const rules = list => [...list].flatMap(rule => {
    if (rule.type === 1) return selectors(rule.selectorText).map(selector => [normalize(selector), normalize(rule.style.cssText)]);
    if (rule.cssRules) return [[normalize(rule.cssText.slice(0, rule.cssText.indexOf('{')).trim()), rules(rule.cssRules)]];
    return [[normalize(rule.cssText)]];
  });
  return JSON.stringify(rules(sheet.cssRules));
}

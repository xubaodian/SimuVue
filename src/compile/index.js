export function replaceValue(str, cb) {
  if (str) {
    let regx = /\{\{(\w+)\}\}/g;
    return str.replace(regx, function(match1, match2) {
      let value = match1;
      if (cb) {
        value = cb(match2) || '';
      }
      return value;
    });
  }
}
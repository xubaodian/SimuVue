export function findKeys(str) {
  let regx = /\{\{([\w_\d]+)\}\}/;
  let arr = str.match(regx);
  return arr;
}
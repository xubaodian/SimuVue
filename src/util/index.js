//代理类
export function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

//空函数，占位用
export function noop () {}

//获取obj属性值，path可为name或info.name形式
export function getValue(obj, path) {
  const segments = path.split('.');
  for (let i = 0; i < segments.length; i++) {
    if (!obj) return;
    obj = obj[segments[i]];
  }
  return obj;
}

export function setValue(obj, path, value) {
  let tmp = obj;
  let segments = path.split('.');
  for (let i = 0; i < segments.length - 1; i++) {
    if (!tmp) return;
    tmp = obj[segments[i]];
  }
  tmp[segments[segments.length - 1]] = value;
}
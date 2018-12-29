import { noop, proxy } from '../util/index';

export function initMethods (vm, methods) {
  for (const key in methods) {
    vm[key] = typeof methods[key] !== 'function' ? noop : methods[key].bind(vm);
  }
}


export function mapKeys(vm) {
  let data = vm._data;
  if (null !== data && typeof data === 'object') {
    const keys = Object.keys(data);
    let i = keys.length;
    while (i-- >= 0) {
      proxy(vm, `_data`, keys[i]);
    }
  }
}
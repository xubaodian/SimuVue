import {Watcher} from './observe/watcher';
import {observe} from './observe/index';
import {proxy, } from './util/index';
import {mapKeys, initMethods} from './init/index';

class Vue {
  constructor(options) {
    this.$options = options || {};
    this._data = options.data;
    this._init();
  }

  _init() {
    //映射key
    mapKeys(this);
    initMethods(this, this.$options.methods)
  }
}


export { Vue }
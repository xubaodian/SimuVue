import {Watcher, getValue} from './observe/watcher';
import {observe} from './observe/index';
import {mapKeys, initMethods} from './init/index';
import { renderMixin } from './compile/update';
import { initDataMixin } from './init/init';
import { initModelMixin } from './event/event';

class Vue {
  constructor(options) {
    this.$options = options || {};
    this._data = options.data;
    this._init();
  }

  _init() {
    //映射key
    mapKeys(this);
    initMethods(this, this.$options.methods);
    observe(this._data);
    this._render();
    this._initModel();
    this._watchData();
  }
}

renderMixin(Vue);
initDataMixin(Vue);
initModelMixin(Vue);

export { Vue }
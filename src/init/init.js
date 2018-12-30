import { Watcher } from '../observe/watcher';

export function initDataMixin(Vue) {
    Vue.prototype._watchData = function () {
        let data = this._data;
        let keys = Object.keys(data);
        let i = keys.length - 1;
        while(i >= 0) {
            new Watcher(this, keys[i], () => {
                this._render();
            });
            i--;
        }
    } 
}
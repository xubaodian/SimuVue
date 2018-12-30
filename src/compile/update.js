import { replaceValue } from '../compile/index';
import {getValue} from '../util/index';

export function renderMixin(Vue) {
    Vue.prototype._render = function () {
        if (this._dom == undefined) {
            if (this.$options.el) {
                let el = this.$options.el;
                let dom = document.querySelector(el);
                if (dom) {
                    this._dom = dom;
                } else {
                    console.error(`未发现dom: ${el}`);
                }
           } else {
               console.error('vue实例未绑定dom');
           }
        } 
        replaceText(this._dom, this);
    } 
}

//替换dom的innerText
function replaceText(dom, vm) {
    if (dom) {
        let children = Array.from(dom.childNodes);
        children.map(item => {
            if (item.nodeType === 3) {
                if (item.originStr === undefined) {
                    item.originStr = item.nodeValue;
                }
                let str = replaceValue(item.originStr, function(key){
                    return getValue(vm, key);
                });
                item.nodeValue = str;
            } else if (item.nodeType === 1) {
                replaceText(item, vm);
            }
        });
    }
}
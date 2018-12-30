import { getValue, setValue } from '../util/index'

export function initModelMixin(Vue) {
    Vue.prototype._initModel = function () {
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
        bindModel(this._dom, this);
    } 
}

//input输入框有V-model属性，则绑定input事件
function bindModel(dom, vm) {
    if (dom) {
        if (dom.tagName === 'INPUT') {
            let attrs = Array.from(dom.attributes);
            attrs.map(item => {
                if (item.name === 'v-model') {
                    let value = item.value;
                    dom.value = getValue(vm, value);
                    //绑定事件，暂不考虑清除绑定，因此删除dom造成的内存泄露我们暂不考虑，这些问题后续解决
                    dom.addEventListener('input', (event) => {
                        setValue(vm, value, event.target.value);
                    });
                }
            })
        }
        let children = Array.from(dom.children);
        if (children) {
            children.map(item => {
                bindModel(item, vm);
            });
        }
    }
}


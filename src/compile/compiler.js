var snabbdom = require('snabbdom');
var patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners').default, // attaches event listeners
]);

var h = require('snabbdom/h').default;

import { getValue, setValue } from '../util/index';

import {Watcher} from '../observe/watcher';

const startAt = /^@.*/;

const textKey = /\{\{(\w+)\}\}/;

export function renderMixin(Vue) {
  Vue.prototype._mountDom= function () {
    let vm = this;
    this._getEle();
    let updateDom = () => {
      vm._update(vm._render());
    }
    new Watcher(vm, updateDom, () => {
      vm._updateComponent();
    });
  }


  Vue.prototype._updateComponent = function() {
    this._update(this._render());
  }

  Vue.prototype._update = function (vnode) {
      let preVnode = this._vnode;
      if (!preVnode) {
        patch(this._dom, vnode);
      } else {
        patch(preVnode, vnode);
      }
      this._vnode = vnode;
  }

  Vue.prototype._render = function () {
    let newVnode = this._node.exec();
    return newVnode;
  }

  Vue.prototype._getEle = function () {
    let vm = this;
    if (this._dom == undefined) {
        if (this.$options.el) {
            let el = this.$options.el;
            let dom = document.querySelector(el);
            if (dom) {
              this._dom = dom;
              this._domCopy = dom.cloneNode(true);
              this._node = genNode(this._dom, this);
              console.log(this._node);
              this._dom.innerText = '';
            } else {
              console.error(`未发现dom: ${el}`);
            }
       } else {
          console.error('vue实例未绑定dom');
       }
    }
  }
}

//根据dom生成节点
function genNode(dom, vm) {
  let node = {
    sel: '',
    data: {},
    children: [],
    exec: null,
    vm: vm
  };
  //文本节点
  if (dom.nodeType === 3) {
    node.data = dom.nodeValue;
    node.exec = function(){
      let vm = this.vm;
      let str = this.data;
      return replaceStr(str, vm);
    }
    return node;
  }
  
  //普通节点
  //提取sel
  let tag = dom.tagName.toLowerCase();
  let id = dom.id ? '#' + dom.id: '';
  let classes = dom.className.trim();
  classes = classes.length > 0 ? '.' + classes.replace(/\s+/, '.') : '';
  let sel = `${tag}${id}${classes}`;
  node.sel = sel;

  //组装data  
  let nodeData = node.data;
  let attrs = dom.attributes.length > 0 ? Array.from(dom.attributes): [];
  if (attrs) {
    attrs.map(item => {
      if (startAt.test(item.name)) {
        setEvent(nodeData, vm, item);
      } else if (item.name === 'style') {
        setStyle(nodeData, vm, item);
      } else if (item.name === 'v-model') {
        if (dom.tagName === 'INPUT') {
          bindModel(nodeData, vm, item);
          node.exec = function() {
            let data = JSON.parse(JSON.stringify(this.data));
            data.on = this.data.on;
            let vm = this.vm;
            if (!data.props) {
              data.props = {
                value: getValue(vm, item.nodeValue)
              }
            } else {
              data.props.value = getValue(vm, item.nodeValue);
            }
            let children = [];
            if (this.children.length > 0) {
              this.children.map(item => {
                children.push(item.exec());
              })
            }
            return h(this.sel, data, children);
          }
        }
      }
    });
  }

  //子节点
  if (dom.childNodes.length > 0) {
    Array.from(dom.childNodes).map(item => {
      node.children.push(genNode(item, vm));
    });
  }
  if (!node.exec) {
    node.exec = function() {
      let children = [];
      if (this.children.length > 0) {
        this.children.map(item => {
          children.push(item.exec());
        })
      }
      let data = JSON.parse(JSON.stringify(this.data));
      data.on = this.data.on;
      return h(this.sel, data, children);
    }
  }
  return node;
}

//设置监听事件
function setEvent(data, vm, attr) {
  if (!data.on) {
    data.on = {};
  }
  let type = attr.name.replace('@', '');
  let preHandle = data.on[type];
  let handle = attr.nodeValue;
  if (!data.on[type]) {
    data.on[type] = [];
  }
  let handleFn = vm[handle].bind(vm);
  data.on[type].push(handleFn);
}

//设置style
function setStyle(data, vm, attr) {
  if (!data.style) {
    data.style = {};
  }
  let styleArr = attr.nodeValue.split(/;/);
  styleArr.map(item => {
    let arr = item.split(':');
    if (arr.length === 2) {
      data.style[arr[0].trim()] = arr[1].trim();
    }
  });
}

//input输入框有V-model属性，则绑定input事件
function bindModel(data, vm, attr) {
  if (!data.on) {
    data.on = {};
  }
  if(!data.on.input){
    data.on.input = [];
  }
  let handleFn = function() {
    setValue(vm, attr.nodeValue, event.target.value);
  };
  data.on.input.push(handleFn);
}

function cloneVnode(node) {
  return h(node.sel, node.data, node.children && node.children.slice())
}

function replaceStr(str, vm) {
  if (str) {
    str = str.replace(textKey, function(match, key){
      return vm[key] || '';
    });
  }
  return str;
}

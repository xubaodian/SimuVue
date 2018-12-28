//属性监听
export function defineReactive(obj, key, val, customSetter) {
  //获取对象给定属性的描述符
  let property = Object.getOwnPropertyDescriptor(obj, key);
  //对象该属性不可配置，直接返回
  if (property && property.configurable === false) {
    return;
  }

  //依赖更新
  const dep = new Dep();

  //获取属性get和set属性，若此前该属性已经进行监听，则确保监听属性不会被覆盖
  let getter = property && property.get;
  let setter = property && property.set;
  
  if (arguments.length < 3) {
    val = obj[key];
  }

  //如果监听的是一个对象，继续深入监听
  walk(obj[key], customSetter);
  //监听属性
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val;
      return value;
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val;
      //如果值没有变化，则不做改动
      if (newVal === value) {
        return;
      }
      walk(obj[key], customSetter);
      //自定义响应函数
      if (customSetter) {
        customSetter(newVal);
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
    }
  })
}




function walk (obj, customSetter){
  if (typeof obj === 'object'){
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]], customSetter);
    }
  }
}

//判断是够为对象
function isObject (obj){
  return obj !== null && typeof obj === 'object'
}

let hasOwnProperty = Object.prototype.hasOwnProperty;
//判断对象是够有该属性，且不是继承的
function hasOwn(obj, key) {
   return hasOwnProperty.call(obj, key);
}

class Watcher{
  constructor(vm) {
    this.dom = vm._dom;
    this.data = vm._data;
    Dep.target = this;
  }

  update() {

  }

  init() {
    let keys = Object.keys(this.data);
    let i = keys.length;
    while(i >= 0) {

    }
  }
}

//依赖中心
class Dep {
  constructor() {
    //订阅列表
    this.subs = [];
  }

  //添加订阅
  addSub(watcher) {
    this.subs.push[watcher];
  }

  //删除订阅者
  remove(watcher) {
    let index = this.subs.findIndex(item => item.id === watcher.id);
    if (index > -1) {
      this.subs.splice(index, 1);
    }
  }

  //添加依赖
  depend () {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  notify() {
    this.subs.map(item => {
      item.update();
    });
  }
}

Dep.target = null; 
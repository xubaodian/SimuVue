//属性监听
function defineReactive(obj, key, val, customSetter) {
  //获取对象给定属性的描述符
  let property = Object.getOwnPropertyDescriptor(obj, key);
  //对象该属性不可配置，直接返回
  if (property && property.configurable === false) {
    return;
  }

  const dep = new Dep();

  //获取属性get和set属性，若此前该属性已经进行监听，则确保监听属性不会被覆盖
  let getter = property.get;
  let setter = property.set;
  
  //若val为对象，则继续监听val属性
  let childOb = observe(val);

  //监听属性
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value;
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      //如果值没有变化，则不做改动
      if (newVal === value) {
        return;
      }
      //自定义
      if (customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
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

//监听器
class Observer{
  constructor(value) {
    this.value = value;
    this.dep = new Dep();
    
    Object.defineProperty(value, '__ob__', {
      value: value,
      enumerable: false,
      writable: true,
      configurable: true
    });
    if (Array.isArray(value)) {
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  //监听obj所有属性
  walk (obj) {
    if (typeof obj === 'object'){
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        defineReactive(obj, keys[i]);
      }
    }
  }

  observeArray (items) {
    if (Array.isArray(items)) {
      for (let i = 0, l = items.length; i < l; i++) {
        observe(items[i])
      }
    }
  }
}

function observe (value, asRootData){
  if (!isObject(value)) {
    return;
  }
  let ob = null;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
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

function dependArray (value) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}


class Watcher{
  constructor() {
    Dep.target = this;
  }

  update() {

  }
}
import { Dep } from './dep';

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
  let childOb = observe(val);
  //监听属性
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
      }
      return value;
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val;
      //如果值没有变化，则不做改动
      if (newVal === value) {
        return;
      }
      //自定义响应函数
      if (customSetter) {
        customSetter(newVal);
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = observe(newVal);
      dep.notify();
    }
  })
}



//监听value
export function observe(value){
  let ob = null;
  if (isObject(value)){
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
      ob = value.__ob__;
    } else {
      ob = new Observer(value);
    }
  }
  return ob;
}


//观察者对象
class Observer {
  constructor(value) {
    this.value = value;
    this.dep = new Dep();
    this.walk(value);
  }

  //监听对象所有属性
  walk(obj) {
    if (isObject(obj)){
      const keys = Object.keys(obj)
      for (let i = 0; i < keys.length; i++) {
        defineReactive(obj, keys[i])
      }
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
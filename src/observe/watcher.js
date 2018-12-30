import { Dep, pushTarget, popTarget } from './dep';
//观察者的唯一
let uid = 0;
//订阅者类
export class Watcher{
  //构造器，vm是vue实例
  constructor(vm, expOrFn, cb) {
    this.vm = vm;
    this.cb = cb;
    this.id = uid++;
    this.deps = [];
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
    }
    this.value = this.get();
  }

  //将订阅这添加到订阅中心
  get() {
    pushTarget(this)
    let value;
    const vm = this.vm;
    value = this.getter.call(vm, vm);
    popTarget();
    return value
  }

  //值变化，调用回调函数
  update() {
    this.cb(this.value);
  }

  //添加依赖
  addDep(dep) {
    this.deps.push(dep);
    dep.addSub(this);
  }
}

//解析类属性的路径，例如obj.sub.name，返回实际的值
export function parsePath (path){
  const segments = path.split('.');
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return;
      obj = obj[segments[i]];
    }
    return obj;
  }
}
//每个依赖的独立id
let uid = 0;

//依赖对象
export class Dep {
  constructor() {
    this.id = uid++;
    //订阅列表
    this.subs = [];
  }

  //添加订阅
  addSub(watcher) {
    //判断该订阅对象是否已经添加到订阅列表
    let index = this.subs.findIndex(item => item.id == watcher.id);
    //去重，已经添加的观察者，不再加入订阅列表，即同一个订阅者，只添加到队列一次
    if (index < 0) this.subs.push(watcher);
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
const targetStack = [];

export function pushTarget (target) {
  targetStack.push(target);
  Dep.target = target;
}

export function popTarget () {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}
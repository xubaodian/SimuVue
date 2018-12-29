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
    this.subs.push(watcher);
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
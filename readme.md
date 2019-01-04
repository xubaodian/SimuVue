本工程是学习Vue源码的一个工程，会分析Vue源码，并实现其中一些功能，开发一个精简版的Vue。<br>

本工程采用webpack构建，已经实现功能如下：<br>
1、双向绑定<br>
2、属性映射和方法重定义<br>

克隆工程后，请先使用下面指令安装依赖
```
npm install
```
启动工程命令如下,监听端口为20000：<br>
```
npm run dev
```
### 1、属性映射
使用Vue时，无论是获取data中的属性，还是调用methods的方法，我们都直接用vm[key],并没有使用vm.data[key]或vm.methods[key]。如下：
```javascript
let vm = new Vue({
  data: {
    name: 'xxx'
  }，
  methods: {
    sayName() {
      //并没有用this.data.name
      console.log(this.name);
    }
  }
})
```
这是因为初始化的时候，vue把data等属性做了代理，具体解释请访问 [属性映射说明](./docs/AttrMapping.md)。<br>

### 2、Vue的双向绑定
双向绑定属性应该是很多人喜欢的Vue这个框架的原因，这个特性让我们无需特别关注dom操作，只需关心值的变化，Vue会自动更新视图（View），更详细的介绍请移步 [双向绑定介绍](./docs/TwoWaysBinding.md)。


### 3、实现虚拟dom
vue源码中虚拟dom是使用snabbdom为原型，作了优化和改动。<br>
本工程中，我直接使用snabbdom来实现dom的替换。虚拟dom和编译等代码在src/compile/compiler.js中。
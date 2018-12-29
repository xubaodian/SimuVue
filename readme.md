本工程是学习Vue源码的一个工程，会分析Vue源码，并实现其中一些功能，主要内容如下：<br>

1、属性映射<br>
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
这是因为初始化的时候，vue把data等属性做了代理，具体解释请访问 [属性映射说明](./docs/AttrMapping.md)。
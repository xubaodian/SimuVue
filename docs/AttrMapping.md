Vue源码解析（一）data属性映射和methods函数引用的重定义<br>
使用Vue框架进行开发时，我们在option的data和methods中定义属性和方法，在调用时直接使用  vm.attr 或 vm.func()的形式，而不是用vm.data.attr或vm.methods.func()的方式。<br>
我们下面就一起学习下原理。<br>
我们传入Vue的options对象一般为以下这种形式，<br>
```javascript
{
  data: {
    name: 'xxx'
  },
  mounted() {
    //调用方法,没有使用this.methods.getInfo();
    this.getInfo();
  },
  methods: {
    getInfo() {
      //获取属性,没有使用this.data.name
      this.name = 'xxxx2314';
      //操作等等....
    }
  },
  computed: {
    getName() {
      return this.name;
    }
  },
  watch: {
    'name'(val, oldVal) {
      //这是操作
    }
  }
}
```
在vue实例中，我们无论data还是method，都直接调用，这是因为一下vue初始化时做了下面两点操作：<br>
1、给data中的属性做了代理，所有访问和设置vm[key]时,最终操作的是vm._data[key],而Vue在初始化时，会vm._data其实是options中data的引用。<br>
2、methods中的所有方法都直接在vue实例重新定义了引用。<br>
看下我的实现代码，是对Vue源码的精简，如下：
```javascript
//vue构造函数
class Vue {
  constructor(options) {
    //$options存储构造选项
    this.$options = options || {};
    //data保存构造设置中的data，暂时忽略data为函数的情况
    let data = options.data;
    this._data = data;
    //初始化
    this._init();
  }

  _init() {
    //映射key
    mapKeys(this);
    //在vue实例上重新定义方法的引用
    initMethods(this, this.$options.methods)
  }
}


//重新定义方法的引用,注意修改调用函数时的上下文环境，这里用bind，当然也可以用apply和call
function initMethods (vm, methods) {
  for (const key in methods) {
    vm[key] = typeof methods[key] !== 'function' ? noop : methods[key].bind(vm);
  }
}

//重新定义data的get和set
function mapKeys(vm) {
  let data = vm._data;
  if (null !== data && typeof data === 'object') {
    const keys = Object.keys(data);
    let i = keys.length;
    while (i-- >= 0) {
      //所有属性的操作就重新定向到了_data上
      proxy(vm, `_data`, keys[i]);
    }
  }
}

//使用defineProperty重新定义get和set
function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

//空函数，占位用
function noop () {}


//使用
let options = {
    data: {
        name: 'xxx',
        age: 18
    },
    methods: {
        sayName() {
            console.log(this.name);
        }
    }
}


let vm = new Vue(options);

vm.sayName();//控制台打印了xxx,可以把代码直接复制出去试一下

```
上面代码就完成了属性的重新映射和方法的引用重新定义。<br>

看下vue中源码，，如下，我做了注释，应该比较好懂:<br>
**简单说明一下，源码中使用了flow作为js代码的静态检查工具，原理和typescript类似，所以代码看起来会有些不同，不影响整体阅读**
```javascript
//初始化，参数是vue实例
function initData (vm: Component) {
  //获取options中的
  let data = vm.$options.data
  //设置vm._data，判断data是obj还是函数
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    //这是在开发环境打印的一些提示不用关心
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
      //代理访问，这就是为何操作vm[key]被定位到vm._data[key]的原因
      proxy(vm, `_data`, key)
    }
  }


  const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

//代理函数
export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  //利用defineProperty设置对象的get和set，操作属性时，target[key]会映射到target[sourceKey][key]
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

//方法映射
function initMethods (vm: Component, methods: Object) {
  const props = vm.$options.props
  for (const key in methods) {
    //这些都是开发环境的提示信息，可以忽略
    if (process.env.NODE_ENV !== 'production') {
      if (typeof methods[key] !== 'function') {
        warn(
          `Method "${key}" has type "${typeof methods[key]}" in the component definition. ` +
          `Did you reference the function correctly?`,
          vm
        )
      }
      if (props && hasOwn(props, key)) {
        warn(
          `Method "${key}" has already been defined as a prop.`,
          vm
        )
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          `Method "${key}" conflicts with an existing Vue instance method. ` +
          `Avoid defining component methods that start with _ or $.`
        )
      }
    }
    //关键在这，重新定义了引用
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm)
  }
}
```
有疑问可以给我留言，或发邮件至472784995@qq.com，欢迎大家来讨论
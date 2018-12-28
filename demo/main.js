import { defineReactive } from '../src/observe/index'
let obj = {
    name: 'xxx',
    subObj: {
        name: 'xxx'
    }
};
defineReactive(obj, 'subObj', obj.subObj, (value) => {
    console.log(value);
});
obj.subObj.name = 'asdfa';
obj.subObj = {
    name: 'xxx'
};

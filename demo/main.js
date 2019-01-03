import { Vue } from '../src/index';

let options = {
    el: '#app',
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

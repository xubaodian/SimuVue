// import { Vue } from '../src/index';

// let options = {
//     el: '#app',
//     data: {
//         name: 'xxx',
//         age: 18
//     },
//     methods: {
//         sayName() {
//             console.log(this.name);
//         }
//     }
// }


// let vm = new Vue(options);

var snabbdom = require('snabbdom');
var patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners').default, // attaches event listeners
]);
var h = require('snabbdom/h').default; // helper function for creating vnodes

var container = document.getElementById('container');

function someFn() {
    console.log(12341);
}

var vnode = h('div#container.two.classes', {on: {click: someFn}}, [
  h('span', {style: {fontWeight: 'bold'}}, 'This is bold'),
  ' and this is just normal text',
  h('a', {props: {href: '/foo'}}, 'I\'ll take you places!')
]);
// Patch into empty DOM element – this modifies the DOM as a side effect
patch(container, vnode);

// function anotherEventHandler() {
// }
// var newVnode = h('div#container.two.classes', {on: {click: anotherEventHandler}}, [
//   h('span', {style: {fontWeight: 'normal', fontStyle: 'italic'}}, 'This is now italic type'),
//   ' and this is still just normal text',
//   h('a', {props: {href: '/bar'}}, 'I\'ll take you places!')
// ]);
// // Second `patch` invocation
// patch(vnode, newVnode);
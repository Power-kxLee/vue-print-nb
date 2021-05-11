# vue-print-nb

This is a directive wrapper for printed, Simple, fast, convenient, light.
<!-- TOC -->

- [vue-print-nb](#vue-print-nb)
  - [Install](#install)
    - [Vue2 Version:](#vue2-version)
    - [Vue3 Version:](#vue3-version)
  - [Description](#description)
      - [Print the entire page:](#print-the-entire-page)
      - [Print local range:](#print-local-range)
      - [More](#more)
    - [v-print API](#v-print-api)
  - [License](#license)

<!-- /TOC -->
## Install

### Vue2 Version:
```bash
npm install vue-print-nb --save
```


```javascript
import Print from 'vue-print-nb'
// Global instruction 
Vue.use(Print);

//or

// Local instruction
import print from 'vue-print-nb'

directives: {
    print   
}
```
### Vue3 Version:
```bash
npm install vue3-print-nb --save
```

```javascript
// Global instruction 
import { createApp } from 'vue'
import App from './App.vue'
import print from 'vue3-print-nb'
const app = createApp(App)
app.use(print)
app.mount('#app')

//or

// Local instruction
import print from 'vue3-print-nb'

directives: {
    print   
}
```


![](https://github.com/Power-kxLee/vue-print-nb/blob/master/src/img/Chrome.png)

## Description

#### Print the entire page:

```
<button v-print>Print the entire page</button>
```


#### Print local range:

HTML:
```
    <div id="printMe" style="background:red;">
        <p>葫芦娃，葫芦娃</p>
        <p>一根藤上七朵花 </p>
        <p>小小树藤是我家 啦啦啦啦 </p>
        <p>叮当当咚咚当当　浇不大</p>
        <p> 叮当当咚咚当当 是我家</p>
        <p> 啦啦啦啦</p>
        <p>...</p>
    </div>

    <button v-print="'#printMe'">Print local range</button>
```
Pass in a string type directly
* `id`: ID of local print range

#### More
HTML:
```
 <button v-print="printObj">Print local range</button><div id="loading" v-show="printLoading"></div>
 
  <div id="printMe" style="background:red;">
        <p>葫芦娃，葫芦娃</p>
        <p>一根藤上七朵花 </p>
        <p>小小树藤是我家 啦啦啦啦 </p>
        <p>叮当当咚咚当当　浇不大</p>
        <p> 叮当当咚咚当当 是我家</p>
        <p> 啦啦啦啦</p>
        <p>...</p>
    </div>
```
JavaScript:
```
export default {
    data() {
        return {
           printLoading: true,
            printObj: {
              id: "printMe",
              popTitle: 'good print',
              extraCss: "https://www.google.com/css/css1.css, https://www.google.com/css/css2.css",
              extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',
              beforeOpenCallback (vue) {
                vue.printLoading = true
                console.log('打开之前')
              },
              openCallback (vue) {
                vue.printLoading = false
                console.log('执行了打印')
              },
              closeCallback (vue) {
                console.log('关闭了打印工具')
              }
            }
        };
    }
}
```
You can also pass in an object type `Objcet`


### v-print API

| Parame             | Explain                                                                        | Type     | OptionalValue                                     | DefaultValue |
| ------------------ | ------------------------------------------------------------------------------ | -------- | ------------------------------------------------- | ------------ |
| id                 | Range print ID, required value                                                 | String   | —                                                 | —            |
| standard           | Document type                                                                  | String   | html5/loose/strict                                | html5        |
| extraHead          | `<head></head>`Add DOM nodes in the node, and separate multiple nodes with `,` | String   | —                                                 | —            |
| extraCss           | `<link>` New CSS style sheet , and separate multiple nodes with `,`            | String   | —                                                 | -            |
| popTitle           | `<title></title>` Content of label                                             | String   | —                                                 | -            |
| openCallback       | Call the successful callback function of the printing tool                     | Function | Returns the instance of `Vue` called at that time | -            |
| closeCallback      | Close the callback function of printing tool success                           | Function | Returns the instance of `Vue` called at that time | -            |
| beforeOpenCallback | Callback function before calling printing tool                                 | Function | Returns the instance of `Vue` called at that time | -            |

## License

[MIT](http://opensource.org/licenses/MIT)
# vue-print-nb-dom-show

这里项目中遇在打印前页面不显示某些dom，打印时打印那些dom，打印完成时继续隐藏那些dom的需求，修改的vue-print-nb的代码，
具体的[Api](https://github.com/Power-kxLee/vue-print-nb)

<!-- /TOC -->
## Install


```bash
npm install vue-print-nb-dom-show --save
```


```javascript
import Print from 'vue-print-nb-dom-show'
// Global instruction 
Vue.use(Print);

<button v-print>Print the entire page</button>
```


### Print local range:

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

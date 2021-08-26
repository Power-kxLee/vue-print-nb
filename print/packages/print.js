/*
 * @Author: lee
 * @Date: 2021-05-10 11:45:50
 * @LastEditors: lee
 * @LastEditTime: 2021-05-20 15:39:43
 * @Description: file content
 */
import Print from './printarea.js';
/**
 * @file 打印
 * 指令`v-print`,默认打印整个窗口
 * 传入参数`v-print="'#id'"` , 参数为需要打印局部的盒子标识.
 */
const addEvent = (element, type, callback) => {
  if (element.addEventListener) {
    element.addEventListener(type, callback, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + type, callback);
  } else {
    element['on' + type] = callback;
  }
}
export default {
  directiveName: 'print',
  bind (el, binding, vnode) {
    let vue = vnode.context;
    let id = '';
    addEvent(el, 'click', () => {
      vue.$nextTick(() => {
        if (binding?.value?.clickMounted) {
          binding.value.clickMounted(vue)
        }
        if (typeof binding.value === 'string') {
          // 全局打印
          id = binding.value;
          localPrint();
        } else if (typeof binding.value === 'object' && !!binding.value.id) {
          // 局部打印
          id = binding.value.id;
          let ids = id.replace(new RegExp("#", "g"), '');
          let elsdom = document.getElementById(ids);
          if (!elsdom) console.log("id in Error"), id = '';
          localPrint();

        } else if(binding?.value?.preview) {
          localPrint();
        } else {
          window.print();
          return
        }
      });
    })

    const localPrint = () => {
      new Print({
        ids: id, // * 局部打印必传入id
        vue,
        url: binding.value.url, // 打印指定的网址，这里不能跟id共存 如果共存id的优先级会比较高
        standard: '', // 文档类型，默认是html5，可选 html5，loose，strict
        extraHead: binding.value.extraHead, // 附加在head标签上的额外标签,使用逗号分隔
        extraCss: binding.value.extraCss, // 额外的css连接，多个逗号分开
        previewTitle: binding.value.previewTitle || '打印预览', // 打印预览的标题
        zIndex: binding.value.zIndex || 20002, // 预览窗口的z-index
        previewPrintBtnLabel: binding.value.previewPrintBtnLabel || '打印', // 打印预览的标题
        popTitle: binding.value.popTitle, // title的标题
        preview: binding.value.preview || false, // 是否启动预览模式
        asyncUrl: binding.value.asyncUrl,
        previewBeforeOpenCallback () { // 预览窗口打开之前的callback
          binding.value.previewBeforeOpenCallback && binding.value.previewBeforeOpenCallback(vue)
        },
        previewOpenCallback () { // 预览窗口打开之后的callback
          binding.value.previewOpenCallback && binding.value.previewOpenCallback(vue)
        },
        openCallback () { // 调用打印之后的回调事件
          binding.value.openCallback && binding.value.openCallback(vue)
        },
        closeCallback () {
          binding.value.closeCallback && binding.value.closeCallback(vue)
        },
        beforeOpenCallback () {
          binding.value.beforeOpenCallback && binding.value.beforeOpenCallback(vue)
        }
      });

    };
  }
};
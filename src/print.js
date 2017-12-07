import Print from './printarea.js';
/**
 * @file 打印
 * 指令`v-print`,默认打印整个窗口
 * 传入参数`v-print="'#id'"` , 参数为需要打印局部的盒子标识.
 */
export default {
  directiveName: 'print',
  bind(el, binding, vnode) {
      let vue = vnode.context;
      let closeBtn = true;
      el.addEventListener('click', (event) => {
        if (binding.value) {
          localPrint();
        } else {
          window.print();
        }
      });

      const localPrint = () => {
        vue.$nextTick(() => {
          if (closeBtn) {
            closeBtn = false;
            let print = new Print({
              el: binding.value,
              endCallback() {
                closeBtn = true;
              }
            });
          }
        });
      };
    },

    update(el, binding) {

    },

    unbind(el) {

    }
};
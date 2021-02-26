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
		let id = '';
		el.addEventListener('click', () => {
			vue.$nextTick(() => {
				if (typeof binding.value === 'string') {
					id = binding.value;
				} else if (typeof binding.value === 'object' && !!binding.value.id) {
					id = binding.value.id;
					let ids = id.replace(new RegExp("#", "g"), '');
					let elsdom = document.getElementById(ids);
					if (!elsdom) console.log("id in Error"), id = '';
				}
				// 局部打印
				if (id) {
					localPrint();
				} else {
					// 直接全局打印
					window.print();
				}
			});

		});
		const localPrint = () => {
			if (closeBtn) {
				closeBtn = false;
				new Print({
					ids: id, // * 局部打印必传入id
					standard: '', // 文档类型，默认是html5，可选 html5，loose，strict
					extraHead: binding.value.extraHead, // 附加在head标签上的额外标签,使用逗号分隔
					extraCss: binding.value.extraCss, // 额外的css连接，多个逗号分开
					popTitle: binding.value.popTitle, // title的标题
					endCallback() { // 调用打印之后的回调事件
						closeBtn = true;
					}
				});
			}
		};
	}
};
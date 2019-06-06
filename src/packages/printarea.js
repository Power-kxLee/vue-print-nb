export default class {
    constructor(option) {

        this.standards = {
            strict: 'strict',
            loose: 'loose',
            html5: 'html5'
        };
        this.selectArray = []; // 存储select的
        this.counter = 0;
        this.settings = {
            standard: this.standards.html5,
            extraHead: '', // 附加在head标签上的额外元素,使用逗号分隔
            extraCss: '', // 额外的css逗号分隔
            popTitle: '', // 标题
            endCallback: null, // 成功打开后的回调函数
            el: '' // 局部打印的id
        };
        Object.assign(this.settings, option);

        this.init();
    }
    init() {
        this.counter++;
        this.settings.id = `printArea_${this.counter}`;
        let PrintAreaWindow = this.getPrintWindow(); // 创建iframe
        this.write(PrintAreaWindow.doc); // 写入内容
        this.print(PrintAreaWindow);
        this.settings.endCallback();
        let box = document.getElementById(this.settings.id);
        if (box) {
            box.parentNode.removeChild(box);
        }
    }
    print(PAWindow) {
        let paWindow = PAWindow.win;
        const _loaded = () => {
            paWindow.focus();
            paWindow.print();
        };
        paWindow.onload = _loaded();
    }
    write(PADocument, $ele) {
        PADocument.open();
        PADocument.write(`${this.docType()}<html>${this.getHead()}${this.getBody()}</html>`);
        PADocument.close();
        
    }
    docType() {
        if (this.settings.standard === this.standards.html5) {
            return '<!DOCTYPE html>';
        }
        var transitional = this.settings.standard === this.standards.loose ? ' Transitional' : '';
        var dtd = this.settings.standard === this.standards.loose ? 'loose' : 'strict';

        return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01${transitional}//EN" "http://www.w3.org/TR/html4/${dtd}.dtd">`;
    }
    getHead() {
        let extraHead = '';
        let links = '';
        let style = '';
        if (this.settings.extraHead) {
            this.settings.extraHead.replace(/([^,]+)/g, (m) => {
                extraHead += m;
            });
        }
        const _links = document.querySelectorAll('link');
        if (typeof _links === 'object' || _links.length > 0) {
            // 复制所有link标签
            for (let i = 0; i < _links.length; i++) {
                let item = _links[i];
                if (item.href.indexOf('.css') >= 0) {
                    links += `<link type="text/css" rel="stylesheet" href="${item.href}" >`;
                }
            }
        }
        // 循环获取style标签的样式
        for (let i = 0 ; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].cssRules || document.styleSheets[i].rules) {
                let rules = document.styleSheets[i].cssRules || document.styleSheets[i].rules;
                for (let b = 0 ; b < rules.length; b++) {
                    style += rules[b].cssText;
                }
            }
        }

        if (this.settings.extraCss) {
            this.settings.extraCss.replace(/([^,\s]+)/g, (m) => {
                links += `<link type="text/css" rel="stylesheet" href="${m}">`;
            });
        }

        return `<head><title>${this.settings.popTitle}</title>${extraHead}${links}<style type="text/css">${style}</style></head>`;
    }
    getBody() {
        let ele = this.getFormData(document.querySelector(this.settings.el));
        let htm = ele.outerHTML;
        return '<body>' + htm + '</body>';
    }
    // 根据type去处理form表单
    getFormData(ele) {
        let copy = ele.cloneNode(true);
        let copiedInputs = copy.querySelectorAll('input,select,textarea');
        let selectCount = -1;
        for (let i = 0; i < copiedInputs.length; i++) {
            let item = copiedInputs[i];
            let typeInput = item.getAttribute('type');
            let copiedInput = copiedInputs[i];
            // 获取select标签
            if (!typeInput) {
                typeInput = item.tagName === 'SELECT' ? 'select' : item.tagName === 'TEXTAREA' ? 'textarea' : '';
            }
            // 处理input框
            if (item.tagName === 'INPUT') {
                // 除了单选框 多选框比较特别
                if (typeInput === 'radio' || typeInput === 'checkbox') {
                    copiedInput.setAttribute('checked', item.checked);
                // 
                } else {
                    copiedInput.value = item.value;
                    copiedInput.setAttribute('value', item.value);
                } 
            // 处理select
            } else if (typeInput === 'select') {
                
                selectCount ++;
                for (let b = 0; b < ele.querySelectorAll('select').length; b++) {
                    let select = ele.querySelectorAll('select')[b]; // 获取原始层每一个select
                    !select.getAttribute('newbs') && select.setAttribute('newbs', b) // 添加标识
                    if (select.getAttribute('newbs') == selectCount) {
                        let opSelectedIndex = ele.querySelectorAll('select')[selectCount].selectedIndex;
                        item.options[opSelectedIndex].setAttribute('selected', true);

                    }
                }
            // 处理textarea
            } else{
                copiedInput.innerHTML = item.value;
                copiedInput.setAttribute('html', item.value);
            }
        }
        return copy;
    }
    getPrintWindow() {
        var f = this.Iframe();
        return {
            f: f,
            win: f.contentWindow || f,
            doc: f.doc
        };
    }
    Iframe() {
        let frameId = this.settings.id;
        let iframe;

        try {
            iframe = document.createElement('iframe');
            document.body.appendChild(iframe);
            iframe.style.border = '0px';
            iframe.style.position = 'absolute';
            iframe.style.width = '0px';
            iframe.style.height = '0px';
            iframe.style.right = '0px';
            iframe.style.top = '0px';
            iframe.setAttribute('id', frameId);
            iframe.setAttribute('src', new Date().getTime());
            iframe.doc = null;
            iframe.doc = iframe.contentDocument ? iframe.contentDocument : (iframe.contentWindow ? iframe.contentWindow.document : iframe.document);
        } catch (e) {
            throw new Error(e + '. iframes may not be supported in this browser.');
        }

        if (iframe.doc == null) {
            throw new Error('Cannot find document.');
        }

        return iframe;
    }
}
alert(2)
export default class {
  constructor(option) {
    this.standards = {
      strict: 'strict',
      loose: 'loose',
      html5: 'html5'
    };
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
  };
  init() {
    this.counter++;
    this.settings.id = `printArea_${this.counter}`;
    let box = document.getElementById(this.settings.id);
    if (box) {
      box.parentNode.removeChild(box);
    }
    let PrintAreaWindow = this.getPrintWindow(); // 创建iframe
    this.write(PrintAreaWindow.doc); // 写入内容
    this.print(PrintAreaWindow);
      this.settings.endCallback();
  };
  print(PAWindow, $ele) {
    console.log(PAWindow);
    let paWindow = PAWindow.win;
   /// paWindow.onload = () => {
      console.log('---调用打印 focus-----');
      paWindow.focus();
      paWindow.print();
      console.log('---调用打印 print-----');
   // };
  };
  write(PADocument, $ele) {
    PADocument.open();
    PADocument.write(`${this.docType()}<html>${this.getHead()}${this.getBody()}</html>`);
    PADocument.close();
    console.log('---加载打印数据-----');
  };
  docType() {
    if (this.settings.standard === this.standards.html5) {
      return '<!DOCTYPE html>';
    }
    var transitional = this.settings.standard === this.standards.loose ? ' Transitional' : '';
    var dtd = this.settings.standard === this.standards.loose ? 'loose' : 'strict';

    return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01${transitional}//EN" "http://www.w3.org/TR/html4/${dtd}.dtd">`;
  };
  getHead() {
    let extraHead = '';
    let links = '';
    let style = '';
    if (this.settings.extraHead) {
      this.settings.extraHead.replace(/([^,]+)/g, function(m) {
        extraHead += m;
      });
    }
    [].forEach.call(document.querySelectorAll('link'),function(item, i){
        if (item.href.indexOf('.css') >= 0) {
            links += `<link type="text/css" rel="stylesheet" href="${item.href}" >`;
        }
    });

      // document.querySelectorAll('link').forEach((item, i) => {
      //   if (item.href.indexOf('.css') >= 0) {
      //     links += `<link type="text/css" rel="stylesheet" href="${item.href}" >`;
      //   }
      // });

    for (let i = 0 ; i < document.styleSheets.length; i++) {
      if (document.styleSheets[i].cssRules || document.styleSheets[i].rules) {
        let rules = document.styleSheets[i].cssRules || document.styleSheets[i].rules;
        for (let b = 0 ; b < rules.length; b++) {
            try {
                style += rules[b].cssText;
            }catch(err){}
        }
      }
    }

    if (this.settings.extraCss) {
      this.settings.extraCss.replace(/([^,\s]+)/g, function(m) {
        links += `<link type="text/css" rel="stylesheet" href="${m}">`;
      });
    }

    return `<head><title>${this.settings.popTitle}</title>${extraHead}${links}<style type="text/css">${style}</style></head>`;
  };
  getBody() {
    let ele = this.getFormData(document.querySelector(this.settings.el));
    let htm = ele.outerHTML;
    console.log('htm', htm);
    return '<body>' + htm + '</body>';
  };
  // 处理form表单的默认状态
  getFormData(ele) {
    let copy = ele.cloneNode(true);
    let copiedInputs = copy.querySelectorAll('input,select,textarea');


    [].forEach.call(copiedInputs,function(item, i){
        let typeInput = item.getAttribute('type');
        let copiedInput = copiedInputs[i];
        if (typeInput === undefined) {
            typeInput = item.tagName === 'SELECT' ? 'select' : item.tagName === 'TEXTAREA' ? 'textarea' : '';
        }
        if (typeInput === 'radio' || typeInput === 'checkbox') {

            copiedInput.setAttribute('checked', item.checked);

        } else if (typeInput === 'text' || typeInput === '') {
            copiedInput.value = item.value;
            copiedInput.setAttribute('value', item.value);
        } else if (typeInput === 'select') {
            copiedInput.querySelectorAll('option').forEach((op, b) => {
                if (op.selected) {
                    op.setAttribute('selected', true);
                };
            });
        } else if (typeInput === 'textarea') {
            copiedInput.value = item.value;
            copiedInput.setAttribute('value', item.value);
        }
    });


    // copiedInputs.forEach((item, i) => {
    //   let typeInput = item.getAttribute('type');
    //   let copiedInput = copiedInputs[i];
    //   if (typeInput === undefined) {
    //     typeInput = item.tagName === 'SELECT' ? 'select' : item.tagName === 'TEXTAREA' ? 'textarea' : '';
    //   }
    //   if (typeInput === 'radio' || typeInput === 'checkbox') {
    //
    //     copiedInput.setAttribute('checked', item.checked);
    //
    //   } else if (typeInput === 'text' || typeInput === '') {
    //     copiedInput.value = item.value;
    //     copiedInput.setAttribute('value', item.value);
    //   } else if (typeInput === 'select') {
    //     copiedInput.querySelectorAll('option').forEach((op, b) => {
    //       if (op.selected) {
    //         op.setAttribute('selected', true);
    //       };
    //     });
    //   } else if (typeInput === 'textarea') {
    //     copiedInput.value = item.value;
    //     copiedInput.setAttribute('value', item.value);
    //   }
    // });
    return copy;
  };
  getPrintWindow() {
    var f = this.Iframe();
    return {
      win: f.contentWindow || f,
      doc: f.doc
    };
  };
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
  };
};
export default class {
  constructor(option) {

    this.standards = {
      strict: 'strict',
      loose: 'loose',
      html5: 'html5'
    };
    this.previewBody = null;
    this.close = null;
    this.previewBodyUtilPrintBtn = null;
    this.selectArray = []; // 存储select的
    this.counter = 0;
    this.settings = {
      standard: this.standards.html5,
    };
    Object.assign(this.settings, option);
    this.init();
  }
  init () {
    this.counter++;
    this.settings.id = `printArea_${this.counter}`;
    let url = ''
    if (this.settings.url && !this.settings.asyncUrl) {
      url = this.settings.url
    }
    let _this = this
    // 如果是异步的
    if (this.settings.asyncUrl) {

      _this.settings.asyncUrl(function (url) {
        let PrintAreaWindow = _this.getPrintWindow(url); // 创建iframe
        if (_this.settings.preview) {
          // 打开预览弹窗
          _this.previewIfrmaeLoad()
        } else {
          // 直接打印
          _this.print(PrintAreaWindow);
        }
      }, _this.settings.vue)
      return
    }
    let PrintAreaWindow = this.getPrintWindow(url); // 创建iframe

    if (!this.settings.url) {
      this.write(PrintAreaWindow.doc); // 写入内容
    }

    if (this.settings.preview) {
      // 打开预览弹窗
      this.previewIfrmaeLoad()
    } else {
      // 直接打印
      this.print(PrintAreaWindow);
    }
  }
  addEvent (element, type, callback) {
    if (element.addEventListener) {
      element.addEventListener(type, callback, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, callback);
    } else {
      element['on' + type] = callback;
    }
  }
  previewIfrmaeLoad () {
    let box = document.getElementById('vue-pirnt-nb-previewBox')

    if (box) {
      let _this = this
      let iframe = box.querySelector('iframe')
      this.settings.previewBeforeOpenCallback()
      this.addEvent(iframe, 'load', function () {
        _this.previewBoxShow()
        _this.removeCanvasImg()
        _this.settings.previewOpenCallback()
      })

      this.addEvent(box.querySelector('.previewBodyUtilPrintBtn'), 'click', function () {
        _this.settings.beforeOpenCallback()
        _this.settings.openCallback();
        iframe.contentWindow.print();
        _this.settings.closeCallback()
      })
    }
  }
  // 删除所有canva转换的图片
  removeCanvasImg () {
    let _this = this
    try {
      if (_this.elsdom) {
        // 删除canva转变图片的dom节点
        let canvasList = _this.elsdom.querySelectorAll('.canvasImg')
        for (let i = 0; i < canvasList.length; i++) {
          canvasList[i].remove()
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  print (ifrmae) {
    var _this = this;
    let iframe = document.getElementById(this.settings.id) || ifrmae.f;
    let iframeWin = document.getElementById(this.settings.id).contentWindow || ifrmae.f.contentWindow;
    var _loaded = function () {

      iframeWin.focus();
      _this.settings.openCallback();
      iframeWin.print();
      iframe.remove() // 删除ifrmae元素
      _this.settings.closeCallback()
      _this.removeCanvasImg()
    }
    _this.settings.beforeOpenCallback()
    _this.addEvent(iframe, 'load', function () {
      _loaded()
    })

  }
  write (PADocument) {
    PADocument.open();
    PADocument.write(`${this.docType()}<html>${this.getHead()}${this.getBody()}</html>`);
    PADocument.close();

  }
  docType () {
    if (this.settings.standard === this.standards.html5) {
      return '<!DOCTYPE html>';
    }
    var transitional = this.settings.standard === this.standards.loose ? ' Transitional' : '';
    var dtd = this.settings.standard === this.standards.loose ? 'loose' : 'strict';

    return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01${transitional}//EN" "http://www.w3.org/TR/html4/${dtd}.dtd">`;
  }
  getHead () {
    let extraHead = '';
    let links = '';
    let style = '';
    if (this.settings.extraHead) {
      this.settings.extraHead.replace(/([^,]+)/g, (m) => {
        extraHead += m;
      });
    }
    // 复制所有link标签
    [].forEach.call(document.querySelectorAll('link'), function (item) {
      if (item.href.indexOf('.css') >= 0) {
        links += `<link type="text/css" rel="stylesheet" href="${item.href}" >`;
      }
    });
    // 循环获取style标签的样式
    let domStyle = document.styleSheets;
    if (domStyle && domStyle.length > 0) {
      for (let i = 0; i < domStyle.length; i++) {
        try {
          if (domStyle[i].cssRules || domStyle[i].rules) {
            let rules = domStyle[i].cssRules || domStyle[i].rules;
            for (let b = 0; b < rules.length; b++) {
              style += rules[b].cssText;
            }
          }
        } catch (e) {
          console.log(domStyle[i].href + e);
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

  getBody () {
    let ids = this.settings.ids;
    ids = ids.replace(new RegExp("#", "g"), '');
    this.elsdom = this.beforeHanler(document.getElementById(ids));
    let ele = this.getFormData(this.elsdom);
    let htm = ele.outerHTML;
    return '<body>' + htm + '</body>';
  }
  // 处理canva转成图片
  beforeHanler (elsdom) {
    let canvasList = elsdom.querySelectorAll('canvas');
    // canvas转换png图片
    for (let i = 0; i < canvasList.length; i++) {
      if (!canvasList[i].style.display) {
        let _parent = canvasList[i].parentNode
        let _canvasUrl = canvasList[i].toDataURL('image/png')
        let _img = new Image()
        _img.className = 'canvasImg'
        _img.style.display = 'none'
        _img.src = _canvasUrl
        _parent.appendChild(_img)
      }
    }
    return elsdom
  }
  // 根据type去处理form表单
  getFormData (ele) {
    let copy = ele.cloneNode(true);
    let copiedInputs = copy.querySelectorAll('input,select,textarea');
    let canvasImgList = copy.querySelectorAll('.canvasImg,canvas');
    let selectCount = -1;
    // 处理所有canvas
    for (let i = 0; i < canvasImgList.length; i++) {
      let _parent = canvasImgList[i].parentNode
      let item = canvasImgList[i]
      // 删除克隆后的canvas节点
      if (item.tagName.toLowerCase() === 'canvas') {
        _parent.removeChild(item)
      } else {
        item.style.display = 'block'
      }
    }
    // 处理所有输入框
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
          if (item.checked) {
            copiedInput.setAttribute('checked', item.checked);
          }

        } else {
          copiedInput.value = item.value;
          copiedInput.setAttribute('value', item.value);
        }
        // 处理select
      } else if (typeInput === 'select') {

        selectCount++;
        for (let b = 0; b < ele.querySelectorAll('select').length; b++) {
          let select = ele.querySelectorAll('select')[b]; // 获取原始层每一个select
          !select.getAttribute('newbs') && select.setAttribute('newbs', b) // 添加标识
          if (select.getAttribute('newbs') == selectCount) {
            let opSelectedIndex = ele.querySelectorAll('select')[selectCount].selectedIndex;
            item.options[opSelectedIndex].setAttribute('selected', true);

          }
        }
        // 处理textarea
      } else {
        copiedInput.innerHTML = item.value;
        copiedInput.setAttribute('html', item.value);
      }
    }

    return copy;
  }
  getPrintWindow (url) {
    var f = this.Iframe(url);
    return {
      f: f,
      win: f.contentWindow || f,
      doc: f.doc
    };
  }
  previewBoxShow () {
    let box = document.getElementById('vue-pirnt-nb-previewBox')
    if (box) {
      document.querySelector('html').setAttribute('style', 'overflow: hidden')
      box.style.display = 'block'
    }
  }
  previewBoxHide () {
    let box = document.getElementById('vue-pirnt-nb-previewBox')
    if (box) {
      document.querySelector('html').setAttribute('style', 'overflow: visible;')
      box.querySelector('iframe') && box.querySelector('iframe').remove()
      box.style.display = 'none'
    }
  }
  previewBox () {

    let box = document.getElementById('vue-pirnt-nb-previewBox')
    let previewBodyClass = 'previewBody'
    if (box) {
      box.querySelector('iframe') && box.querySelector('iframe').remove()
      return {
        close: box.querySelector('.previewClose'),
        previewBody: box.querySelector(`.${previewBodyClass}`)
      }
    }
    let previewContent = document.createElement('div');
    previewContent.setAttribute('id', "vue-pirnt-nb-previewBox")
    previewContent.setAttribute('style', 'position: fixed;top: 0px;left: 0px;width: 100%;height: 100%;background: white;display:none')
    previewContent.style.zIndex = this.settings.zIndex
    // 打印预览弹窗的header
    let previewHeader = document.createElement('div');
    previewHeader.setAttribute('class', "previewHeader")
    previewHeader.setAttribute('style', "padding: 5px 20px;")
    previewHeader.innerHTML = this.settings.previewTitle
    previewContent.appendChild(previewHeader)
    // close关闭按钮
    this.close = document.createElement('div');
    let close = this.close
    close.setAttribute('class', "previewClose")
    close.setAttribute('style', "position: absolute;top: 5px;right: 20px;width: 25px;height: 20px;cursor: pointer;")
    let closeBefore = document.createElement('div');
    let closeAfter = document.createElement('div');
    closeBefore.setAttribute('class', "closeBefore")
    closeBefore.setAttribute('style', "position: absolute;width: 3px;height: 100%;background: #040404;transform: rotate(45deg); top: 0px;left: 50%;")
    closeAfter.setAttribute('class', "closeAfter")
    closeAfter.setAttribute('style', "position: absolute;width: 3px;height: 100%;background: #040404;transform: rotate(-45deg); top: 0px;left: 50%;")
    close.appendChild(closeBefore)
    close.appendChild(closeAfter)
    previewHeader.appendChild(close)

    // 打印预览弹窗的body
    this.previewBody = document.createElement('div');
    let previewBody = this.previewBody
    previewBody.setAttribute('class', previewBodyClass)
    previewBody.setAttribute('style', "display: flex;flex-direction: column; height: 100%;")
    previewContent.appendChild(previewBody)
    // 打印预览弹窗的body的工具栏
    let previewBodyUtil = document.createElement('div');
    previewBodyUtil.setAttribute('class', "previewBodyUtil")
    previewBodyUtil.setAttribute('style', "height: 32px;background: #474747;position: relative;")
    previewBody.appendChild(previewBodyUtil)
    // 打印的按钮
    this.previewBodyUtilPrintBtn = document.createElement('div');
    let previewBodyUtilPrintBtn = this.previewBodyUtilPrintBtn
    previewBodyUtilPrintBtn.setAttribute('class', 'previewBodyUtilPrintBtn')
    previewBodyUtilPrintBtn.innerHTML = this.settings.previewPrintBtnLabel
    previewBodyUtilPrintBtn.setAttribute('style', 'position: absolute;padding: 2px 10px;margin-top: 3px;left: 24px;font-size: 14px;color: white;cursor: pointer;background-color: rgba(0,0,0,.12);background-image: linear-gradient(hsla(0,0%,100%,.05),hsla(0,0%,100%,0));background-clip: padding-box;border: 1px solid rgba(0,0,0,.35);border-color: rgba(0,0,0,.32) rgba(0,0,0,.38) rgba(0,0,0,.42);box-shadow: inset 0 1px 0 hsla(0,0%,100%,.05), inset 0 0 1px hsla(0,0%,100%,.15), 0 1px 0 hsla(0,0%,100%,.05);')
    previewBodyUtil.appendChild(previewBodyUtilPrintBtn)

    // 添加整个预览到body
    document.body.appendChild(previewContent);

    return {
      close: this.close,
      previewBody: this.previewBody
    }
  }
  iframeBox (frameId, url) {
    let iframe = document.createElement('iframe');
    iframe.style.border = '0px';
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.right = '0px';
    iframe.style.top = '0px';
    iframe.setAttribute('id', frameId);
    iframe.setAttribute('src', url);

    return iframe
  }
  Iframe (url) {
    let frameId = this.settings.id;
    // 局部打印 用当前的时间做ifrmae的url
    url = !url ? new Date().getTime() : url
    let _this = this

    let iframe = this.iframeBox(frameId, url)

    // let that = this
    try {
      // 直接打印 不预览
      if (!this.settings.preview) {
        document.body.appendChild(iframe);

      } else {
        iframe.setAttribute('style', 'border: 0px;flex: 1;')
        // 预览打印
        let previewBox = this.previewBox()
        let previewBody = previewBox.previewBody
        let close = previewBox.close
        // 添加ifrmae到预览弹窗
        previewBody.appendChild(iframe);
        this.addEvent(close, 'click', function () {
          _this.previewBoxHide()
        })
      }

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
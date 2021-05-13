<template>
  <div id="app">
    <div id="loading">

    </div>
    <div v-if="config">
      <button v-print="printObj">Print the entire page</button>
      <div class="box"
           v-show="printLoading">
        <div class="loader-04"></div>
        正在处理...请稍等
      </div>
      <div id="printMe"
           style="background: #dac9c9">
        <div ref="qrcode"></div>
        <div ref="echartMain"
             :style="{width: '300px', height: '300px'}"></div>
        <input type="number" />
        <input type="time" />
        <input type="checkbox" />
        <input type="radio" />
        <select>
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </select>

        <select>
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </select>
        <textarea name=""
                  id=""
                  cols="30"
                  rows="10"></textarea>
        <p>葫芦娃，葫芦娃</p>
        <p style="background: yellow">一根藤上七朵花</p>
        <p>小小树藤是我家 啦啦啦啦</p>
        <p>叮当当咚咚当当 浇不大</p>
        <p>叮当当咚咚当当 是我家</p>
        <p>啦啦啦啦</p>
        <p>...</p>
      </div>
      <p>叮当当咚咚当当 浇不大</p>
    </div>
  </div>
</template>
<style type="text/css">
p {
  color: blue;
}
</style>
<script>
import QRCode from "qrcodejs2";
import * as echarts from "echarts";
export default {
  name: "app",
  data () {
    return {
      config: true,
      printLoading: false,

      printUrl: {
        url: 'http://localhost:8080/ ',
        preview: true,
        previewTitle: 'Test Title',
        previewPrintBtnLabel: 'Print',
        asyncUrl (reslove) {
          setTimeout(() => {
            reslove('http://localhost:8080/')
          }, 2000)
        },
        previewBeforeOpenCallback () {
          console.log('正在加载预览窗口')
        },
        previewOpenCallback () {
          console.log('已经加载完预览窗口')
        },
        beforeOpenCallback: function (vue) {
          vue.printLoading = true
          console.log('正在准备打印控件')
        },
        openCallback (vue) {
          vue.printLoading = false
          console.log('已经打开了 打印控件')
        },
        closeCallback () {
          console.log('关闭了打印工具')
        }
      },
      printObj: {
        id: "printMe",
        preview: true,
        previewTitle: 'Test Title',
        previewPrintBtnLabel: 'Print',
        popTitle: "good print",
        extraCss: "https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.compat.css, https://cdn.bootcdn.net/ajax/libs/hover.css/2.3.1/css/hover-min.css",
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',
        beforeOpenCallback: function (vue) {
          vue.printLoading = true
          console.log('正在准备打印控件')
        },
        openCallback (vue) {
          vue.printLoading = false
          console.log('已经打开了 打印控件')
        },
        closeCallback () {
          console.log('关闭了打印工具')
        }

      },
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.echart();
      new QRCode(this.$refs.qrcode, {
        width: 100,
        height: 100,
        text: "https://www.baidu.com/",
      });
    });
  },
  methods: {
    beforeOpen () {
      this.printLoading = true
      console.log('准备打开')
    },
    echart () {
      let myChart = echarts.init(this.$refs.echartMain);
      myChart.setOption({
        title: {
          text: "ECharts 入门示例",
        },
        tooltip: {},
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      });
    },
  },
};
</script>

<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
[class*="loader-"] {
  display: inline-block;
  width: 1em;
  height: 1em;
  color: inherit;
  vertical-align: middle;
  pointer-events: none;
}
.loader-04 {
  border: 1px solid currentcolor;
  border-radius: 50%;
  -webkit-animation: 1s loader-04 linear infinite;
  animation: 1s loader-04 linear infinite;
  position: relative;
}
.loader-04:before {
  content: "";
  display: block;
  width: 0;
  height: 0;
  position: absolute;
  top: -0.2em;
  left: 50%;
  border: 0.2em solid currentcolor;
  border-radius: 50%;
}
@-webkit-keyframes loader-04 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes loader-04 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>

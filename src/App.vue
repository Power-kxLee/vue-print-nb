<template>
  <div id="app">
    <div id="loading"></div>

    <h3 style="text-align: left;margin-left: 30px;">支持的打印方式:</h3>
    <el-divider><i class="el-icon-printer"></i></el-divider>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-button type="primary"
                   icon="el-icon-printer"
                   v-print>全局打印</el-button>
        <el-card class="box-card">
          对当前页面全部进行打印
        </el-card>
      </el-col>
    </el-row>
    <el-divider><i class="el-icon-printer"></i></el-divider>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-button type="primary"
                   icon="el-icon-magic-stick"
                   v-print="'#printMe'">局部打印(快速)</el-button>
                   <el-card class="box-card">
          可以打印页面某部分内容，直接传入对应的唯一标识ID
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-button type="primary"
                   icon="el-icon-umbrella"
                   v-print="printObj">局部打印(对象配置)</el-button>
                   <el-card class="box-card">
          也许你会需要一些配置，可接收一个对象，根据文档API进行设置
        </el-card>
      </el-col>
    </el-row>
    <el-divider><i class="el-icon-printer"></i></el-divider>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-button type="primary"
                   icon="el-icon-bank-card"
                   v-print="printUrl">预览网址</el-button>
                   <el-card class="box-card">
          我需要打印指定的网址(要符合同源策略) 需要传入一个对象，详细看文档API进行设置
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-button type="primary"
                   icon="el-icon-wallet"
                   v-print="printAsyncUrl">预览网址(异步)</el-button>
                   <el-card class="box-card">
          你打印的网址(URL)也是可以通过异步得到的
        </el-card>
        异步获取URL:<el-progress :text-inside="true" :stroke-width="20" :percentage="times"></el-progress>
      </el-col>
    </el-row>
    <div>
<el-divider><i class="el-icon-printer"></i></el-divider>
      <div class="asyncTips">

      </div>
      <div class="box"
           v-show="printLoading">
        <div class="loader-04"></div>
        正在处理...请稍等
      </div>
      <h3  style="text-align: left;margin-left: 30px;">下面是被打印的例子:</h3>

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
      printLoading: false,
      times: 0,
      printAsyncUrl: {
        preview: true,
        previewTitle: 'Test Title',
        previewPrintBtnLabel: 'Print',
        asyncUrl (reslove, vue) {
          const _set = setInterval(() => {
            vue.times += 20
          }, 1000)
          setTimeout(() => {
            reslove('http://localhost:8080/')
            clearInterval(_set)
          }, 5000)
        },
        previewBeforeOpenCallback: this.previewBeforeOpenCallback ,
        previewOpenCallback:this.previewOpenCallback,
        beforeOpenCallback: this.beforeOpenCallback,
        openCallback: this.openCallback,
        closeCallback: this.closeCallback,
        clickMounted: this.clickMounted
      },
      printUrl: {
        url: 'http://127.0.0.1:8080/ ',
        preview: true,
        previewTitle: 'Test Title',
        previewPrintBtnLabel: 'Print',
        previewBeforeOpenCallback: this.previewBeforeOpenCallback ,
        previewOpenCallback:this.previewOpenCallback,
        beforeOpenCallback: this.beforeOpenCallback,
        openCallback: this.openCallback,
        closeCallback: this.closeCallback,
        clickMounted: this.clickMounted
      },
      printObj: {
        id: "printMe",
        popTitle: "good print",
        extraCss: "https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.compat.css, https://cdn.bootcdn.net/ajax/libs/hover.css/2.3.1/css/hover-min.css",
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',
        beforeOpenCallback: this.beforeOpenCallback,
        openCallback: this.openCallback,
        closeCallback: this.closeCallback,
        clickMounted: this.clickMounted

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
    clickMounted(vue) {
      vue.$notify({
        title: '消息',
        message: '点击按钮的回调事件',
      });
    },
    previewBeforeOpenCallback(vue) {
      vue.$notify({
        title: '消息',
        message: '正在加载预览窗口',
      });
    },
    previewOpenCallback(vue) {
      vue.times = 0
      vue.$notify({
            title: '消息',
            message: '已经加载完预览窗口',
            type: 'success'
          });
    },
    beforeOpenCallback(vue) {
      vue.printLoading = true
      vue.$notify({
        title: '消息',
        message: '正在准备打印控件',
      });
    },
    openCallback(vue) {
      vue.printLoading = false
      vue.$notify({
        title: '消息',
        message: '已经打开了 打印控件',
      });
    },
    closeCallback(vue) {
      vue.$notify({
        title: '消息',
        message: '关闭了打印工具',
      });
    },
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

<style scoped lang="scss">
#app::v-deep {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
      width: 800px;
    margin: 0 auto;
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    .box-card {
      margin-top: 10px;
    }
  }
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

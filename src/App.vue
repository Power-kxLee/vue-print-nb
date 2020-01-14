<template>
	<div id="app">
		<button v-print="printObj">Print the entire page</button>
		<div id="printMe" style="background:#60aebf;">
			<div ref="qrcode"></div>
			<div ref="echartMain" :style="{width: '300px', height: '300px'}"></div>
			<input type="number">
			<input type="time">
			<input type="checkbox">
			<input type="radio">
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
			
			<textarea name="" id="" cols="30" rows="10"></textarea>
			<p>葫芦娃，葫芦娃</p>
			<p style="background:yellow;">一根藤上七朵花 </p>
			<p>小小树藤是我家 啦啦啦啦 </p>
			<p>叮当当咚咚当当　浇不大</p>
			<p> 叮当当咚咚当当 是我家</p>
			<p> 啦啦啦啦</p>
			<p>...</p>
		</div>
	</div>
</template>
<style type="text/css">
	p {
		color: blue;
	}
</style>
<script>
	import QRCode from 'qrcodejs2';
	import echarts from 'echarts'
	export default {
		name: 'app',
		data() {
			return {
				printObj: {
					id: "printMe",
					popTitle: 'good print',
					extraCss: 'https://www.baidu.com/,https://www.baidu.com/',
					extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
				}
			};
		},
		mounted() {
			this.echart()
			this.$nextTick(() => {

				new QRCode(this.$refs.qrcode, {
					width: 100,
					height: 100, 
					text: 'https://www.baidu.com/'
				})
			})
		},
		methods: {
			echart() {
				let myChart = echarts.init(this.$refs.echartMain);
				myChart.setOption({
					title: {
							text: 'ECharts 入门示例'
					},
					tooltip: {},
					xAxis: {
							data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
					},
					yAxis: {},
					series: [{
							name: '销量',
							type: 'bar',
							data: [5, 20, 36, 10, 10, 20]
					}]
				});
			}, 
		}
	}
</script>

<style>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		margin-top: 60px;
	}
</style>

<template>
	<div id="app">
		<div v-if="config">
			<button v-print='printObj'>Print the entire page</button>
			<div id="printMe" style="background:red;">
				<div ref="qrcode"></div>

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
				<p>小小树藤是我家 啦啦啦啦</p>
				<p>叮当当咚咚当当 浇不大</p>
				<p> 叮当当咚咚当当 是我家</p>
				<p> 啦啦啦啦</p>
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
	import QRCode from 'qrcodejs2';
	export default {
		name: 'app',
		data() {
			return {
				config: true,
				printObj: {
					id: "printMe",
					popTitle: 'good print',
					extraCss: '',
					extraHead: ''
				}
			};
		},

		mounted() {
			this.$nextTick(() => {
				new QRCode(this.$refs.qrcode, {
					width: 100,
					height: 100, 
					text: 'https://www.baidu.com/'
				})
			})
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

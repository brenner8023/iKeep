<template>
<view class="container">
	<view class="left">
		<view class="col-1"><text>{{date}}</text></view>
		<view class="col-2">
			<view class="row-1"><text>{{day}}</text></view>
			<view class="row-2"><text>{{yearAndMonth}}</text></view>
		</view>
	</view>
	<view class="right">
		<text>{{hourAndMinute}}</text>
	</view>
</view>
</template>

<script>
	export default {
		data() {
			let today = new Date();
			
			return {
				date: "01",
				day: "周一",
				yearAndMonth: "2020年04月",
				hourAndMinute: "00:00"
			};
		},
		created() {
			Object.assign(this.$data, this.formatTime());
			setInterval(() => {
				Object.assign(this.$data, this.formatTime());
			}, new Date().getMilliseconds());
		},
		methods: {
			formatTime() {
				let today = new Date(),
					day = today.getDay(),
					year = today.getFullYear(),
					month = today.getMonth() + 1,
					hour = today.getHours(),
					minute = today.getMinutes(),
					date = today.getDate();
					
				switch(day) {
					case 1:
						day = "周一";
						break;
					case 2:
						day = "周二";
						break;
					case 3:
						day = "周三";
						break;
					case 4:
						day = "周四";
						break;
					case 5:
						day = "周五";
						break;
					case 6:
						day = "周六";
						break;
					case 0:
						day = "周日";
						break;
				}
				
				if (month < 10) month = "0" + month;
				if (hour < 10) hour = "0" + hour;
				if (minute < 10) minute = "0" + minute;
				if (date < 10) date = "0" + date;
				
				return {
					day,
					date,
					yearAndMonth: `${year}年${month}月`,
					hourAndMinute: `${hour}:${minute}`
				};
			}
		}
	}
</script>

<style scoped lang="scss">
.container {
	box-sizing: border-box;
	width: 100vw;
	background-color: $color-blue;
	color: #fff;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	padding-top: 0;
}
.left {
	display: flex;
	.col-1 {
		font-size: 72rpx;
		font-weight: bold;
		margin-right: 20rpx;
	}
}
.right {
	font-size: 72rpx;
	font-weight: bold;
}
</style>

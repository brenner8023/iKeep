<template>
	<view class="container">
		<view class="btn-wrap">
			<view :style="{color: btnIdx == 0 ? listOfTask[taskIdx].color : null}" @click="btnIdx=0"><text>每日投入</text></view>
			<view :style="{color: btnIdx == 1 ? listOfTask[taskIdx].color : null}" @click="btnIdx=1"><text>每月投入</text></view>
		</view>
		<blovk v-if="btnIdx == 0">
			<block v-for="item in everyDate[taskIdx].list" :key="item.title">
				<view class="block-out">
					<view class="block-in" :style="{backgroundColor: listOfTask[taskIdx].color, width: item.count / 18 * 94 + 'vw'}"></view>
				</view>
				<view class="txt-wrap">
					<text>{{item.title}}</text>
					<text>{{item.count + "小时"}}</text>
				</view>
			</block>
		</blovk>
		<block v-else>
			<block v-for="item in everyMonth[taskIdx].list" :key="item.title">
				<view class="block-out">
					<view class="block-in" :style="{backgroundColor: listOfTask[taskIdx].color, width: item.count / (16 * 28) * 94 + 'vw'}"></view>
				</view>
				<view class="txt-wrap">
					<text>{{item.title}}</text>
					<text>{{item.count + "小时"}}</text>
				</view>
			</block>
		</block>
	</view>
</template>

<script>
	export default {
		props: ["taskIdx"],
		data() {
			return {
				everyDate: [],
				everyMonth: [],
				btnIdx: 0, // 0表示每日投入，1表示每月投入
			};
		},
		computed: {
			listOfTask() {
				return this.$store.state.listOfTask;
			}
		},
		created() {
			this.genData();
			this.$bus.$on("shouldUpdateData", () => {
				this.genData();
			});
		},
		methods: {
			genData() {
				let tmp1 = [],
					mon1 = [];
				this.listOfTask.forEach(task => {
					let tmp2 = [],
						mon2 = [],
						len = task.arr.length > 10 ? 10 : task.arr.length;
						
					task.arr.sort((a, b) => b.date - a.date);
					
					for (let i = 0; i < len; i++) {
						let item = task.arr[i],
							t = new Date(item.date),
							year = t.getFullYear(),
							month = t.getMonth() + 1,
							date = t.getDate();
				
						if (mon2.length && mon2[mon2.length-1].month == month) {
							mon2[mon2.length-1].count += Number((item.count / 3600).toFixed(2));
						} else mon2.push({
							title: `${year}年${month}月`,
							month,
							count: Number((item.count / 3600).toFixed(2))
						});
						
						tmp2.push({
							title: `${year}年${month}月${date}日`,
							count: (item.count / 3600).toFixed(2)
						});
					}
					tmp1.push({
						name: task.name,
						list: tmp2
					});
					mon1.push({
						name: task.name,
						list: mon2
					});
				});
				Object.assign(this.everyDate, tmp1);
				Object.assign(this.everyMonth, mon1);
			}
		}
	}
</script>

<style lang="scss" scoped>
.container {
	margin-top: 50rpx;
}
.btn-wrap {
	display: flex;
	justify-content: space-around;
	margin: 30rpx auto;
}
.block-out {
	box-sizing: border-box;
	height: 80rpx;
	margin: 10rpx auto;
	background-color: #e9e9e9;
	
	.block-in{
		height: 80rpx;
	}
}
.txt-wrap {
	position: relative;
	top: -70rpx;
	display: flex;
	justify-content: space-between;
	padding: 0 20rpx;
}
</style>

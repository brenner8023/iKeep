<template>
<view>
	<comHeader></comHeader>
	<block v-if="listOfTask.length == 0">
		<view><text>暂无数据</text></view>
	</block>
	<block v-else>
		<view class="part">
			<view class="title">
				<view class="row-1"><text>iKeep时间投资计划</text></view>
				<view><text>10000 hours to master a kill</text></view>
			</view>
			<view class="pie">
				<canvas canvas-id="canvasPie" id="canvasPie" @touchstart="touchPie"></canvas>
			</view>
		</view>
		<view class="part part-2">
			<view class="part-2-header" :style="{color: listOfTask[currIdx].color}">
				<view class="col-1">
					<text class="iconfont icon-task"></text>
				</view>
				<view class="col-2">
					<picker :range="task_mode" :value="currIdx" @change="handleModeChange">
						<view class="row-1">
							<text>{{ listOfTask[currIdx].name }}</text>
							<text class="iconfont icon-xiala1"></text>
						</view>
					</picker>
					<view class="row-2">
						<text>{{createTime}}</text>
					</view>
				</view>
				<view class="col-3">
					<view><text>{{ taskTotalTime }}</text></view>
					<view><text>hours</text></view>
				</view>
			</view>
			<comTimeput :task-idx="currIdx"></comTimeput>
		</view>
	</block>
</view>
</template>

<script>
import comHeader from "../../components/com-header.vue";
import comTimeput from "../../components/com-timeput.vue";
import uCharts from "../../util/uCharts.min.js";
import {mapState} from "vuex";

export default {
	data() {
		return {
			btnIdx: 0, // 0表示每日投入，1表示每月投入
			// 饼图数据
			pieData: {
				series: []
			},
			// 单个任务总时间数据
			timeData: [],
			all_time: 0, // 所有任务总时间
			canvasPie: null,
			width: uni.upx2px(660), // canvas宽
			height: uni.upx2px(450), // canvas高
			currIdx: 0, // 当前显示的task
			taskTotalTime: 0
		};
	},
	computed: {
		...mapState(["listOfTask"]),
		createTime() {
			let t = this.listOfTask.length == 0 ? 0 : this.listOfTask[this.currIdx].create_time;
			let d = new Date(t),
				year = d.getFullYear(),
				month = d.getMonth() + 1,
				date = d.getDate();
			return `从${year}年${month}月${date}日`;
		},
		task_mode() {
			return this.listOfTask.map(item => item.name);
		}
	},
	components: {
		comTimeput,
		comHeader
	},
	created() {
		this.getTaskTotalTime();
	},
	onShow() {
		this.getTaskTotalTime();
		this.getPieData();
		this.showPie("canvasPie", this.pieData);
		this.$bus.$emit("shouldUpdateData");
	},
	methods: {
		getTaskTotalTime() {
			let arr = [];
			this.listOfTask.forEach(task => {
				let total_time = 0; // 计算单个任务总时间
				
				task.arr.forEach(item => {
					total_time += item.count;
				});
				
				this.all_time += total_time;
				arr.push({
					name: task.name,
					data: total_time
				});
			});
			Object.assign(this.timeData, arr);
			this.taskTotalTime = this.timeData.length == 0 ? 0 : (this.timeData[this.currIdx].data / 3600).toFixed(2);
		},
		handleModeChange(e) {
			this.currIdx = e.detail.value;
		},
		getPieData() {
			let arr = [];
			this.listOfTask.forEach(task => {
				let total_time = 0; // 计算单个任务总时间
				
				task.arr.forEach(item => {
					total_time += item.count;
				});
				
				this.all_time += total_time;
				arr.push({
					name: task.name,
					data: total_time
				});
			});
			
			Object.assign(this.pieData.series, arr); // 直接替换
			this.all_time /= 3600; // 转换为以小时为单位
		},
		showPie(canvasId, chartData) {
			this.canvaPie = new uCharts({
				$this: this,
				canvasId: canvasId,
				type: 'pie',
				fontSize: 11,
				legend: {
					show: true,
					position: "right",
					float: "center",
					itemGap: 10,
					padding: 5,
					lineHeight: 26,
					margin: 5,
					borderWidth: 1
				},
				background: '#FFFFFF',
				pixelRatio: 1,
				series: chartData.series,
				animation: true,
				width: this.width,
				height: this.height,
				dataLabel: true,
				extra: {
					pie: {
					  lableWidth:15
					}
				},
			});
		},
		touchPie(e){
			this.canvaPie.showToolTip(e, {
				format: function (item) {
					let data = (item.data / 3600).toFixed(2);
					return `${item.name}:${data}小时`;
				}
			});
		},
	}
}
</script>

<style scoped lang="scss">
.part {
	box-sizing: border-box;
	width: 94vw;
	margin: 30rpx auto;
	padding: 20rpx;
	background-color: #fff;
}
.title {
	text-align: center;
	font-size: 28rpx;
	padding: 20rpx;
	
	.row-1 {
		font-size: 48rpx;
		font-weight: bold;
	}
}
.pie {
	width: 660upx;
	height: 450upx;
	margin: 0 auto;
	
	canvas {
		width: 660upx;
		height: 450upx;
	}
}
.part-2 {
	.iconfont {
		font-size: 48rpx;
	}
	.icon-task {
		font-size: 48px;
		margin-right: 20rpx;
	}
	
	.col-2 {
		.row-1 {
			font-size: 48rpx;
		}
		.row-2 {
			color: #ccc;
		}
	}
	
	.col-3 {
		margin-left: auto;
		font-size: 48rpx;
		font-weight: bold;
		text-align: center;
	}
}
.part-2-header {
	display: flex;
	border-bottom: 4rpx solid #ccc;
}
</style>

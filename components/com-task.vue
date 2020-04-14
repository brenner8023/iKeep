<template>
<view class="task" :style="{borderColor: color}" @click="handleChangeTaskClick(idx)">
	<view class="task-name">
		<text>{{name}}</text>
	</view>
	<view class="task-option">
		<text class="iconfont icon-anniu opt1" :style="{color:color}"></text>
		<picker class="opt2" mode="multiSelector" @change="handleTaskAddTime(idx)" :range="listOfDate" @click.stop :value="timeArr" @columnchange="handleColumnChange">
			<text class="iconfont icon-naozhong-copy"></text>
		</picker>
		<text class="opt3 iconfont icon-shanchu1" @click.stop="handleRemoveTaskClick(idx)"></text>
	</view>
</view>
</template>

<script>
	// 单个任务组件
	import indexService from "../api/index.js";

	export default {
		props: ["name", "color", "idx"],
		data() {
			return {
				listOfDate: [["今天", "昨天", "前天"], ["增加1m", "增加5m", "增加10m", "增加30m", "增加1h"]],
				timeArr: [0, 0]
			};
		},
		computed: {
			isPlay() {
				return this.$store.state.isPlay;
			},
			listOfTask() {
				return this.$store.state.listOfTask;
			}
		},
		methods: {
			// 点击切换task
			handleChangeTaskClick(idx) {
				if (this.isPlay) {
					uni.showToast({
						title: "计时ing，无法切换",
						icon: "none"
					});
				} else this.$store.commit("changeClockIdx", idx);
			},
			// 添加使用时间的多列选择器事件函数
			handleColumnChange(e) {
				let [column, v] = [e.detail.column, e.detail.value];
				if (column == 0) this.timeArr[0] = v;
				else this.timeArr[1] = v;
			},
			// 给任务添加使用时间
			handleTaskAddTime(idx) {
				indexService.getCurrDate().then(res => {
					let {time} = res,
						duration = 0;
					switch(this.timeArr[0]) {
						case 0:
							break;
						case 1:
							time -= 24 * 3600 * 1000;
							break;
						case 2:
							time -= 2 * 24 * 3600 * 1000;
							break;
					}
					switch(this.timeArr[1]) {
						case 0:
							duration = 60;
							break;
						case 1:
							duration = 5 * 60;
							break;
						case 2:
							duration = 10 * 60;
							break;
						case 3:
							duration = 30 * 60;
							break;
						case 4:
							duration = 60 * 60;
							break;
					}
					indexService.updateTaskTime(this.listOfTask[idx], duration, time);
				});
			},
			// 删除任务
			handleRemoveTaskClick(idx) {
				uni.showModal({
					title: "提示",
					content: `是否删除 ${this.listOfTask[idx].name} 任务`,
					success: res => {
						if (res.confirm) {
							indexService.removeTask(this.listOfTask[idx]._id);
							this.$store.commit("delTaskListItem", idx);
						}
					}
				});
			}
		}
	}
</script>

<style scoped lang="scss">
.task {
	box-sizing: border-box;
	width: 90vw;
	margin-top: 40rpx;
	padding: 40rpx;
	padding-right: 20rpx;
	background: #fff;
	display: flex;
	justify-content: space-between;
	border-left: 20rpx solid $color-blue;
}
.task-name {
	width: 400rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.task-option {
	display: flex;
	
	.iconfont {
		font-size: 48rpx;
	}
	.opt1 {
		margin-right: 50rpx;
	}
	.opt2 {
		margin-right: 50rpx;
		color: $color-blue;
	}
	.opt3 {
		color: #ff7373;
	}
}
</style>

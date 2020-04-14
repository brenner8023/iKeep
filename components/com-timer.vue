<template>
<view class="timer" :style="{borderColor:clockColor}">
	<view class="row row-1">
		<picker :range="timing_mode" :value="modeIdx" @change="handleModeChange">
			<view class="timer-mode" :style="{backgroundColor:clockColor}">
				<text>{{timing_mode[modeIdx]}}</text>
				<text class="iconfont icon-xiala1"></text>
			</view>
		</picker>
		<view class="btn-control">
			<text :class="btnPlayClass" @click="handlePlayClick" :style="{backgroundColor:clockColor}"></text>
			<text class="iconfont icon-wancheng1" @click="handleTaskDoneClick" :style="{backgroundColor:clockColor}"></text>
		</view>
	</view>
	<view class="row row-2"><text>正在{{ clockName }}：</text></view>
	<view class="row row-3" :style="{color:clockColor}">{{time}}</view>
</view>
</template>

<script>
// 计时功能组件
import {mapState} from "vuex";
import indexService from "../api/index.js";

export default {
	data() {
		return {
			timing_mode: ["正计时", "倒计时5m", "倒计时10m", "倒计时15m", "倒计时20m", "倒计时30m", "倒计时1h", "倒计时1h30m"],
			modeIdx: 0, // timing_mode数组的下标索引
			playTimer: null, // 定时器函数的标志
			h: 0,
			m: 0,
			s: 0
		}
	},
	computed: {
		...mapState(["listOfTask", "clockIdx", "isPlay"]),
		clockColor() {
			return this.listOfTask[this.clockIdx].color;
		},
		clockName() {
			return this.listOfTask[this.clockIdx].name;
		},
		btnPlayClass() {
			return "iconfont btn-1 " + (this.isPlay == 0 ? "icon-kaishi1" : "icon-zanting1"); 
		},
		time() {
			let _h = this.h,
				_m = this.m,
				_s = this.s;
			if (_h < 10) _h = "0" + _h;
			if (_m < 10) _m = "0" + _m;
			if (_s < 10) _s = "0" + _s;
			return `${_h}:${_m}:${_s}`;
		}
	},
	methods: {
		resetTimer() {
			if (this.playTimer) clearInterval(this.playTimer);
			Object.assign(this.$data, {
				modeIdx: 0, // timing_mode数组的下标索引
				playTimer: null,
				h: 0,
				m: 0,
				s: 0
			});
			this.$store.commit("changeIsPlay", 0);
		},
		// 切换倒计时、正计时模式
		handleModeChange(e) {
			this.resetTimer();
			this.modeIdx = e.detail.value;
			switch(Number(this.modeIdx)) {
				case 0:
					this.h = 0;
					this.s = 0;
					this.m = 0;
					break;
				case 1:
					this.h = 0;
					this.s = 0;
					this.m = 5;
					break;
				case 2:
					this.m = 10;
					this.h = 0;
					this.s = 0;
					break;
				case 3:
					this.m = 15;
					this.h = 0;
					this.s = 0;
					break;
				case 4:
					this.m = 20;
					this.h = 0;
					this.s = 0;
					break;
				case 5:
					this.m = 30;
					this.h = 0;
					this.s = 0;
					break;
				case 6:
					this.h = 1;
					this.m = 0;
					this.s = 0;
					break;
				case 7:
					this.h = 1;
					this.m = 30;
					this.s = 0;
					break;
			}
		},
		// 开始、暂停或继续计时的点击事件函数
		handlePlayClick() {
			this.$store.commit("changeIsPlay");
			
			if (this.isPlay) {
				if (this.modeIdx == 0)
					this.playTimer = setInterval(this.countUp, 1000);
				else this.playTimer = setInterval(this.countDown, 1000);
			}
			else if (this.playTimer) {
				clearInterval(this.playTimer);
			}
		},
		// 打卡，上报数据
		handleTaskDone(duration) {
			indexService.updateTaskTime(this.listOfTask[this.clockIdx], duration);
			this.resetTimer();
		},
		// 完成打卡点击事件
		handleTaskDoneClick() {
			let duration = this.h * 60 * 60 + this.m * 60 + this.s;
			
			if (duration == 0) return;
			// 确保暂停计时
			if (this.isPlay) this.handlePlayClick();
			
			uni.showModal({
				title: "提示",
				content: "是否完成打卡",
				success: res => {
					if (res.confirm) {
						this.handleTaskDone(duration);
					}
				}
			});
		},
		// 倒计时
		countDown() {
			if (this.h <= 0 && this.m <= 0 && this.s <= 0) {
				let duration = 0;
				switch(this.modeIdx) {
					case 0:
						break;
					case 1:
						duration = 5 * 60;
						break;
					case 2:
						duration = 10 * 60;
						break;
					case 3:
						duration = 15 * 60;
						break;
					case 4:
						duration = 20 * 60;
						break;
					case 5:
						duration = 30 * 60;
						break;
					case 6:
						duration = 60 * 60;
						break;
					case 7:
						duration = 90 * 60;
						break;
				}
				this.handleTaskDone(duration);
				uni.vibrateLong(); // 手机振动
			} else {
				this.s--;
				if (this.s <= 0 && this.m > 0) {
					this.s = 59;
					this.m--;
					if (this.m <= 0 && this.h > 0) {
						this.m = 59;
						this.h--;
					}
				}
			}
		},
		// 正计时
		countUp() {
			this.s++;
			if (this.s >= 60) {
				this.s = 0;
				this.m++;
				if (this.m >= 60) {
					this.m = 0;
					this.h++;
				}
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	.timer {
		box-sizing: border-box;
		background-color: #fff;
		width: 90vw;
		margin-top: 40rpx;
		padding: 10rpx 20rpx;
		border-left: 20rpx solid #0161b8;
		
		.timer-mode {
			background-color: #0161b8;
			color: #fff;
			padding: 10rpx;
			border-radius: 10rpx;
		}
	}
	.row {
		margin-top: 14rpx;
	}
	.row-1 {
		display: flex;
		justify-content: space-between;
		
		.btn-control {
			.iconfont {
				color: #fff;
				background-color: #0161b8;
				padding: 10rpx;
				border-radius: 20rpx;
			}
		}
		.btn-1 {
			margin-right: 50rpx;
		}
		
	}
	.row-2 {
		padding-left: 10rpx;
	}
	.row-3 {
		color: #0161b8;
		font-size: 72rpx;
		font-weight: bold;
		text-align: center;
	}
</style>

<template>
	<view>
		<comHeader></comHeader>
		<view class="count">
			<text>{{ count + "/10" }}</text>
		</view>
		<textarea :value="taskName" @input="handleInput" focus placeholder="请输入任务的名称" maxlength="10" />
		<view class="btn" @click="handleBtnClick"><text>保存</text></view>
	</view>
</template>

<script>
	import comHeader from "../../components/com-header.vue";
	export default {
		data() {
			return {
				taskName: "",
				count: 0
			}
		},
		components: {
			comHeader
		},
		methods: {
			handleInput(e) {
				this.taskName = e.detail.value;
				this.count = this.taskName.length;
			},
			handleBtnClick() {
				if (this.count == 0) {
					uni.showToast({
						title:"不能为空!",
						icon: "none"
					});
				} else {
					this.$bus.$emit("task-add", this.taskName);
					uni.switchTab({
						url: "./index"
					});	
				}
			}
		}
	}
</script>

<style scoped lang="scss">
.count {
	width: 100vw;
	margin-top: 20rpx;
	color: #ccc;
	background-color: #fff;
	text-align: right;
	font-size: 28rpx;
}
textarea {
	width: 100vw;
	padding-left: 20rpx;
	height: 200rpx;
	background-color: #fff;
}
.btn {
	width: 90vw;
	margin: 40rpx auto;
	padding: 20rpx 0;
	text-align: center;
	color: #fff;
	background-color: $color-blue;
}
</style>

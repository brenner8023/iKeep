<template>
	<view class="content">
		<comHeader></comHeader>
		<comTimer ref="comTimer" v-if="listOfTask.length"></comTimer>
		<view>
			<block v-for="(item, idx) in listOfTask" :key="item.name">
				<comTask :idx="idx" :name="item.name" :color="item.color"></comTask>
			</block>
			<view class="task-add">
				<navigator url="./taskadd">
					<text class="iconfont icon-tianjia1"></text>
					<text>添加任务</text>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
import comHeader from "../../components/com-header.vue";
import comTimer from "../../components/com-timer.vue";
import comTask from "../../components/com-task.vue";
import indexService from "../../api/index.js";
import genBrightColors from "../../util/genBrightColors.js";
import {mapState} from "vuex";

export default {
	data() {
		return {}
	},
	computed: {
		...mapState(["listOfTask", "clockIdx", "isPlay"])
	},
	components: {
		comHeader,
		comTimer,
		comTask
	},
	created() {
		this.$bus.$on("task-add", async name => {
			let arr = this.listOfTask.map(item => Number(item.color.match(/[0-9]*/g)[0])),
				color = genBrightColors(arr),
				create_time = await indexService.getCurrDate().then(res => res.time);
			indexService.addTask({
				name,
				color,
				arr: [],
				create_time
			}).then(_id => {
				this.$store.commit("addTaskListItem", {
					_id,
					name,
					color,
					arr: [],
					create_time
				});
			});
		});
	}
}
</script>

<style scoped lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.task-add {
		width: 30vw;
		margin: 50rpx auto;
		padding: 10rpx 20rpx;
		text-align: center;
		background-color: #fff;
		color: $color-blue;
		border-radius: 10rpx;
	}
</style>

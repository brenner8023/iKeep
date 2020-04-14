import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		openid: "",
		listOfTask: [],
		clockIdx: 0, // 选中打卡的任务索引
		isPlay: 0, // 是否正在计时，0表示不是，1表示正在计时
	},
	mutations: {
		initOpenid(state, openid) {
			state.openid = openid;
		},
		initTaskList(state, arr) {
			state.listOfTask.push(...arr);
		},
		addTaskListItem(state, item) {
			state.listOfTask.push(item);
		},
		delTaskListItem(state, idx) {
			state.listOfTask.splice(idx, 1);
		},
		changeIsPlay(state, v=null) {
			if (v === null)
				state.isPlay = +!state.isPlay;
			else state.isPlay = 0;
		},
		changeClockIdx(state, idx) {
			state.clockIdx = idx;
		}
	}
});

export default store;
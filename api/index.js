class IndexService {
	constructor() {
		if (!wx.cloud) {
			console.error("请使用 2.2.3 或以上的基础库以使用云能力");
		} else {
			wx.cloud.init({
				traceUser: true,
				env: "pre-release-wzzz1"
			});
		}
		this.db = wx.cloud.database();
		this.task = this.db.collection("task");
	}
	// 添加任务
	async addTask(data) {
		let [err, _id] = await this.task.add({data}).then(res => [null, res._id]).catch(err => [err, ""]);
		if (err) {
			uni.showToast({
				title: "添加失败，请重试",
				icon: "none"
			});
		} else {
			uni.showToast({
				title: "添加成功"
			});
			return _id;
		}
	}
	removeTask(id) {
		this.task.doc(id).remove({
			success: function() {
				uni.showToast({
					title: "删除成功",
					icon: "none"
				});
			},
			fair: function() {
				uni.showToast({
					title: "删除失败，请重试",
					icon: "none"
				});
			}
		});
	}
	// 获取服务端时间
	async getCurrDate() {
		let res = await wx.cloud.callFunction({
			name: "getServerDate"
		}).then(data => {
			let {time, year, month, date} = data.result;
			return {
				time, year, month, date
			};
		}).catch(err => {
			console.error('[云函数] [login] 调用失败', err);
		});
		
		return res;
	}
	// 更新任务的打卡积累时间
	async updateTaskTime(task, duration, time=null) {
		let res;
		if (time) {
			res = time;
		} else {
			await this.getCurrDate().then(data => {
				res = data.time;
			});
		}

		let	arr = task.arr,
			flag = 1;
		
		for (let i = arr.length - 1; i >= 0; i--) {
			let d1 = (new Date(arr[i].date)).getDate(),
				d2 = (new Date(res)).getDate();
			if (d1 == d2) {
				arr[i].count += duration;
				flag = 0;
				break;
			}
		}
		if (flag) {
			arr[arr.length] = {
				date: res,
				count: duration
			};
		}
		this.task.doc(task._id).update({
			data: {
				arr
			}
		}).then(() => {
			uni.showToast({
				title: "添加成功"
			});
		});	
	}
	async getAllTask() {
		let res = await this.task.get();
		return res;
	}
	async getOpenid() {
		let _openid = await new Promise((resolve, reject) => {
			wx.cloud.callFunction({
			  name: 'login',
			  success: res => {
				resolve(res.result.openid);
			  },
			  fail: err => {
				console.error('[云函数] [login] 调用失败', err);
				reject(err);
			  }
			});
		});
		return _openid;
	}
}

export default new IndexService();
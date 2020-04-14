<script>
import "./scss/iconfont.scss";
import indexService from "api/index.js";

export default {
	data() {
		return {};
	},
	onLaunch: function() {
		console.log('App Launch');		
		indexService.getOpenid().then(res => {
			this.$store.commit("initOpenid", res);
		});
		indexService.getAllTask(this.$root.openid).then(res => {
			this.$store.commit("initTaskList", res.data);
		});
	},
	onShow: function() {
		uni.setKeepScreenOn({
		    keepScreenOn: true
		});
	},
	onHide: function() {
		console.log('App Hide')
	}
}
</script>

<style lang="scss">
	/*每个页面公共css */
	page {
		background-color: #e9e9e9;
	}
</style>

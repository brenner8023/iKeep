/**
 * 随机生成鲜艳的颜色
 * @param {Array} arr hsl数值中的h组成的数组
 */
export default function(arr) {
	let res;
	while(true) {
		let h = Math.random() * 360;
		let flag = arr.every(item => 35 < Math.abs(item - h));
		if (flag) {
			res = `hsl(${h},80%,70%)`;
			break;
		}
	}
	return res;
}

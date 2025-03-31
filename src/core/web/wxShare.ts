import { ajax } from './ajax';

// sdk 不能加crossorign
// <script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
// 小程序分享得用这个
// <script src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>
/**
 * 判断是否是微信环境
 */
export function isWxClient() {
	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) && ua.match(/MicroMessenger/i)[0] == 'micromessenger') {
		return true;
	}
	return false;
}
/**
 * 初始化微信分享配置
 */
export function initWxConfig(callback?: (s: boolean) => void, debug: boolean = false) {
	if (!isWxClient()) {
		callback && callback(false);
		return;
	}
	//微信分享，获取分享签名
	ajax({
		type: 'GET',
		url: '/wechatShare/getShareInfo/v2',
		//或者中文编码encodeURIComponent，此链接再编码一次encodeURIComponent   20210309
		data: { url: window.location.href }, //有问题再检查链接//部分链接参数会导致初始化失败，以后中文参数用base，%用自定字符替换
		dataType: 'json',
		success: function (data) {
			if (data.success) {
				console.log('微信配置获取:');
				window['wx'].config({
					debug,
					appId: data.wxappid,
					timestamp: data.wxtimestamp,
					nonceStr: data.wxnonceStr,
					signature: data.wxsignature,
					jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'chooseImage'],
				});
				callback && callback(true);
			} else {
				callback && callback(false);
			}
		},
		error: function (data) {
			callback && callback(false);
		},
	});
}
/**
 * 初始化分享信息
 * @param title 标题
 * @param desc 描述，朋友圈无
 * @param link 主域名一致的链接，且是https
 * @param imgUrl 图片必须是https
 */
export function initWxShare(title: string, desc: string, link: string, imgUrl: string) {
	//执行ready可重新设置分享信息
	window['wx'].ready(function () {
		window['wx'].onMenuShareTimeline({
			title,
			link,
			imgUrl,
			success: function (res) {},
		});
		//监听“分享给朋友”按钮点击、自定义分享内容及分享结果接口
		window['wx'].onMenuShareAppMessage({
			title,
			desc,
			link,
			imgUrl,
			success: function (res) {},
		});
	});
}

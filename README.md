# react-native-webview-bridge
An  webview bridge for React Native.

`npm install react-native-webviewbridge --save`



# usage

```javascript
<WebViewBridge
	ref={webview => this.WebViewBridge = webview}
	onMessage={this.onMessage}
	source={{uri:'http://youurl.com/aaa.html'}}
/>
//网页发送信息给rn（string类型）  window.postMessage("发送的信息内容")
//rn发送信息给网页（必须是js代码）  this.WebViewBridge.runjs("alert('h5会弹出一个弹出框')")
```

import React, { Component } from 'react';
import {
    Text,
    WebView,
    ScrollView,
    PixelRatio,
    View,
    Platform,
    ActivityIndicator,
} from 'react-native';
const AUTO_HEIGHT='AUTO_HEIGHT';
export default class WebViewBridge  extends Component {
    constructor(e){
        super(e);

    }

    autoHeight(){
        this.props.autoHeight && this.runjs(`'${AUTO_HEIGHT}' + document.body.scrollHeight`);
    }
    runjs(js){
        const script = `window.postMessage(${js})`;
        this.WebViewBridge && this.WebViewBridge.injectJavaScript(script);
    }
    _onLoadEnd(e){
        this.autoHeight();
    }
    _onMessage (e) {
        //此段代码判断是否自动高度标记，如果是就设置view高度
        if(e.nativeEvent.data && e.nativeEvent.data.indexOf(AUTO_HEIGHT)==0){
            let height = Number(e.nativeEvent.data.substr(AUTO_HEIGHT.length));
            this.webviewAutoHeight.setNativeProps({style:{height}})
            return;
        }
        this.props.onMessage && this.props.onMessage(e.nativeEvent.data);
    }
    //注入html代码让h5调用
    _getInjectedJavaScript(){
        const patchPostMessageFunction = ()=> {
            let originalPostMessage = window.postMessage;
            let patchedPostMessage = (message, targetOrigin, transfer)=> {
                originalPostMessage(message, targetOrigin, transfer);
            };
            patchedPostMessage.toString =()=> {
                return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
            };
            window.postMessage = patchedPostMessage;
        };
        return '(' + String(patchPostMessageFunction) + ')();';
    }
 
    render() {
        return (
            <View ref={view => this.webviewAutoHeight = view}>
                  <WebView
                        ref={webview => this.WebViewBridge = webview}
                        injectedJavaScript={this._getInjectedJavaScript()}
                        onMessage={e=>this._onMessage(e)}
                        onLoadEnd = {e=>this._onLoadEnd(e)}
                        {...this.props}
                  />
            </View>
        );
    }
}

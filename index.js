
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

export default class WebViewBridge  extends Component {
    constructor(e){
        super(e);
    }
 
    runjs(js){
        const script = `window.postMessage(${js})`;
        this.WebViewBridge && this.WebViewBridge.injectJavaScript(script);
    }
    _onMessage (e) { 
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
              <WebView
                    ref={webview => this.WebViewBridge = webview}
                    injectedJavaScript={this._getInjectedJavaScript()} 
                    onMessage={o=>this._onMessage(o)} 
                    {...this.props}
              />
        );
    }
}

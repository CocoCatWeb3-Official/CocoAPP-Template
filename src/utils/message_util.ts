class MessageHandler {
  private messageCallbacks: { [key: string]: (data: any) => void } = {};

  constructor() {
    this.messageListener();
  }

  sendMessageToParent(
    cmd: string,
    payload: any,
    callback?: (data: any) => void
  ): void {
    const message = {
      cmd: cmd,
      ...payload,
    };

    if (window.parent) {
      window.parent.postMessage(message, "*");
      if (callback) {
        this.messageCallbacks[message.cmd + (message.messageId || "")] =
          callback;
      }
    } else {
      console.error(
        "Unable to send message to parent window. Parent window not found."
      );
    }
  }

  private messageListener(): void {
    window.addEventListener("message", (event: MessageEvent) => {
      const result = event.data;
      if (typeof result !== "undefined") {
        const callback =
          this.messageCallbacks[result.cmd + (result.messageId || "")];
        if (callback) {
          callback(result);
          delete this.messageCallbacks[result.cmd + (result.messageId || "")];
        }
      }
    });
  }
}

const setupWebViewJavascriptBridge = (callback: any) => {
  if (window.WebViewJavascriptBridge) {
    callback(window.WebViewJavascriptBridge);
  } else {
    document.addEventListener(
      "WebViewJavascriptBridgeReady",
      function () {
        callback(window.WebViewJavascriptBridge);
      },
      false
    );
  }

  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }

  window.WVJBCallbacks = [callback];

  const WVJBIframe = document.createElement("iframe");
  WVJBIframe.style.display = "none";
  WVJBIframe.src = "https://__bridge_loaded__";
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function () {
    document.documentElement.removeChild(WVJBIframe);
  }, 0);
};

const cocoBridge = (data: any, successCallback: any, timeout?: any) => {
  try {
    window.cocoBridge.callHandler("bridgeHandler", function (result: any) {
      const response = typeof result === "string" ? JSON.parse(result) : result;
      console.log("===", response);
      console.log("successCallback", successCallback);
      if (successCallback) {
        successCallback(response);
      }
    });
  } catch (e) {
    console.error("Bridge method does not exist");
  }
};

export { MessageHandler, setupWebViewJavascriptBridge, cocoBridge };

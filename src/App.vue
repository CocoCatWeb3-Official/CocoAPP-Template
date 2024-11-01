<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import { provide } from "vue";
import {
  MessageHandler,
  setupWebViewJavascriptBridge,
  cocoBridge,
} from "./utils/message_util";
const messageHandler = new MessageHandler();

//regist
setupWebViewJavascriptBridge(function (bridge: any) {
  window.cocoBridge = bridge;
});

provide("messageHandler", messageHandler);
provide("cocoBridge", cocoBridge);
</script>

<style lang="less">
@import url("@/assets/css/common.less");
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

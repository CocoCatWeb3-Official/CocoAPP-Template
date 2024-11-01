<template>
  <div class="home cocoapp-page" >
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
    <div class="api-form">
        <div class="api-col">
           
          <h2 class="p-title">Demo</h2>
          <h3 class="align-left p-ititle">connectCocoPay</h3>

          <div class="api-label api-label1">PARAMS</div>
          <div class="param-body"> 
              <div
                class="d-in"
                v-for="(parameter, paramIndex) in API.parameter"
                :key="paramIndex"
              >
                <div class="d-label align-left">{{ parameter.label }}{{parameter.type}}</div>
                <input v-model="parameter.value" type="text" />
              </div>
            </div>
            <div class="btn-box">
              <button class="btn-default" @click="handleConfirm">Confirm</button>
            </div>
        </div>

        <div style="margin-top:30px">
          <div class="api-label api-label1">RESPONSE</div>
          <div class="response-body">

             <pre class="d-result align-left">{{API.result.trimStart()}}
              </pre>
          </div>
         
        </div>
      </div>
  </div>
</template>

<script lang="ts" setup>

import { defineComponent } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import { MessageHandler } from '@/utils/message_util'
import { inject, reactive } from 'vue'
const messageHandler = inject<MessageHandler>(
    'messageHandler'
) as MessageHandler

const API = reactive({
    label: 'connectCocoPay',
    parameter: [{ label: 'chainList', value:'ETH,BSC,POLYGON', type: 'Array' }],
    result: ''
})
/**onload */
// const onload = {
//     data: {
//         name:'template',
//         version:'1.0.0'
//     },
//     messageId: new Date().getTime() // The messageId may or may not be passed.
// }
// messageHandler.sendMessageToParent('onload', onload, function (event: any) {
//     const res = event
//     API.result = JSON.stringify(res,null,2).trim()
// })




const handleConfirm = () => {
    const chainIds = API.parameter[0].value.split(',')
    const obj = {
        data: {
            chainList: chainIds
        },
        messageId: new Date().getTime() // The messageId may or may not be passed.
    }
    messageHandler.sendMessageToParent(API.label, obj, function (event: any) {
        const res = event
        API.result = JSON.stringify(res,null,2).trim()
    })
        
}

</script>

<template>
    <div>{{ botWebhook }}</div>
    <a-input ref=botWebhookInput v-bind:addon-before="botWebhookAddonBefore"
             placeholder="企业微信群机器人webhook" v-model:value="botWebhook" />
    <button v-on:click="send">send</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'

export default defineComponent({
    data () {
        return {
            response: '' as string,
            botWebhook: '' as string,
            botWebhookAddonBefore: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key='
        };
    },
    methods: {
        send() {
            let that = this;
            axios.post('/qyapi/cgi-bin/webhook/send',
            {
                msgtype: "text",
                text: {
                    content: "测试消息"
                }
            },
            {
                params: {
                    key: this.botWebhook
                }
            }).then((value) => that.response = JSON.stringify(value.data));
        }
    }
});

</script>

<style lang="css">
  	
</style>
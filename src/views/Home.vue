<template>
    <div id="mainContainer">
        <div id="header">
            <a-input ref=botWebhookKeyInput v-bind:addon-before="botInterfaceUrl"
                placeholder="企业微信群机器人key" v-model:value="botMessage.key" />
        </div>
        <div id="center">
            <TaskList v-bind:tasks="botMessage.tasks"
                v-on:selected="onSelected"
                v-bind:selectedIndex="selectedIndex"
                v-on:addTask="onAddTask"></TaskList>
            <TaskSettings v-bind:task="botMessage.tasks[selectedIndex]"
                v-bind:botKey="botMessage.key"></TaskSettings>
        </div>
        <div id="footer">
            <a-button v-on:click="onDownloadConfig">下载配置文件</a-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import * as BotMessage from '../scripts/BotMessage'
import TaskList from './TaskList.vue'
import TaskSettings from './TaskSettings.vue'

export default defineComponent({
    components: {
        TaskList,
        TaskSettings
    },
    setup(props, context) {
        // 储存全局所有消息任务
        let botMessage = ref(new BotMessage.BotMessage());
        let task = new BotMessage.BotMessageTask();
        task.name = '任务1';
        botMessage.value.tasks.push(task);
        // 当前选中的任务
        let selectedIndex = ref(0);
        // 选择序号并切换
        function onSelected(index: number) {
            selectedIndex.value = index;
        }
        // 添加一个新任务
        function onAddTask() {
            // 收集所有任务名称，用于确保任务名称不重复
            let taskNameSet = new Set<string>();
            for (let x of botMessage.value.tasks) {
                taskNameSet.add(x.name);
            }
            let index = 1;
            let namePrefix = "任务";
            while (taskNameSet.has(`${namePrefix}${index}`) == true) {
                index++;
            }
            let task = new BotMessage.BotMessageTask();
            task.name = `${namePrefix}${index}`;
            botMessage.value.tasks.push(task);
        }
        // 群机器人接口地址
        const botInterfaceUrl = ref('https://qyapi.weixin.qq.com/cgi-bin/webhook/send');
        // 下载配置文件
        function onDownloadConfig() {
            alert(JSON.stringify(botMessage.value));
        }
        return {
            botMessage,
            selectedIndex,
            onSelected,
            onAddTask,
            botInterfaceUrl,
            onDownloadConfig
        }
    }
});

</script>

<style lang="css">
#center {
    width: 100%;
    height: 100%;
    display: flex;
}
</style>
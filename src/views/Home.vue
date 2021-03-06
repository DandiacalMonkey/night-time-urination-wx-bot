<template>
    <div id="container">
        <div id="title">
            <a-space id="titleSpaceLeft">
                <a-switch v-on:change="onScheduleChange" v-model:checked="isScheduleStart" />
                <span>开启定时任务</span>
            </a-space>
            <a-space id="titleSpaceRight" align="end">
                <a-button v-on:click="onDownloadScript">下载运行脚本</a-button>
                <a-button v-on:click="onDownloadConfig">下载配置文件</a-button>
                <a-button v-on:click="onLoadConfig">加载配置文件</a-button>
            </a-space>
            <div id="botWebhookKeyInputContainer">
                <a-input id="botWebhookKeyInput" ref=botWebhookKeyInput v-bind:addon-before="botInterfaceUrl"
                    placeholder="企业微信群机器人key" v-model:value="botMessage.key" />
            </div>
        </div>
        <a-divider id="titleDivider" />
        <div id="mainContainer">
            <TaskList id="taskList"
                v-bind:tasks="botMessage.tasks"
                v-on:selected="onSelected"
                v-bind:selectedIndex="selectedIndex"
                v-on:addTask="onAddTask"></TaskList>
            <TaskSettings id="taskSettings"
                v-bind:task="botMessage.tasks[selectedIndex]"
                v-bind:botKey="botMessage.key"></TaskSettings>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed } from 'vue'
import * as BotMessage from '../scripts/BotMessage'
import TaskList from './TaskList.vue'
import TaskSettings from './TaskSettings.vue'
import BotMessageSender from '../scripts/BotMessageSender'

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
        // 下载运行脚本
        function onDownloadScript() {
            let downloadAnchor: HTMLAnchorElement = document.createElement('a');
            downloadAnchor.download = 'schedule.js';
            downloadAnchor.href = window.location + 'schedule.js';
            downloadAnchor.click();
        };
        // 群机器人接口地址
        const botInterfaceUrl = ref('https://qyapi.weixin.qq.com/cgi-bin/webhook/send');
        // 下载配置文件
        function onDownloadConfig() {
            let downloadAnchor: HTMLAnchorElement = document.createElement('a');
            downloadAnchor.download = 'config.txt';
            downloadAnchor.href = URL.createObjectURL(new Blob([JSON.stringify(botMessage.value)], {type: 'text/plain'}));
            downloadAnchor.click();
        }
        // 读取配置文件
        function onLoadConfig() {
            let fileInput = document.createElement('input');
            fileInput.setAttribute('type', 'file');
            fileInput.onchange = () => {
                if (fileInput.files &&
                fileInput.files.length > 0) {
                    const file = fileInput.files[0];
                    if (file.name.length != 0) {
                        let reader = new FileReader();
                        reader.onload = () => {
                            botMessage.value = JSON.parse(reader.result as string);
                        };
                        reader.readAsText(file);
                    }
                }
            };
            fileInput.click();
        }
        // 开始定时任务
        let sender = new BotMessageSender();
        function onScheduleChange(checked: boolean) {
            if (checked === true) {
                sender.sendMessageSchedule('/qyapi/cgi-bin/webhook/send', botMessage.value);
            } else {
                sender.cancelSendMessageSchedule();
            }
        }
        return {
            botMessage,
            selectedIndex,
            onSelected,
            onAddTask,
            botInterfaceUrl,
            onDownloadScript,
            onDownloadConfig,
            onLoadConfig,
            onScheduleChange,
            isScheduleStart: ref(false)
        }
    }
});

</script>

<style lang="css">
#container {
    width: 100%;
    height: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
}
#title {
    width: 100%;
    padding: 15px;
    display: flex;
    flex-wrap: wrap;
}
#titleSpaceRight {
    flex: 1 1 auto;
    display: flex;
    justify-content: flex-end;
}
#botWebhookKeyInputContainer {

    width: 100%;
    padding-top: 10px;
}

#titleDivider {
    margin: 0px;
}

#mainContainer {
    flex-grow: 1;
    display: flex;
    align-items: stretch;
    position: relative;
    overflow: hidden;
}
#header {
    margin: 15px;
}
#taskList {
    width: 200px;
    overflow-x: hidden;
    overflow-y: scroll;
    position: relative;
}

</style>
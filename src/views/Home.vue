<template>
    <TaskList v-bind:tasks="botMessage.tasks" v-on:selected="onSelected"
              v-bind:selectedIndex="selectedIndex"></TaskList>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import * as BotMessage from '../scripts/BotMessage'
import TaskList from './TaskList.vue'

export default defineComponent({
    components: {
        TaskList
    },
    setup(props, context) {
        // 储存全局所有消息任务
        let botMessage = ref(new BotMessage.BotMessage());
        let task = new BotMessage.BotMessageTask();
        task.name = '任务1';
        botMessage.value.tasks.push(task);
        botMessage.value.tasks.push(task);
        botMessage.value.tasks.push(task);
        botMessage.value.tasks.push(task);
        // 当前选中的任务
        let selectedIndex = ref(0);
        // 选择序号并切换
        function onSelected(index: number) {
            selectedIndex.value = index;
        }
        return {
            botMessage,
            selectedIndex,
            onSelected,
        }
    }
});

</script>

<style lang="css">
  	
</style>